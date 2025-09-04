import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  Trash2, 
  TrendingUp, 
  User, 
  Zap, 
  FileText, 
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import ProposalService from '../services/ProposalService';

function ProposalAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const data = ProposalService.getProposalAnalytics();
    setAnalytics(data);
    calculateStats(data);
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({});
      return;
    }

    const profileCounts = {};
    const modelCounts = {};
    const lengthCounts = {};
    
    data.forEach(entry => {
      profileCounts[entry.profile] = (profileCounts[entry.profile] || 0) + 1;
      modelCounts[entry.model] = (modelCounts[entry.model] || 0) + 1;
      lengthCounts[entry.proposalLength] = (lengthCounts[entry.proposalLength] || 0) + 1;
    });

    const mostUsedProfile = Object.keys(profileCounts).reduce((a, b) => 
      profileCounts[a] > profileCounts[b] ? a : b, '');
    
    const mostUsedModel = Object.keys(modelCounts).reduce((a, b) => 
      modelCounts[a] > modelCounts[b] ? a : b, '');

    setStats({
      totalProposals: data.length,
      mostUsedProfile,
      mostUsedModel,
      profileCounts,
      modelCounts,
      lengthCounts,
      averageKeywords: data.reduce((sum, entry) => sum + entry.keywords, 0) / data.length
    });
  };

  const clearAnalytics = () => {
    if (confirm('Are you sure you want to clear all analytics data?')) {
      localStorage.removeItem('upwork_proposal_analytics');
      setAnalytics([]);
      setStats({});
    }
  };

  const exportAnalytics = () => {
    const csvContent = [
      'Date,Profile,Model,Length,Keywords,Job Type',
      ...analytics.map(entry => 
        `${entry.timestamp},${entry.profile},${entry.model},${entry.proposalLength},${entry.keywords},"${entry.jobType}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upwork-analytics-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (analytics.length === 0) {
    return (
      <div className="glass-card neon p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Proposal Analytics
        </h3>
        <div className="text-center text-white/50 py-8">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <div className="text-lg mb-2">No analytics data yet</div>
          <div className="text-sm">Generate some proposals to see your usage statistics</div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card neon p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Proposal Analytics
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={exportAnalytics}
            className="px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-lg text-blue-200 hover:bg-blue-600/30 text-sm flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={clearAnalytics}
            className="px-4 py-2 bg-red-600/20 border border-red-500/50 rounded-lg text-red-200 hover:bg-red-600/30 text-sm flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Data
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center mb-2">
            <FileText className="w-4 h-4 mr-2 text-purple-400" />
            <div className="text-2xl font-bold text-purple-400">{stats.totalProposals}</div>
          </div>
          <div className="text-white/70 text-sm">Total Proposals</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center mb-2">
            <User className="w-4 h-4 mr-2 text-blue-400" />
            <div className="text-lg font-bold text-blue-400 capitalize">{stats.mostUsedProfile}</div>
          </div>
          <div className="text-white/70 text-sm">Most Used Profile</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center mb-2">
            <Zap className="w-4 h-4 mr-2 text-green-400" />
            <div className="text-lg font-bold text-green-400">{stats.mostUsedModel}</div>
          </div>
          <div className="text-white/70 text-sm">Preferred Model</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center mb-2">
            <Target className="w-4 h-4 mr-2 text-yellow-400" />
            <div className="text-2xl font-bold text-yellow-400">{Math.round(stats.averageKeywords)}</div>
          </div>
          <div className="text-white/70 text-sm">Avg Keywords</div>
        </div>
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Distribution */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Profile Usage
          </h4>
          <div className="space-y-2">
            {Object.entries(stats.profileCounts || {}).map(([profile, count]) => (
              <div key={profile} className="flex justify-between items-center">
                <span className="text-white/70 capitalize text-sm">{profile}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(count / stats.totalProposals) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Usage */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Model Preferences
          </h4>
          <div className="space-y-2">
            {Object.entries(stats.modelCounts || {}).map(([model, count]) => (
              <div key={model} className="flex justify-between items-center">
                <span className="text-white/70 text-sm">{model}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / stats.totalProposals) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Length Preferences */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Length Preferences
          </h4>
          <div className="space-y-2">
            {Object.entries(stats.lengthCounts || {}).map(([length, count]) => (
              <div key={length} className="flex justify-between items-center">
                <span className="text-white/70 capitalize text-sm">{length}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(count / stats.totalProposals) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Recent Proposals
        </h4>
        <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {analytics.slice(-10).reverse().map((entry, index) => (
              <div key={entry.id} className={`p-3 border-b border-white/10 ${index === 0 ? 'bg-white/5' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white text-sm font-medium capitalize">{entry.profile}</div>
                    <div className="text-white/50 text-xs">{entry.jobType}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/70 text-xs">{entry.model}</div>
                    <div className="text-white/50 text-xs">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
        <h4 className="text-purple-200 font-medium mb-2 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          Analytics Insights
        </h4>
        <ul className="text-purple-200/70 text-sm space-y-1">
          <li>• Track which profiles and models work best for your projects</li>
          <li>• Monitor your proposal generation patterns over time</li>
          <li>• Use data to optimize your freelancing strategy</li>
          <li>• Export data for external analysis and reporting</li>
        </ul>
      </div>
    </div>
  );
}

export default ProposalAnalytics;