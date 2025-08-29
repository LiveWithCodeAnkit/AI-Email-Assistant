import React, { useState, useEffect } from 'react';
import EmailTransportService from '../services/EmailTransportService';

function TransportConfig({ onTestSend }) {
  const [from, setFrom] = useState('');
  const [provider, setProvider] = useState('mock');
  const [host, setHost] = useState('');
  const [port, setPort] = useState(587);
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const cfg = EmailTransportService.getConfig();
    setFrom(cfg.from || '');
    setProvider(cfg.provider || 'mock');
    setHost(cfg.host || '');
    setPort(cfg.port || 587);
    setUsername(cfg.username || '');
  }, []);

  const save = () => {
    EmailTransportService.setConfig({ from, provider, host, port: Number(port), username });
    setStatus('Saved');
    setTimeout(() => setStatus(''), 1500);
  };

  const clear = () => {
    EmailTransportService.clearConfig();
    setFrom(''); setProvider('mock'); setHost(''); setPort(587); setUsername('');
  };

  const testSend = async () => {
    try {
      const res = await EmailTransportService.sendEmail({ to: from, subject: 'Test Email', text: 'Hello from AI Email Agent (mock send).' });
      onTestSend?.(res);
      setStatus('Test sent');
      setTimeout(() => setStatus(''), 1500);
    } catch (e) {
      setStatus(e.message);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 mb-8 border border-white border-opacity-20">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">📨</span>
        <h3 className="text-white text-lg font-semibold">Email Transport (Mock)</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white text-sm mb-1">From Address</label>
          <input value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-3 py-2 bg-black bg-opacity-25 border border-white border-opacity-30 rounded text-white" placeholder="you@company.com" />
        </div>
        <div>
          <label className="block text-white text-sm mb-1">Provider</label>
          <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full px-3 py-2 bg-black bg-opacity-25 border border-white border-opacity-30 rounded text-white">
            <option value="mock" className="bg-gray-800">Mock</option>
          </select>
        </div>
        <div>
          <label className="block text-white text-sm mb-1">Host (future)</label>
          <input value={host} onChange={(e) => setHost(e.target.value)} className="w-full px-3 py-2 bg-black bg-opacity-25 border border-white border-opacity-30 rounded text-white" placeholder="smtp.example.com" />
        </div>
        <div>
          <label className="block text-white text-sm mb-1">Port (future)</label>
          <input type="number" value={port} onChange={(e) => setPort(e.target.value)} className="w-full px-3 py-2 bg-black bg-opacity-25 border border-white border-opacity-30 rounded text-white" />
        </div>
        <div>
          <label className="block text-white text-sm mb-1">Username (future)</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 bg-black bg-opacity-25 border border-white border-opacity-30 rounded text-white" />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={save} className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded">Save</button>
        <button onClick={testSend} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded">Test Send</button>
        <button onClick={clear} className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded">Clear</button>
        {status && <div className="text-white text-opacity-80 self-center text-sm">{status}</div>}
      </div>
    </div>
  );
}

export default TransportConfig;
