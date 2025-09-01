import React, { useState, useEffect } from 'react';
import ProposalService from '../services/ProposalService';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

// Simple function to format proposal text with basic markdown-like rendering
const formatProposalText = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  const elements = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('## ')) {
      // Section headers
      elements.push(
        <h3 key={index} className="text-lg font-bold text-purple-300 mt-6 mb-3 border-b border-purple-500/30 pb-2">
          {trimmedLine.replace('## ', '')}
        </h3>
      );
    } else if (trimmedLine.startsWith('Subject:')) {
      // Subject line
      elements.push(
        <div key={index} className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-3 mb-4">
          <div className="text-purple-200 font-semibold">{trimmedLine}</div>
        </div>
      );
    } else if (trimmedLine.startsWith('- ')) {
      // Bullet points
      elements.push(
        <div key={index} className="flex items-start gap-2 mb-2 ml-4">
          <span className="text-purple-400 mt-1">•</span>
          <span className="text-white/90">{trimmedLine.replace('- ', '')}</span>
        </div>
      );
    } else if (trimmedLine.startsWith('Best regards,') || trimmedLine.startsWith('Sincerely,')) {
      // Signature section
      elements.push(
        <div key={index} className="mt-6 pt-4 border-t border-white/20">
          <div className="text-white/90">{trimmedLine}</div>
        </div>
      );
    } else if (trimmedLine === '') {
      // Empty lines for spacing
      elements.push(<div key={index} className="mb-3"></div>);
    } else if (trimmedLine.length > 0) {
      // Regular paragraphs
      elements.push(
        <p key={index} className="text-white/90 mb-3 leading-relaxed">
          {trimmedLine}
        </p>
      );
    }
  });
  
  return <div className="space-y-1">{elements}</div>;
};

function ProposalOutput({ proposal, isGenerating, onOptimize, onAnalyze, apiKey, jobRequirements }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('proposal');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizedProposal, setOptimizedProposal] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationType, setOptimizationType] = useState('general');
  const [translatedProposal, setTranslatedProposal] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const handleCopy = async (text = proposal) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleAnalyze = async () => {
    if (!apiKey || !proposal) return;

    setIsAnalyzing(true);
    try {
      const result = await ProposalService.analyzeProposalQuality(apiKey, proposal, jobRequirements);
      setAnalysis(result);
      setActiveTab('analysis');
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimize = async (type = 'general') => {
    if (!apiKey || !proposal) return;

    setIsOptimizing(true);
    setOptimizationType(type);
    try {
      const result = await ProposalService.optimizeProposal(apiKey, proposal, jobRequirements, type);
      setOptimizedProposal(result);
      setActiveTab('optimized');
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleTranslate = async (language) => {
    if (!apiKey || !proposal) return;

    setIsTranslating(true);
    setSelectedLanguage(language);

    try {
      const languageNames = {
        'hindi': 'Hindi (हिंदी)',
        'gujarati': 'Gujarati (ગુજરાતી)',
        'english': 'English'
      };

      const prompt = `Translate the following Upwork proposal to ${languageNames[language]}. Maintain the professional tone and structure. Keep technical terms in English where appropriate.

Original Proposal:
${proposal}

Translated Proposal in ${languageNames[language]}:`;

      const llm = new ChatOpenAI({
        apiKey,
        model: 'gpt-4',
        temperature: 0.3,
        maxTokens: 2000,
      });

      const messages = [
        new SystemMessage('You are an expert translator specializing in professional business communications.'),
        new HumanMessage(prompt)
      ];

      const response = await llm.invoke(messages);
      setTranslatedProposal(response.content.trim());
      setActiveTab('translated');
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const exportProposal = (format = 'txt') => {
    let content = proposal;
    if (activeTab === 'optimized') content = optimizedProposal;
    if (activeTab === 'translated') content = translatedProposal;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upwork-proposal-${activeTab}-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card neon p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Proposal Results</h3>
        <div className="text-white/50 text-sm">
          {proposal ? `${proposal.split(' ').length} words` : '0 words'}
        </div>
      </div>

      {/* Tab Navigation */}
      {proposal && (
        <div className="mb-4">
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('proposal')}
              className={`flex-1 py-2 px-3 rounded-md text-sm transition-all ${activeTab === 'proposal'
                ? 'bg-purple-600 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
            >
              📝 Original
            </button>
            {optimizedProposal && (
              <button
                onClick={() => setActiveTab('optimized')}
                className={`flex-1 py-2 px-3 rounded-md text-sm transition-all ${activeTab === 'optimized'
                  ? 'bg-purple-600 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
              >
                ✨ Optimized
              </button>
            )}
            {translatedProposal && (
              <button
                onClick={() => setActiveTab('translated')}
                className={`flex-1 py-2 px-3 rounded-md text-sm transition-all ${activeTab === 'translated'
                  ? 'bg-purple-600 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
              >
                🌐 {selectedLanguage === 'hindi' ? 'हिंदी' : selectedLanguage === 'gujarati' ? 'ગુજરાતી' : 'Translated'}
              </button>
            )}
            {analysis && (
              <button
                onClick={() => setActiveTab('analysis')}
                className={`flex-1 py-2 px-3 rounded-md text-sm transition-all ${activeTab === 'analysis'
                  ? 'bg-purple-600 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
              >
                📊 Analysis
              </button>
            )}
          </div>
        </div>
      )}

      {isGenerating ? (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-4 bg-white/10 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-white/10 rounded mb-2 w-1/2"></div>
          </div>
          <div className="text-center text-white/70">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            <div className="mt-2">Generating your proposal...</div>
          </div>
        </div>
      ) : proposal ? (
        <div className="space-y-4">
          {/* Content based on active tab */}
          {activeTab === 'proposal' && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="prose prose-invert max-w-none">
                <div className="text-white/90 leading-relaxed max-h-96 overflow-y-auto">
                  {formatProposalText(proposal)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'optimized' && optimizedProposal && (
            <div className="bg-green-600/10 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-400">✨</span>
                <span className="text-green-200 font-medium">Optimized for: {optimizationType}</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-white/90 leading-relaxed max-h-96 overflow-y-auto">
                  {formatProposalText(optimizedProposal)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'translated' && translatedProposal && (
            <div className="bg-blue-600/10 rounded-lg p-4 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-400">🌐</span>
                <span className="text-blue-200 font-medium">
                  Translated to: {selectedLanguage === 'hindi' ? 'Hindi (हिंदी)' : selectedLanguage === 'gujarati' ? 'Gujarati (ગુજરાતી)' : 'English'}
                </span>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-white/90 leading-relaxed max-h-96 overflow-y-auto">
                  {formatProposalText(translatedProposal)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && analysis && (
            <div className="bg-blue-600/10 rounded-lg p-4 border border-blue-500/30">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-white/90 leading-relaxed text-sm max-h-96 overflow-y-auto">
                  {analysis}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  let content = proposal;
                  if (activeTab === 'optimized') content = optimizedProposal;
                  if (activeTab === 'translated') content = translatedProposal;
                  handleCopy(content);
                }}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
              <button
                onClick={() => exportProposal()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
              >
                💾 Export
              </button>
            </div>

            {/* Advanced Actions */}
            {apiKey && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="px-3 py-2 bg-blue-600/20 border border-blue-500/50 rounded-lg text-blue-200 hover:bg-blue-600/30 text-sm disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : '📊 Analyze Quality'}
                  </button>

                  <div className="relative">
                    <select
                      onChange={(e) => handleOptimize(e.target.value)}
                      disabled={isOptimizing}
                      className="w-full px-3 py-2 bg-green-600/20 border border-green-500/50 rounded-lg text-green-200 text-sm disabled:opacity-50"
                      value=""
                    >
                      <option value="">✨ Optimize for...</option>
                      <option value="general">General Improvement</option>
                      <option value="budget">Budget Focus</option>
                      <option value="timeline">Timeline Focus</option>
                      <option value="quality">Quality Focus</option>
                      <option value="competition">Stand Out</option>
                    </select>
                    {isOptimizing && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Translation Options */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleTranslate('hindi')}
                    disabled={isTranslating}
                    className="px-3 py-2 bg-orange-600/20 border border-orange-500/50 rounded-lg text-orange-200 hover:bg-orange-600/30 text-sm disabled:opacity-50"
                  >
                    {isTranslating && selectedLanguage === 'hindi' ? 'Translating...' : '🇮🇳 हिंदी'}
                  </button>

                  <button
                    onClick={() => handleTranslate('gujarati')}
                    disabled={isTranslating}
                    className="px-3 py-2 bg-orange-600/20 border border-orange-500/50 rounded-lg text-orange-200 hover:bg-orange-600/30 text-sm disabled:opacity-50"
                  >
                    {isTranslating && selectedLanguage === 'gujarati' ? 'Translating...' : '🇮🇳 ગુજરાતી'}
                  </button>

                  <button
                    onClick={() => handleTranslate('english')}
                    disabled={isTranslating}
                    className="px-3 py-2 bg-orange-600/20 border border-orange-500/50 rounded-lg text-orange-200 hover:bg-orange-600/30 text-sm disabled:opacity-50"
                  >
                    {isTranslating && selectedLanguage === 'english' ? 'Translating...' : '🇺🇸 English'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-white/50 text-sm">
            <div className="mb-2">✨ Proposal generated successfully!</div>
            <div>Use analysis, optimization, and translation tools to maximize your success</div>
            <div className="mt-1 text-xs">💡 Try different languages for international clients</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-white/50 py-8">
          <div className="text-4xl mb-4">📝</div>
          <div className="text-lg mb-2">No proposal generated yet</div>
          <div className="text-sm">Fill out the form and click "Generate Proposal" to get started</div>
        </div>
      )}
    </div>
  );
}

export default ProposalOutput;
