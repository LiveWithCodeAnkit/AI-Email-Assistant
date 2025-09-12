import React, { useState, useEffect } from 'react';
import EmailInput from './components/EmailInput';
import StyleSelector from './components/StyleSelector';
import EmailOutput from './components/EmailOutput';
import ApiKeyManager from './components/ApiKeyManager';
import CustomPromptInput from './components/CustomPromptInput';
import EmailImprover from './components/EmailImprover';
import TemplateGallery from './components/TemplateGallery';
import CorporateGuidelines from './components/CorporateGuidelines';
import InfoBar from './components/InfoBar';
import PWAInstallButton from './components/PWAInstallButton';
import EmailService from './services/EmailService';
import TrackingService from './services/TrackingService';

function App() {
  const [email, setEmail] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [emailPurpose, setEmailPurpose] = useState('');
  const [selectedTone] = useState('professional');
  const [adjustedEmail, setAdjustedEmail] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [apiKeySet, setApiKeySet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [theme] = useState('theme-night');

  useEffect(() => {
    // Track page visit
    TrackingService.recordVisit().catch(console.error);
    
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleApiKeySet = (key) => {
    setApiKeySet(!!key);
    if (!key) {
      setAdjustedEmail('');
      setError('');
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setEmailPurpose(template.category);
  };

  const handleGenerateFinalEmail = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      let result;
      
      if (selectedTemplate) {
        result = await EmailService.refineEmailWithTemplate(
          email,
          selectedTemplate,
          recipientType,
          customPrompt
        );
      } else {
        result = await EmailService.adjustEmailStyle(
          email, 
          selectedTone || 'professional', 
          recipientType, 
          emailPurpose,
          customPrompt
        );
      }
      
      setAdjustedEmail(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const canGenerate = email.trim() && recipientType && (selectedTemplate || selectedTone || emailPurpose);

  return (
    <div className={`${theme} min-h-screen gradient-bg aurora-bg py-8 text-white`}>
      <div className={`container mx-auto px-4 max-w-6xl ${animationComplete ? 'animate-fade-in' : 'opacity-0'}`}>
        <header className="mb-8 relative z-10">
          <div className="glass-card neon p-6 rounded-2xl tilt">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="text-4xl">✉️</div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide title-glow text-gradient">AI Email Assistant</h1>
                  <p className="text-xs sm:text-sm md:text-base opacity-90">Future-grade email drafting and refinement with RAG + LangChain</p>
                </div>
              </div>
              
              {/* Mobile-first responsive button layout */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <PWAInstallButton />
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <a
                    href="https://github.com/LiveWithCodeAnkit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-30 rounded-full px-3 sm:px-5 py-2 transition"
                    title="GitHub Reference"
                  >
                    <span>⭐</span>
                    <span className="hidden sm:inline">@LiveWithCodeAnkit</span>
                    <span className="sm:hidden">GitHub</span>
                  </a>
                  <a
                    href="/upwork"
                    className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 border border-purple-500 rounded-full px-3 sm:px-5 py-2 transition"
                    title="Upwork Proposals"
                  >
                    <span>🚀</span>
                    <span className="hidden sm:inline">Upwork Proposals</span>
                    <span className="sm:hidden">Upwork</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        <InfoBar />

        <ApiKeyManager onApiKeySet={handleApiKeySet} />
        
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2">
              <EmailInput 
                email={email} 
                setEmail={setEmail} 
              />
            </div>
            
            <div className="w-full lg:w-1/2">
              {apiKeySet && (
                <CustomPromptInput 
                  customPrompt={customPrompt}
                  setCustomPrompt={setCustomPrompt}
                />
              )}
              
              <div className="mt-4">
                <label className="flex items-center text-white text-lg font-semibold mb-3">
                  <span className="mr-2">👥</span> Who is the recipient?
                </label>
                <select
                  className="shadow border border-white border-opacity-30 bg-black bg-opacity-25 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-filter backdrop-blur-sm transition duration-300 ease-in-out hover:border-opacity-50"
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                >
                  <option value="" className="bg-gray-800">Select recipient type...</option>
                  <option value="Colleague" className="bg-gray-800">👩‍💼 Colleague</option>
                  <option value="Manager" className="bg-gray-800">👨‍💼 Manager</option>
                  <option value="Client" className="bg-gray-800">🤵 Client</option>
                  <option value="Friend" className="bg-gray-800">🙋 Friend</option>
                  <option value="Service Provider" className="bg-gray-800">👷 Service Provider</option>
                  <option value="Other" className="bg-gray-800">👤 Other</option>
                </select>
              </div>

              {!selectedTemplate && (
                <div className="mt-4">
                  <label className="flex items-center text-white text-lg font-semibold mb-3">
                    <span className="mr-2">🎯</span> What is the purpose of this email?
                  </label>
                  <input
                    type="text"
                    value={emailPurpose}
                    onChange={(e) => setEmailPurpose(e.target.value)}
                    placeholder="e.g., Status update, Question, Request, Follow-up..."
                    className="shadow border border-white border-opacity-30 bg-black bg-opacity-25 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-filter backdrop-blur-sm transition duration-300 ease-in-out hover:border-opacity-50 placeholder-white placeholder-opacity-50"
                  />
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={handleGenerateFinalEmail}
                  disabled={isLoading || !canGenerate}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 w-full transform transition-transform duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  {isLoading ? 'Generating...' : 'Generate Final Email'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width template gallery below */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2"><span>🗂️</span> Select Email Purpose</h3>
          <TemplateGallery 
            onSelectTemplate={handleSelectTemplate}
            selectedTemplateId={selectedTemplate?.id}
          />
        </div>
        
        <div className="glass-card neon p-6 tilt">
          <EmailOutput
            originalEmail={email}
            adjustedEmail={adjustedEmail}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <div className="mt-8">
          <CorporateGuidelines />
        </div>
        
        <footer className="mt-12 text-center text-white text-sm animate-fade-in">
          <p>AI Email Assistant ✨ &copy; {new Date().getFullYear()} ✨</p>
        </footer>
      </div>
    </div>
  );
}

export default App;