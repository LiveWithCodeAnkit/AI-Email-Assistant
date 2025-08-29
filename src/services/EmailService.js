// Advanced AI-Powered Email Service with OpenAI Integration
// Enhanced for accuracy, context awareness, and professional results

class EmailService {
  constructor() {
    this.apiKey = null;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-4'; // Upgraded to GPT-4 for better accuracy
    this.maxTokens = 1500;
    this.temperature = 0.3; // Lower temperature for more consistent results
  }

  // Set API key for the session
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // Check if API key is set
  hasApiKey() {
    return this.apiKey && this.apiKey.trim() !== '';
  }

  // Enhanced email analysis and refinement
  async analyzeAndRefineEmail(email, context = {}) {
    if (!this.hasApiKey()) {
      throw new Error('Please enter your OpenAI API key to use AI features');
    }

    if (!email || email.trim() === '') {
      throw new Error('Please enter an email to analyze and refine');
    }

    try {
      const analysis = await this.analyzeEmailContent(email, context);
      const refinedEmail = await this.refineBasedOnAnalysis(email, analysis, context);
      return refinedEmail;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error(`Email analysis failed: ${error.message}`);
    }
  }

  // Analyze email content for improvement opportunities
  async analyzeEmailContent(email, context) {
    const analysisPrompt = `You are an expert email analyst and communication specialist.

TASK: Analyze the following email and provide specific improvement recommendations.

EMAIL TO ANALYZE:
${email}

CONTEXT:
- Recipient Type: ${context.recipientType || 'General'}
- Purpose: ${context.purpose || 'General'}
- Template: ${context.template?.title || 'None'}

ANALYSIS REQUIREMENTS:
1. Identify the main message and intent
2. Assess clarity and structure
3. Check for professional tone appropriateness
4. Identify missing elements (subject, salutation, closing, etc.)
5. Suggest specific improvements
6. Rate overall effectiveness (1-10)

Provide your analysis in this exact JSON format:
{
  "mainIntent": "string",
  "clarityScore": number,
  "structureScore": number,
  "toneScore": number,
  "missingElements": ["array of missing items"],
  "improvements": ["array of specific improvements"],
  "overallScore": number,
  "recommendations": "detailed recommendations"
}`;

    const response = await this.callOpenAI(analysisPrompt);
    try {
      return JSON.parse(response);
    } catch {
      throw new Error('Failed to analyze email content');
    }
  }

  // Refine email based on analysis
  async refineBasedOnAnalysis(email, analysis, context) {
    const kbSection = Array.isArray(context.kbSnippets) && context.kbSnippets.length
      ? `\n\nKNOWLEDGE BASE CONTEXT (use when relevant):\n${context.kbSnippets.map((t, i) => `(${i+1}) ${t}`).join('\n')}`
      : '';

    const refinementPrompt = `You are an expert email writer and communication specialist.\n\nTASK: Refine the following email based on the provided analysis and context.\n\nORIGINAL EMAIL:\n${email}\n\nANALYSIS RESULTS:\n${JSON.stringify(analysis, null, 2)}\n\nCONTEXT:\n- Recipient Type: ${context.recipientType || 'General'}\n- Purpose: ${context.purpose || 'General'}\n- Template: ${context.template?.title || 'None'}\n- Custom Instructions: ${context.customPrompt || 'None'}${kbSection}\n\nREFINEMENT INSTRUCTIONS:\n1. Address all identified issues from the analysis\n2. Implement the suggested improvements\n3. Maintain the original intent and key information\n4. Add missing elements (subject, proper salutations, closings)\n5. Improve structure and flow\n6. Ensure professional tone appropriate for the recipient\n7. Make it concise yet comprehensive\n8. Use bullet points where appropriate for clarity\n\nOUTPUT FORMAT:\n- Include a professional subject line\n- Use appropriate salutations and closings\n- Structure content logically\n- Maintain professional formatting\n\nPlease provide only the refined email content without any explanations or markdown formatting.`;

    return await this.callOpenAI(refinementPrompt);
  }

  // Main email adjustment function (enhanced)
  async adjustEmailStyle(email, tone, recipientType, emailPurpose, customPrompt = null, kbSnippets = []) {
    if (!this.hasApiKey()) {
      throw new Error('Please enter your OpenAI API key to use AI features');
    }

    if (!email || email.trim() === '') {
      throw new Error('Please enter an email to adjust');
    }

    try {
      const context = {
        recipientType,
        purpose: emailPurpose,
        tone,
        customPrompt,
        kbSnippets
      };

      return await this.analyzeAndRefineEmail(email, context);
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }

  // Enhanced template-based refinement
  async refineEmailWithTemplate(email, selectedTemplate, recipientType, customPrompt = null, kbSnippets = []) {
    if (!this.hasApiKey()) {
      throw new Error('Please enter your OpenAI API key to use AI features');
    }

    if (!email || email.trim() === '') {
      throw new Error('Please enter an email to refine');
    }

    if (!selectedTemplate) {
      throw new Error('Please select an email purpose/template');
    }

    try {
      const context = {
        recipientType,
        purpose: selectedTemplate.category,
        template: selectedTemplate,
        customPrompt,
        kbSnippets
      };

      return await this.analyzeAndRefineEmail(email, context);
    } catch (error) {
      console.error('AI Refinement Error:', error);
      throw new Error(`Email refinement failed: ${error.message}`);
    }
  }

  // Enhanced email improvement with AI
  async improveEmail(email, improvementType = 'general') {
    if (!this.hasApiKey()) {
      throw new Error('Please enter your OpenAI API key to use AI features');
    }

    if (!email || email.trim() === '') {
      throw new Error('Please enter an email to improve');
    }

    try {
      const improvementPrompt = this.buildAdvancedImprovementPrompt(email, improvementType);
      const response = await this.callOpenAI(improvementPrompt);
      return response;
    } catch (error) {
      console.error('AI Improvement Error:', error);
      throw new Error(`Email improvement failed: ${error.message}`);
    }
  }

  // Build advanced improvement prompt
  buildAdvancedImprovementPrompt(email, improvementType) {
    const improvementTypes = {
      'grammar': {
        focus: 'Fix all grammar, spelling, punctuation, and syntax errors',
        instructions: 'Correct all grammatical errors, improve sentence structure, and ensure proper punctuation throughout the email.'
      },
      'clarity': {
        focus: 'Improve clarity, remove ambiguity, and enhance readability',
        instructions: 'Make the message clearer, remove jargon, simplify complex sentences, and ensure the main points are easily understood.'
      },
      'professional': {
        focus: 'Make it more professional and business-appropriate',
        instructions: 'Enhance the business tone, use formal language where appropriate, and ensure the email reflects professional standards.'
      },
      'concise': {
        focus: 'Make it more concise while preserving all important information',
        instructions: 'Remove unnecessary words, combine related points, and make the email more direct and to-the-point.'
      },
      'persuasive': {
        focus: 'Make it more persuasive and compelling',
        instructions: 'Strengthen arguments, add supporting details, use persuasive language, and include clear calls-to-action.'
      },
      'general': {
        focus: 'Improve overall quality, grammar, clarity, and professionalism',
        instructions: 'Enhance all aspects of the email including grammar, clarity, tone, structure, and professional presentation.'
      }
    };

    const config = improvementTypes[improvementType] || improvementTypes.general;

    return `You are an expert email editor and communication specialist.

TASK: Improve the following email for better quality and effectiveness.

ORIGINAL EMAIL:
${email}

IMPROVEMENT FOCUS: ${config.focus}

DETAILED INSTRUCTIONS:
${config.instructions}

ADDITIONAL REQUIREMENTS:
1. Maintain the original intent and key information
2. Preserve the sender's voice while improving quality
3. Ensure appropriate tone for business communication
4. Add structure and formatting where beneficial
5. Include proper subject line if missing
6. Use professional salutations and closings
7. Make the email actionable and clear

Please provide only the improved email content without any explanations or markdown formatting.`;
  }

  async withRetry(fn, { retries = 3, baseDelayMs = 500 } = {}) {
    let attempt = 0;
    let lastErr;
    while (attempt < retries) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        const jitter = Math.floor(Math.random() * 200);
        const delay = baseDelayMs * Math.pow(2, attempt) + jitter;
        await new Promise(res => setTimeout(res, delay));
        attempt++;
      }
    }
    throw lastErr;
  }

  async callOpenAI(prompt) {
    return await this.withRetry(async () => {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert email writer and communication specialist with deep knowledge of business communication, professional writing, and email etiquette. Provide only the requested output without explanations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.maxTokens,
          temperature: this.temperature,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `API Error: ${response.status}`;
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key and try again.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status === 500) {
          throw new Error('OpenAI service temporarily unavailable. Please try again in a few minutes.');
        } else {
          throw new Error(`AI service error: ${errorMessage}`);
        }
      }
  
      const data = await response.json();
      const content = data.choices[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error('No response generated from AI service');
      }
  
      return content;
    });
  }

  // Validate API key format
  validateApiKey(apiKey) {
    return apiKey && apiKey.startsWith('sk-') && apiKey.length > 20;
  }

  // Test API key with enhanced validation
  async testApiKey(apiKey) {
    this.setApiKey(apiKey);
    
    try {
      const testPrompt = 'Please respond with "API key is valid" if you can read this message.';
      await this.callOpenAI(testPrompt);
      return true;
    } catch (error) {
      throw new Error(`API key validation failed: ${error.message}`);
    }
  }

  // Get email suggestions based on context
  async getEmailSuggestions(context) {
    if (!this.hasApiKey()) {
      throw new Error('Please enter your OpenAI API key to use AI features');
    }

    try {
      const suggestionPrompt = `You are an expert email consultant.

TASK: Provide 3-5 specific suggestions for improving email communication based on the given context.

CONTEXT:
- Recipient Type: ${context.recipientType || 'General'}
- Purpose: ${context.purpose || 'General'}
- Template: ${context.template?.title || 'None'}

Please provide practical, actionable suggestions for:
1. Tone and language
2. Structure and organization
3. Professional presentation
4. Clarity and effectiveness

Format as a simple list without explanations.`;

      const response = await this.callOpenAI(suggestionPrompt);
      return response.split('\n').filter(line => line.trim().length > 0);
    } catch (error) {
      console.error('Suggestion Error:', error);
      return [];
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

export default emailService;