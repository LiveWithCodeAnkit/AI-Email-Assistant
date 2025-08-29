// Lightweight agent memory with localStorage persistence
// Stores user preferences, recent contexts, and past emails (summaries)

class AgentMemory {
  constructor() {
    this.storageKey = 'agent_memory_v1';
    this.data = {
      preferences: {},
      contexts: [], // { ts, recipientType, purpose }
      emailSummaries: [] // { ts, to, subject, summary }
    };
    this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) this.data = { ...this.data, ...JSON.parse(raw) };
    } catch {}
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch {}
  }

  clear() {
    this.data = { preferences: {}, contexts: [], emailSummaries: [] };
    this.save();
  }

  setPreference(key, value) {
    this.data.preferences[key] = value;
    this.save();
  }

  getPreference(key, fallback = null) {
    return this.data.preferences[key] ?? fallback;
  }

  addContext(ctx) {
    this.data.contexts.unshift({ ts: Date.now(), ...ctx });
    this.data.contexts = this.data.contexts.slice(0, 100);
    this.save();
  }

  addEmailSummary(entry) {
    this.data.emailSummaries.unshift({ ts: Date.now(), ...entry });
    this.data.emailSummaries = this.data.emailSummaries.slice(0, 200);
    this.save();
  }

  toPromptLines() {
    const prefs = Object.entries(this.data.preferences).map(([k,v]) => `- ${k}: ${v}`);
    const lastCtx = this.data.contexts.slice(0, 5).map(c => `- ${c.recipientType} / ${c.purpose}`);
    return [
      prefs.length ? `PREFERENCES:\n${prefs.join('\n')}` : '',
      lastCtx.length ? `RECENT CONTEXTS:\n${lastCtx.join('\n')}` : ''
    ].filter(Boolean).join('\n\n');
  }
}

export default AgentMemory;
