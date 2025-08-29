import templateEngine from './TemplateEngine';

// AgentService orchestrates autonomous email tasks for the /agent route
// No external deps; composes EmailService + RagService

class AgentService {
  constructor({ emailService, ragService }) {
    this.emailService = emailService;
    this.ragService = ragService;
  }

  // Infer basic context (recipient type, purpose) from the unstructured draft
  async inferContext(unstructuredEmail) {
    const prompt = `You are an assistant that infers email context.\n\nEMAIL:\n${unstructuredEmail}\n\nInfer the following fields and respond in strict JSON only with keys: recipientType, purpose, urgency (low|medium|high):\n{\n  "recipientType": "Colleague|Manager|Client|Service Provider|Other",\n  "purpose": "Daily Update|Status Update|Question / Clarification|Request|Meeting Follow-up|Client Communication|To-Do Update|Other",\n  "urgency": "low|medium|high"\n}`;

    const raw = await this.emailService.callOpenAI(prompt);
    try {
      const parsed = JSON.parse(raw);
      return {
        recipientType: parsed.recipientType || 'Other',
        purpose: parsed.purpose || 'Other',
        urgency: parsed.urgency || 'low'
      };
    } catch {
      return { recipientType: 'Other', purpose: 'Other', urgency: 'low' };
    }
  }

  // Choose a template id based on inferred purpose
  chooseTemplateByPurpose(corporateTemplates, purpose) {
    // Exact category match first; fallback to heuristic contains
    const exact = corporateTemplates.find(t => t.category === purpose);
    if (exact) return exact;
    const lower = purpose.toLowerCase();
    const fuzzy = corporateTemplates.find(t => t.category.toLowerCase().includes(lower) || t.title.toLowerCase().includes(lower));
    return fuzzy || null;
  }

  // Orchestrate: infer -> retrieve KB -> optional render -> refine -> return final
  async draftAndFinalize({ unstructuredEmail, corporateTemplates, customPrompt }) {
    const inferred = await this.inferContext(unstructuredEmail);

    let kbSnippets = [];
    try {
      const retrieved = await this.ragService.retrieve(`${inferred.purpose} ${inferred.recipientType} ${unstructuredEmail}`);
      kbSnippets = retrieved.map(r => r.text);
    } catch {}

    const selectedTemplate = this.chooseTemplateByPurpose(corporateTemplates, inferred.purpose);

    // If we have a template, render a pre-structured draft using the template engine
    let preStructured = unstructuredEmail;
    if (selectedTemplate) {
      const baseVars = {
        date: new Date().toISOString().slice(0, 10),
        projectName: 'the project',
        currentStatus: 'on track',
        milestones: [],
        nextSteps: [],
        eta: 'TBD',
        highlights: [],
        nextFocus: [],
        helpNeeded: []
      };
      try {
        preStructured = templateEngine.render(selectedTemplate.generate(baseVars), baseVars);
      } catch {
        // fallback to original
      }
    }

    if (selectedTemplate) {
      const result = await this.emailService.refineEmailWithTemplate(
        preStructured,
        selectedTemplate,
        inferred.recipientType,
        customPrompt,
        kbSnippets
      );
      return { finalEmail: result, inferred, usedTemplate: selectedTemplate.id };
    } else {
      const result = await this.emailService.adjustEmailStyle(
        unstructuredEmail,
        'professional',
        inferred.recipientType,
        inferred.purpose,
        customPrompt,
        kbSnippets
      );
      return { finalEmail: result, inferred, usedTemplate: null };
    }
  }

  computeFollowUpSuggestion(inferred) {
    if (inferred.urgency === 'high') return 'Follow up in 24 hours.';
    if (inferred.urgency === 'medium') return 'Follow up in 2-3 days.';
    return 'Follow up in a week if no response.';
  }
}

export default AgentService;
