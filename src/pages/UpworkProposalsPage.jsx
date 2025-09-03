import React, { useState } from 'react';
import ApiKeyManager from '../components/ApiKeyManager';
import SupportSection from '../components/SupportSection';
import ProposalForm from '../components/ProposalForm';
import ProposalOutput from '../components/ProposalOutput';
import ClientReviewAnalyzer from '../components/ClientReviewAnalyzer';
import ProposalAnalytics from '../components/ProposalAnalytics';
import ProposalService from '../services/ProposalService';

function UpworkProposalsPage() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('proposal'); // 'proposal', 'reviews', or 'analytics'
  const handleApiKeySet = (key) => {
    setApiKey(key || '');
  };

  const handleGenerateProposal = async (formData) => {
    if (!apiKey) {
      setError('Please enter your OpenAI API key');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const proposal = await ProposalService.generateProposal(apiKey, formData);
      setGeneratedProposal(proposal);

      // Save analytics
      ProposalService.saveProposalAnalytics(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Aurora Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="aurora-bg"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">
                🚀 Upwork Proposal Generator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/LiveWithCodeAnkit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
              >
                ⭐ GitHub
              </a>
              <button
                onClick={() => setActiveTab('support')}
                className={`inline-flex items-center px-4 py-2 backdrop-blur-sm border rounded-full transition-all duration-300 ${activeTab === 'support'
                  ? 'bg-yellow-600/20 border-yellow-500/50 text-yellow-200'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
              >
                ☕ Support Us
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Section */}
        <div className="mb-8">
          <ApiKeyManager onApiKeySet={handleApiKeySet} />
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setActiveTab('proposal')}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${activeTab === 'proposal'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              📝 Generate Proposal
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${activeTab === 'reviews'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              🔍 Analyze Client Reviews
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${activeTab === 'analytics'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              📊 Analytics & Insights
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${activeTab === 'support'
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              ☕ Support Us
            </button>
          </div>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === 'proposal' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <ProposalForm
                onGenerate={handleGenerateProposal}
                isGenerating={isGenerating}
                error={error}
              />
            </div>

            {/* Output Section */}
            <div className="lg:col-span-1">
              <ProposalOutput
                proposal={generatedProposal}
                isGenerating={isGenerating}
                apiKey={apiKey}
                jobRequirements={generatedProposal ? 'Job requirements from form' : ''}
              />
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <ClientReviewAnalyzer apiKey={apiKey} />
        )}

        {activeTab === 'analytics' && (
          <ProposalAnalytics />
        )}

        {activeTab === 'support' && (
          <div className="max-w-4xl mx-auto">
            <div className="glass-card neon p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">☕ Support Our Work</h2>
                <p className="text-white/70 text-lg">
                  Help us keep this tool free and continuously improving! Your support means the world to us.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* QR Code Section */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4 text-center">
                    📱 Scan to Support
                  </h3>
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-4 rounded-lg">
                      <img
                        src="/qr-codes/scanerone.png"
                        alt="Support QR Code"
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-white/70 text-center text-sm">
                    Scan with your phone camera or payment app
                  </p>
                </div>

                {/* Support Information */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    🙏 Why Support Us?
                  </h3>
                  <div className="space-y-4 text-white/70">
                    <div className="flex items-start gap-3">
                      <span className="text-green-400">✅</span>
                      <div>
                        <strong className="text-white">Keep it Free:</strong> Help us maintain this tool completely free for everyone
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-blue-400">🚀</span>
                      <div>
                        <strong className="text-white">New Features:</strong> Your support helps us add more AI-powered features
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-purple-400">⚡</span>
                      <div>
                        <strong className="text-white">Better Performance:</strong> Improve server capacity and response times
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-400">☕</span>
                      <div>
                        <strong className="text-white">Buy us Coffee:</strong> Fuel our late-night coding sessions!
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-200 text-sm text-center">
                      <strong>💝 Every contribution matters!</strong><br />
                      Whether it's $1 or $10, your support helps us continue building amazing tools for freelancers like you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Support Options */}
             <SupportSection/>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UpworkProposalsPage;
