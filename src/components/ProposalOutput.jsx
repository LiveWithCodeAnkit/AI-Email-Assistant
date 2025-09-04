import React, { useState } from 'react';
import { 
  Copy, 
  Download, 
  BarChart3, 
  Zap, 
  Globe, 
  FileText, 
  CheckCircle, 
  Clock,
  Expand,
  Minimize2
} from 'lucide-react';
import ProposalService from '../services/ProposalService';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

// Clean proposal text formatter
const formatProposalText = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  const elements = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('## ')) {
      const headerText = trimmedLine.replace('## ', '');
      elements.push(
        <div key={index} className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <div className="w-1 h-5 bg-purple-400 rounded-full"></div>
            {headerText}
          </h3>
        </div>
      );
    } else if (trimmedLine.startsWith('Subject:')) {
      elements.push(
        <div key={index} className="mb-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <span className="text-purple-200 font-medium">{trimmedLine}</span>
        </div>
      );
    } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
      elements.push(
        <div key={index} className="flex items-start gap-2 mb-2">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
          <span className="text-white/90">{trimmedLine.replace(/^[-•]\s*/, '')}</span>
        </div>
      );
    } else if (trimmedLine.startsWith('Best regards,') || trimmedLine.startsWith('Sincerely,')) {
      elements.push(
        <div key={index} className="mt-6 pt-3 border-t border-white/20">
          <div className="text-white/80 italic">{trimmedLine}</div>
        </div>
      );
    } else if (trimmedLine.length > 0) {
      elements.push(
        <p key={index} className="text-white/90 mb-3 leading-relaxed">
          {trimmedLine}
        </p>
      );
    }
  });
  
  return <div>{elements}</div>;
};

function ProposalOutput({ proposal, isGenerating, apiKey, jobRequirements }) {
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
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getCurrentContent = () => {
    if (activeTab === 'optimized') return optimizedProposal;
    if (activeTab === 'translated') return translatedProposal;
    if (activeTab === 'analysis') return analysis;
    return proposal;
  };

  const wordCount = getCurrentContent() ? getCurrentContent().split(' ').length : 0;

  return (
    <div className="glass-card neon p-6 h-fit">
      {/* Header - Similar to About You section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">Proposal Results</h3>
          <p className="text-white/60 text-sm">
            {wordCount > 0 ? `${wordCount} words • AI Generated` : 'Ready to generate your proposal'}
          </p>
        </div>
        
        {/* Expand Toggle - Only show when there's content */}
        {proposal && wordCount > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/80 hover:text-white text-sm transition-colors backdrop-blur-sm flex items-center"
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-4 h-4 mr-2" />
                Compact View
              </>
            ) : (
              <>
                <Expand className="w-4 h-4 mr-2" />
                Expand View
              </>
            )}
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      {proposal && (
        <div className="mb-4">
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
            {[
              { id: 'proposal', label: '📝 Original', available: true },
              { id: 'optimized', label: '✨ Optimized', available: optimizedProposal },
              { id: 'translated', label: '🌐 Translated', available: translatedProposal },
              { id: 'analysis', label: '� A nalysis', available: analysis }
            ].filter(tab => tab.available).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.id === 'proposal' && <FileText className="w-3 h-3 mr-1" />}
                {tab.id === 'optimized' && <Zap className="w-3 h-3 mr-1" />}
                {tab.id === 'translated' && <Globe className="w-3 h-3 mr-1" />}
                {tab.id === 'analysis' && <BarChart3 className="w-3 h-3 mr-1" />}
                {tab.label.replace(/[📝✨🌐📊]/g, '').trim()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area - Exactly like About You textarea */}
      {isGenerating ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
          <div className="text-white/70">Generating your proposal...</div>
        </div>
      ) : proposal ? (
        <div className="space-y-4">
          {/* Scrollable Content Area - Based on About You section */}
          <div 
            className={`w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm transition-all duration-300 overflow-y-auto resize-y ${
              isExpanded ? 'h-96' : 'h-48'
            }`}
            style={{
              minHeight: isExpanded ? '384px' : '192px',
              maxHeight: isExpanded ? '600px' : '300px'
            }}
          >
            {activeTab === 'analysis' ? (
              <pre className="whitespace-pre-wrap text-white/90 text-sm leading-relaxed font-sans">
                {analysis}
              </pre>
            ) : (
              <div className="prose prose-invert max-w-none">
                {formatProposalText(getCurrentContent())}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleCopy(getCurrentContent())}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={() => exportProposal()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors border border-white/20 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>

            {/* Advanced Tools */}
            {apiKey && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="px-3 py-2 bg-blue-600/20 border border-blue-500/50 rounded-lg text-blue-200 hover:bg-blue-600/30 text-sm disabled:opacity-50 transition-colors flex items-center"
                  >
                    {isAnalyzing ? (
                      <>
                        <Clock className="w-3 h-3 mr-1 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Analyze Quality
                      </>
                    )}
                  </button>

                  <select
                    onChange={(e) => e.target.value && handleOptimize(e.target.value)}
                    disabled={isOptimizing}
                    className="px-3 py-2 bg-green-600/20 border border-green-500/50 rounded-lg text-green-200 text-sm disabled:opacity-50 transition-colors"
                    value=""
                  >
                    <option value="">{isOptimizing ? `Optimizing...` : 'Optimize for...'}</option>
                    <option value="general">General Improvement</option>
                    <option value="budget">Budget Focus</option>
                    <option value="timeline">Timeline Focus</option>
                    <option value="quality">Quality Focus</option>
                    <option value="competition">Stand Out</option>
                  </select>
                </div>

                {/* Translation Options */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleTranslate('hindi')}
                    disabled={isTranslating}
                    className="px-3 py-2 bg-orange-600/20 border border-orange-500/50 rounded-lg text-orange-200 hover:bg-orange-600/30 text-sm disabled:opacity-50 transition-colors flex items-center"
                  >
                    {isTranslating && selectedLanguage === 'hindi' ? (
                      <Clock className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Globe className="w-3 h-3 mr-1" />
                    )}
                    हिंदी
                  </button>

                  <button
                    onClick={() => handleTranslate('gujarati')}
                    disabled={isTranslating}
                    className="px-3 py-2 bg-orange-600/20 border border-orange-500/50 rounded-lg text-orange-200 hover:bg-orange-600/30 text-sm disabled:opacity-50 transition-colors flex items-center"
                  >
                    {isTranslating && selectedLanguage === 'gujarati' ? (
                      <Clock className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Globe className="w-3 h-3 mr-1" />
                    )}
                    ગુજરાતી
                  </button>

                  <button
                    onClick={() => handleTranslate('english')}
                    disabled={isTranslating}
                    className="px-3 py-2 bg-orange-600/20 border border-orange-500/50 rounded-lg text-orange-200 hover:bg-orange-600/30 text-sm disabled:opacity-50 transition-colors flex items-center"
                  >
                    {isTranslating && selectedLanguage === 'english' ? (
                      <Clock className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Globe className="w-3 h-3 mr-1" />
                    )}
                    English
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Success Message */}
          <div className="text-center text-white/50 text-sm">
            <div className="mb-1 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              Proposal generated successfully!
            </div>
            <div className="text-xs">Use the tools above to analyze, optimize, and translate your proposal</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-white/50 py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <div className="text-lg mb-2">No proposal generated yet</div>
          <div className="text-sm">Fill out the form and click "Generate Proposal" to get started</div>
        </div>
      )}
    </div>
  );
}

export default ProposalOutput;