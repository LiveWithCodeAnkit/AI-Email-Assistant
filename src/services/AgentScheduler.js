// Lightweight client-side scheduler for the /agent route
// Persists to localStorage and ticks every 5 seconds

class AgentScheduler {
  constructor() {
    this.storageKey = 'agent_scheduler_jobs_v1';
    this.jobs = [];
    this.listeners = new Set();
    this.intervalId = null;
    this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      this.jobs = raw ? JSON.parse(raw) : [];
    } catch {
      this.jobs = [];
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.jobs));
    } catch {}
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.tick(), 5000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(event, payload) {
    this.listeners.forEach((l) => {
      try { l(event, payload); } catch {}
    });
  }

  addJob({ type, runAt, payload }) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const job = { id, type, runAt, payload, status: 'scheduled', createdAt: Date.now() };
    this.jobs.push(job);
    this.save();
    this.emit('added', job);
    return id;
  }

  removeJob(id) {
    this.jobs = this.jobs.filter(j => j.id !== id);
    this.save();
    this.emit('removed', { id });
  }

  clearAll() {
    this.jobs = [];
    this.save();
    this.emit('cleared');
  }

  list() {
    return [...this.jobs].sort((a,b) => a.runAt - b.runAt);
  }

  tick() {
    const now = Date.now();
    const due = this.jobs.filter(j => j.status === 'scheduled' && j.runAt <= now);
    if (due.length === 0) return;
    due.forEach(j => { j.status = 'running'; });
    this.save();

    due.forEach((job) => {
      // For now, just emit execution; caller handles the action (e.g., send email)
      this.emit('execute', job);
      job.status = 'completed';
      job.completedAt = Date.now();
    });

    this.save();
  }
}

export default AgentScheduler;
