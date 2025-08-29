// Client-side email transport service (mock). In real use, proxy to a backend.
// Stores minimal config in localStorage. Do NOT store real passwords in production.

class EmailTransportService {
  constructor() {
    this.storageKey = 'email_transport_cfg_v1';
    this.cfg = this.load() || { provider: 'mock', host: '', port: 587, username: '', from: '' };
  }

  load() {
    try { return JSON.parse(localStorage.getItem(this.storageKey)); } catch { return null; }
  }

  save() {
    try { localStorage.setItem(this.storageKey, JSON.stringify(this.cfg)); } catch {}
  }

  setConfig(cfg) {
    this.cfg = { ...this.cfg, ...cfg };
    this.save();
  }

  getConfig() { return { ...this.cfg }; }

  clearConfig() {
    this.cfg = { provider: 'mock', host: '', port: 587, username: '', from: '' };
    try { localStorage.removeItem(this.storageKey); } catch {}
  }

  canSend() {
    // In mock mode, always true if from is set
    return !!this.cfg.from;
  }

  async sendEmail({ to, subject, text }) {
    if (!this.canSend()) throw new Error('Email transport not configured. Set From address.');
    // Mock: pretend to send and resolve
    const messageId = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    // In real impl, POST to backend which uses Nodemailer
    return { messageId, provider: this.cfg.provider, to, subject, from: this.cfg.from };
  }
}

const emailTransportService = new EmailTransportService();
export default emailTransportService;
