import React, { useState } from 'react';
import { Search, RefreshCw, Copy, BarChart3, Clock, CheckCircle } from 'lucide-react';
import ProposalService from '../services/ProposalService';

function ClientReviewAnalyzer({ apiKey }) {
  const [reviews, setReviews] = useState('');
  const [clientName, setClientName] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!apiKey) {
      setError('Please enter your OpenAI API key');
      return;
    }

    if (!reviews.trim()) {
      setError('Please paste client reviews');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const analysis = await ProposalService.analyzeClientReviews(apiKey, clientName || 'Unknown', reviews);
      // Try to auto-extract a client name from the analysis first line if present
      const nameMatch = (analysis || '').match(/Client Name\s*:\s*(.+)/i);
      if (nameMatch && nameMatch[1]) setClientName(nameMatch[1].trim());
      setAnalysis(analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setReviews('');
    setClientName('');
    setAnalysis('');
    setError('');
  };

  return (
    <div className="glass-card neon p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <BarChart3 className="w-6 h-6 mr-3" />
        Analyze Client Reviews
      </h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          {clientName && (
            <div className="text-white/80 text-sm">Detected Client: <span className="font-semibold">{clientName}</span></div>
          )}

          <div>
            <label className="block text-white font-medium mb-2">
              Client Reviews *
            </label>
            <textarea
              value={reviews}
              onChange={(e) => setReviews(e.target.value)}
              placeholder="Paste the client reviews here to analyze their feedback, preferences, and communication style..."
              className="w-full h-64 p-3 bg-white/10 border border-white/20 rounded-lg text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </button>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Reviews
                </>
              )}
            </button>
          </div>
        </div>

        {/* Analysis Output */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Analysis Results</h3>
          
          {isAnalyzing ? (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-white/10 rounded mb-2 w-1/2"></div>
              </div>
              <div className="text-center text-white/70">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                <div className="mt-2">Analyzing client reviews...</div>
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
                    {analysis}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(analysis);
                  alert('Analysis copied to clipboard!');
                }}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Analysis
              </button>
            </div>
          ) : (
            <div className="text-center text-white/50 py-8">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <div className="text-lg mb-2">No analysis yet</div>
              <div className="text-sm">Enter client name and reviews, then click "Analyze Reviews"</div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <h4 className="text-white font-medium mb-2 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2 text-blue-400" />
          How to use this feature:
        </h4>
        <ul className="text-white/70 text-sm space-y-1">
          <li>• Copy reviews from Upwork client profiles or feedback sections</li>
          <li>• AI will analyze communication style, preferences, and expectations</li>
          <li>• Use insights to tailor your proposals to specific client types</li>
          <li>• Identify patterns in what clients value most</li>
        </ul>
      </div>
    </div>
  );
}

export default ClientReviewAnalyzer;
