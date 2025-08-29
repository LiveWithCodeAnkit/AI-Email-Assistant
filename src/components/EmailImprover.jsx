import React, { useState } from 'react';
import EmailService from '../services/EmailService';

function EmailImprover({ email, onImprovedEmail }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImprovement, setSelectedImprovement] = useState('');

  const improvementOptions = [
    {
      id: 'general',
      label: 'General Improvement',
      description: 'Improve overall quality, grammar, and clarity',
      emoji: '✨',
      color: 'from-blue-400 to-indigo-600'
    },
    {
      id: 'grammar',
      label: 'Fix Grammar & Spelling',
      description: 'Correct all grammar, spelling, and punctuation errors',
      emoji: '📝',
      color: 'from-green-400 to-teal-500'
    },
    {
      id: 'clarity',
      label: 'Improve Clarity',
      description: 'Make the message clearer and more readable',
      emoji: '🔍',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'professional',
      label: 'Make Professional',
      description: 'Enhance business tone and professionalism',
      emoji: '👔',
      color: 'from-gray-400 to-gray-600'
    },
    {
      id: 'concise',
      label: 'Make Concise',
      description: 'Shorten while preserving important information',
      emoji: '⚡',
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  const handleImprove = async (improvementType) => {
    if (!email || email.trim() === '') {
      setError('Please enter an email to improve');
      return;
    }

    setIsLoading(true);
    setError('');
    setSelectedImprovement(improvementType);

    try {
      const improvedEmail = await EmailService.improveEmail(email, improvementType);
      onImprovedEmail(improvedEmail);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mb-6 animate-fade-in">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">🚀</span>
        <h3 className="text-white text-lg font-semibold">Quick Email Improvements</h3>
      </div>

      {error && (
        <div className="text-red-400 text-sm flex items-center mb-4">
          <span className="mr-2">⚠️</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {improvementOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleImprove(option.id)}
            disabled={isLoading || !email.trim()}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 backdrop-filter backdrop-blur-sm hover-scale ${
              selectedImprovement === option.id && isLoading
                ? `bg-gradient-to-r ${option.color} border-transparent shadow-lg transform scale-105` 
                : 'border-white border-opacity-20 bg-black bg-opacity-25 hover:bg-opacity-40'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-center mb-2">
              <span className="text-2xl">{option.emoji}</span>
            </div>
            <div className="font-medium text-center text-white mb-1">{option.label}</div>
            <div className="text-xs text-center text-white text-opacity-80">{option.description}</div>
            
            {selectedImprovement === option.id && isLoading && (
              <div className="flex justify-center mt-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {!email.trim() && (
        <div className="mt-4 text-center text-white text-opacity-70 text-sm">
          <span className="mr-2">💡</span>
          Enter an email above to see improvement options
        </div>
      )}
    </div>
  );
}

export default EmailImprover;
