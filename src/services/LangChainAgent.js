// Minimal LangChain agent for /agent route
// Uses OpenAI chat model via LangChain to infer context and refine

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

class LangChainAgent {
  constructor({ getApiKey }) {
    this.getApiKey = getApiKey;
    this.modelName = 'gpt-4o-mini';
  }

  getChat() {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error('OpenAI API key not set');
    return new ChatOpenAI({
      apiKey,
      model: this.modelName,
      temperature: 0.3
    });
  }

  async inferContext(unstructuredEmail) {
    const chat = this.getChat();
    const messages = [
      new SystemMessage('You infer email context and respond ONLY in compact JSON.'),
      new HumanMessage(`EMAIL:\n${unstructuredEmail}\n\nReturn: {"recipientType":"...","purpose":"...","urgency":"low|medium|high"}`)
    ];
    const res = await chat.invoke(messages);
    try {
      return JSON.parse(res.content);
    } catch {
      return { recipientType: 'Other', purpose: 'Other', urgency: 'low' };
    }
  }

  async refineEmail({ unstructuredEmail, recipientType, purpose, templateTitle, customPrompt, kbSnippets }) {
    const chat = this.getChat();
    const kb = Array.isArray(kbSnippets) && kbSnippets.length
      ? `\nKNOWLEDGE BASE:\n${kbSnippets.map((t, i) => `(${i+1}) ${t}`).join('\n')}`
      : '';
    const sys = new SystemMessage('You are an expert corporate email writer. Respond ONLY with the final email, no explanations.');
    const user = new HumanMessage(`ORIGINAL (unstructured):\n${unstructuredEmail}\n\nCONTEXT:\n- Recipient: ${recipientType}\n- Purpose: ${purpose}\n- Template: ${templateTitle || 'None'}\n- Custom: ${customPrompt || 'None'}${kb}\n\nRefine into a professional, well-structured email with subject, proper salutations, bullet points when helpful, and a clear closing.`);
    const res = await chat.invoke([sys, user]);
    return typeof res.content === 'string' ? res.content.trim() : String(res.content ?? '');
  }
}

export default LangChainAgent;
