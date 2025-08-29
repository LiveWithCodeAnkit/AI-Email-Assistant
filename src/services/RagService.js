// Simple client-side RAG service (in-memory with optional localStorage persistence)
// Uses OpenAI embeddings to index and retrieve relevant snippets

class RagService {
  constructor(emailService) {
    this.emailService = emailService; // reuse apiKey and fetch
    this.model = 'text-embedding-3-small';
    this.baseURL = 'https://api.openai.com/v1/embeddings';
    this.storageKey = 'kb_snippets_v1';
    this.store = [];
    this.loadFromStorage();
  }

  list() {
    return this.store.map(({ id, text }) => ({ id, text }));
  }

  saveToStorage() {
    try {
      const payload = this.store.map(({ id, text, embedding }) => ({ id, text, embedding }));
      localStorage.setItem(this.storageKey, JSON.stringify(payload));
    } catch {
      // ignore storage errors (e.g., quota)
    }
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.store = parsed.filter(Boolean).map((x) => ({ id: x.id, text: x.text, embedding: x.embedding }));
      }
    } catch {
      // ignore parse errors
    }
  }

  async addSnippet(text) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const embedding = await this.embed(text);
    this.store.push({ id, text, embedding });
    this.saveToStorage();
    return id;
  }

  clear() {
    this.store = [];
    this.saveToStorage();
  }

  clearStorage() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // ignore
    }
    this.store = [];
  }

  async embed(text) {
    if (!this.emailService.hasApiKey()) {
      throw new Error('Please enter your OpenAI API key to use RAG features');
    }

    const res = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.emailService.apiKey}`
      },
      body: JSON.stringify({
        input: text,
        model: this.model
      })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error?.message || `Embedding API error: ${res.status}`);
    }

    const data = await res.json();
    return data.data[0].embedding;
  }

  // cosine similarity
  static similarity(a, b) {
    let dot = 0, aMag = 0, bMag = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      aMag += a[i] * a[i];
      bMag += b[i] * b[i];
    }
    return dot / (Math.sqrt(aMag) * Math.sqrt(bMag) + 1e-12);
  }

  async retrieve(query, k = 3) {
    if (this.store.length === 0) return [];
    const qEmb = await this.embed(query);
    const scored = this.store.map((item) => ({
      item,
      score: RagService.similarity(qEmb, item.embedding)
    }));
    scored.sort((x, y) => y.score - x.score);
    return scored.slice(0, k).map((s) => ({ id: s.item.id, text: s.item.text, score: s.score }));
  }
}

export default RagService;
