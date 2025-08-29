import React, { useState, useEffect } from 'react';
import EmailService from '../services/EmailService';
import CryptoService from '../services/CryptoService';

function ApiKeyManager({ onApiKeySet }) {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // noop; user can choose to load from storage with passphrase
  }, []);

  const handleApiKeyChange = (e) => {
    const key = e.target.value;
    setApiKey(key);
    setError('');
    
    if (key && !EmailService.validateApiKey(key)) {
      setError('API key should start with "sk-" and be at least 20 characters long');
    } else {
      setError('');
    }
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      await EmailService.testApiKey(apiKey);
      setIsValid(true);
      setError('');
      onApiKeySet(apiKey);
    } catch (err) {
      setIsValid(false);
      setError(err.message);
    } finally {
      setIsValidating(false);
    }
  };

  const handleUseKey = () => {
    if (apiKey.trim()) {
      EmailService.setApiKey(apiKey);
      setIsValid(true);
      onApiKeySet(apiKey);
    }
  };

  const clearKey = () => {
    setApiKey('');
    setIsValid(false);
    setError('');
    EmailService.setApiKey(null);
    onApiKeySet(null);
  };

  const saveEncrypted = async () => {
    try {
      if (!passphrase.trim() || !apiKey.trim()) { setStatus('Enter passphrase and API key'); return; }
      const b64 = await CryptoService.encryptString(apiKey, passphrase);
      localStorage.setItem('enc_openai_key_v1', b64);
      setStatus('Saved encrypted');
      setTimeout(() => setStatus(''), 1500);
    } catch (e) {
      setStatus('Save failed');
    }
  };

  const loadEncrypted = async () => {
    try {
      const b64 = localStorage.getItem('enc_openai_key_v1');
      if (!b64) { setStatus('No saved key'); return; }
      if (!passphrase.trim()) { setStatus('Enter passphrase'); return; }
      const key = await CryptoService.decryptString(b64, passphrase);
      setApiKey(key);
      setStatus('Loaded');
      setTimeout(() => setStatus(''), 1500);
    } catch (e) {
      setStatus('Load failed');
    }
  };

  const clearEncrypted = () => {
    try { localStorage.removeItem('enc_openai_key_v1'); setStatus('Cleared'); setTimeout(() => setStatus(''), 1500); } catch {}
  };

  return (
    <div className="glass-card neon p-6 mb-6 tilt relative z-10">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">🔑</span>
        <h3 className="text-white text-lg font-semibold">OpenAI API Key</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Enter your OpenAI API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="sk-..."
              className="w-full px-4 py-3 bg-black bg-opacity-25 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-filter backdrop-blur-sm transition duration-300"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-opacity-70 hover:text-opacity-100 transition duration-200"
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          <p className="text-xs text-white text-opacity-70 mt-1">
            Your API key can be stored encrypted with your passphrase (optional)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Passphrase to encrypt/decrypt"
            className="w-full px-4 py-3 bg-black bg-opacity-25 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button onClick={saveEncrypted} className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg">Save Encrypted</button>
            <button onClick={loadEncrypted} className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg">Load</button>
            <button onClick={clearEncrypted} className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg">Clear</button>
          </div>
        </div>

        {status && (
          <div className="text-white text-sm">{status}</div>
        )}

        {error && (
          <div className="text-red-400 text-sm flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}

        {isValid && (
          <div className="text-green-400 text-sm flex items-center">
            <span className="mr-2">✅</span>
            API key is valid and ready to use
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleTestKey}
            disabled={isValidating || !apiKey.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-200 flex items-center"
          >
            {isValidating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Testing...
              </>
            ) : (
              <>
                <span className="mr-2">🧪</span>
                Test Key
              </>
            )}
          </button>

          {!isValid && (
            <button
              onClick={handleUseKey}
              disabled={!apiKey.trim() || error}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-200 flex items-center"
            >
              <span className="mr-2">🚀</span>
              Use Key
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApiKeyManager;
