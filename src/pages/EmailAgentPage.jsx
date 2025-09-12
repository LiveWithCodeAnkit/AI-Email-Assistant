import React, { useEffect, useMemo, useState } from 'react';
import ApiKeyManager from '../components/ApiKeyManager';
import CorporateGuidelines from '../components/CorporateGuidelines';
import KnowledgeBaseManager from '../components/KnowledgeBaseManager';
import TransportConfig from '../components/TransportConfig';
import EmailService from '../services/EmailService';
import EmailTransportService from '../services/EmailTransportService';
import RagService from '../services/RagService';
import AgentService from '../services/AgentService';
import LangChainAgent from '../services/LangChainAgent';
import AgentMemory from '../services/AgentMemory';
import AgentScheduler from '../services/AgentScheduler';
import { corporateTemplates } from '../templates/corporateTemplates';

function EmailAgentPage() {
  const [apiKeySet, setApiKeySet] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [logs, setLogs] = useState([]);
  const [useLangChain, setUseLangChain] = useState(true);
  const [scheduleAfterMins, setScheduleAfterMins] = useState(60);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [lastEmail, setLastEmail] = useState('');
  const [lastSubject, setLastSubject] = useState('');
  const [agentConfig, setAgentConfig] = useState({
    goals: {
      autoDraft: true,
      autoReply: true,
      autoFollowUp: true,
      prioritizeInbox: true
    },
    integrations: {
      smtp: false,
      imap: false,
      calendar: false,
      crm: false
    }
  });

  const rag = useMemo(() => new RagService(EmailService), []);
  const agent = useMemo(() => new AgentService({ emailService: EmailService, ragService: rag }), [rag]);
  const lcAgent = useMemo(() => new LangChainAgent({ getApiKey: () => EmailService.apiKey }), []);
  const memory = useMemo(() => new AgentMemory(), []);
  const scheduler = useMemo(() => new AgentScheduler(), []);

  useEffect(() => {
    scheduler.start();
    const unsub = scheduler.subscribe((event, payload) => {
      if (event === 'execute') {
        log(`Scheduled job executed: ${payload.type}`);
      }
      setScheduledCount(scheduler.list().filter(j => j.status === 'scheduled').length);
    });
    setScheduledCount(scheduler.list().filter(j => j.status === 'scheduled').length);
    return () => { unsub(); scheduler.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduler]);

  const log = (message) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${message}`]);
  };

  const extractSubject = (emailText) => {
    const m = /^Subject:\s*(.+)$/im.exec(emailText || '');
    return m ? m[1].trim() : 'No Subject';
  };

  const startAgent = async () => {
    if (!apiKeySet) {
      log('API key not set');
      return;
    }
    setStatus('Running');
    log(`Agent started (${useLangChain ? 'LangChain' : 'Native'})`);

    try {
      const sampleDraft = 'hi boss, did many things, pushed code and meeting. need help maybe tmr. thanks';

      const retrieved = await rag.retrieve('daily update manager progress tasks help');
      const kbSnippets = retrieved.map((r) => r.text);
      const memoryLines = memory.toPromptLines();

      if (useLangChain) {
        const inferred = await lcAgent.inferContext(sampleDraft);
        log(`LC Inferred -> recipient: ${inferred.recipientType}, purpose: ${inferred.purpose}, urgency: ${inferred.urgency}`);
        memory.addContext({ recipientType: inferred.recipientType, purpose: inferred.purpose });
        const template = corporateTemplates.find(t => t.category === inferred.purpose) || null;
        const finalEmail = await lcAgent.refineEmail({
          unstructuredEmail: `${sampleDraft}\n\n${memoryLines ? `MEMORY:\n${memoryLines}` : ''}`.trim(),
          recipientType: inferred.recipientType,
          purpose: inferred.purpose,
          templateTitle: template?.title,
          customPrompt: '',
          kbSnippets
        });
        setLastEmail(finalEmail);
        setLastSubject(extractSubject(finalEmail));
        log(`Final Email (LC):\n${finalEmail}`);
        scheduleFollowUp(inferred);
      } else {
        log('Inferring context and orchestrating refinement');
        const { finalEmail, inferred, usedTemplate } = await agent.draftAndFinalize({
          unstructuredEmail: `${sampleDraft}\n\n${memoryLines ? `MEMORY:\n${memoryLines}` : ''}`.trim(),
          corporateTemplates,
          customPrompt: ''
        });
        memory.addContext({ recipientType: inferred.recipientType, purpose: inferred.purpose });
        setLastEmail(finalEmail);
        setLastSubject(extractSubject(finalEmail));
        log(`Inferred -> recipient: ${inferred.recipientType}, purpose: ${inferred.purpose}, urgency: ${inferred.urgency}`);
        log(`Template used: ${usedTemplate || 'none'}`);
        log(`Final Email:\n${finalEmail}`);
        scheduleFollowUp(inferred);
      }
    } catch (e) {
      log(`Error: ${e.message}`);
    } finally {
      setStatus('Idle');
      log('Agent stopped');
    }
  };

  const scheduleFollowUp = (inferred) => {
    const mins = Number(scheduleAfterMins) || 60;
    const runAt = Date.now() + mins * 60 * 1000;
    const id = scheduler.addJob({ type: 'follow-up-check', runAt, payload: { inferred } });
    log(`Scheduled follow-up check in ${mins} mins (job ${id})`);
    setScheduledCount(scheduler.list().filter(j => j.status === 'scheduled').length);
  };

  const sendLatest = async () => {
    if (!lastEmail) { log('No email generated yet'); return; }
    try {
      const cfg = EmailTransportService.getConfig();
      const res = await EmailTransportService.sendEmail({ to: cfg.from, subject: lastSubject, text: lastEmail });
      log(`Mock sent message ${res.messageId} to ${res.to}`);
    } catch (e) {
      log(`Send failed: ${e.message}`);
    }
  };

  const stopAgent = () => {
    setStatus('Idle');
    log('Agent manually stopped');
  };

  return (
    <div className="min-h-screen gradient-bg py-8 text-white">
      <div className="container mx-auto px-4 max-w-6xl animate-fade-in">
        <header className="mb-8 text-center">
          <div className="animate-float inline-block mb-4">
            <span className="text-6xl">✉️</span>
            <span className="text-5xl ml-2">🤖</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 animate-pulse-slow">AI Email Agent</h1>
          <p className="text-xl text-white mt-2 opacity-80">
            Autonomous email drafting, replies, and follow-ups (RAG-enabled)
          </p>
        </header>

        <ApiKeyManager onApiKeySet={(key) => setApiKeySet(!!key)} />

        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 mb-8 border border-white border-opacity-20">
          <label className="flex items-center gap-3 text-white">
            <input type="checkbox" checked={useLangChain} onChange={(e) => setUseLangChain(e.target.checked)} />
            Use LangChain Agent
          </label>
          <div className="mt-4 flex items-center gap-3 text-white">
            <span>Follow-up in (mins):</span>
            <input
              type="number"
              min="1"
              value={scheduleAfterMins}
              onChange={(e) => setScheduleAfterMins(e.target.value)}
              className="w-24 px-3 py-2 bg-black bg-opacity-25 border border-white border-opacity-30 rounded"
            />
            <span className="text-sm text-white text-opacity-80">Scheduled: {scheduledCount}</span>
            <button onClick={sendLatest} className="ml-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded">Send Latest (Mock)</button>
          </div>
        </div>

        <TransportConfig onTestSend={(res) => log(`Mock test sent ${res.messageId}`)} />

        <KnowledgeBaseManager rag={rag} disabled={!apiKeySet} />

        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 mb-8 border border-white border-opacity-20">
          <h3 className="text-white text-lg font-semibold mb-4">Agent Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(agentConfig.goals).map(([k, v]) => (
              <label key={k} className="flex items-center gap-3 text-white bg-white bg-opacity-5 p-3 rounded border border-white border-opacity-20">
                <input
                  type="checkbox"
                  checked={v}
                  onChange={(e) => setAgentConfig((prev) => ({ ...prev, goals: { ...prev.goals, [k]: e.target.checked } }))}
                />
                <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 mb-8 border border-white border-opacity-20">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            <span>Status: </span>
            <span className={`font-mono ${status === 'Running' ? 'text-green-400' : 'text-yellow-300'}`}>{status}</span>
          </h3>
          <div className="flex gap-3">
            <button
              onClick={startAgent}
              disabled={!apiKeySet || status === 'Running'}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-200"
            >
              ▶ Start Agent
            </button>
            <button
              onClick={stopAgent}
              disabled={status !== 'Running'}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-200"
            >
              ■ Stop Agent
            </button>
          </div>

          <div className="mt-6">
            <div className="text-white text-sm font-semibold mb-2">Agent Logs</div>
            <div className="border border-white border-opacity-30 rounded-lg p-4 bg-black bg-opacity-25 backdrop-filter backdrop-blur-sm h-60 overflow-auto">
              {logs.length === 0 ? (
                <div className="text-white text-opacity-60">No logs yet.</div>
              ) : (
                <pre className="whitespace-pre-wrap text-white text-sm">{logs.join('\n')}</pre>
              )}
            </div>
          </div>
        </div>

        <CorporateGuidelines />

        <footer className="mt-12 text-center text-white text-sm animate-fade-in">
          <p>AI Email Agent ✨ &copy; {new Date().getFullYear()} ✨</p>
        </footer>
      </div>
    </div>
  );
}

export default EmailAgentPage;
