import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ApiKeyManager from '../components/ApiKeyManager';
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
              <Link to="/" className="text-white hover:text-purple-300 transition-colors">
                ← Back to Email Assistant
              </Link>
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
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                activeTab === 'proposal'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              📝 Generate Proposal
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                activeTab === 'reviews'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              🔍 Analyze Client Reviews
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              📊 Analytics & Insights
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
      </main>
    </div>
  );
}

export default UpworkProposalsPage;
