import React from 'react';
import { Star, Share2, MessageCircle } from 'lucide-react';

const SupportSection = () => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AI-Driven Upwork Proposals Tool',
        text: 'Check out this amazing free AI tool for generating Upwork proposals! 🚀',
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(`Check out this amazing AI tool for Upwork proposals! ${window.location.origin}`);
      alert('Link copied to clipboard! 📋 Share it with your friends.');
    }
  };

  return (
    <div className="mt-8 bg-white/5 rounded-lg p-6 border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-6 text-center">
        🌟 Other Ways to Support
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GitHub Star - 3D Icon */}
        <a
          href="https://github.com/LiveWithCodeAnkit/AI-Driven-Upwork-Proposals-Tool"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group"
        >
          <div className="relative p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-yellow-400/50 transition-all duration-500 overflow-hidden">
            {/* 3D Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* 3D Icon Container */}
            <div className="relative mb-4 mx-auto w-20 h-20 flex items-center justify-center">
              {/* Shadow Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/80 to-orange-500/80 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-sm"></div>
              {/* Main Icon Layer */}
              <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl w-full h-full flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-2xl">
                <Star className="w-10 h-10 text-white drop-shadow-lg" fill="currentColor" />
              </div>
              {/* Highlight Layer */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-white/30 rounded-full blur-md group-hover:scale-150 transition-transform duration-500"></div>
            </div>
            
            <div className="relative text-center">
              <h4 className="text-white font-bold mb-2 group-hover:text-yellow-200 transition-colors duration-300">Star on GitHub</h4>
              <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">Give us a star to help others discover this amazing tool</p>
            </div>
          </div>
        </a>

        {/* Share with Friends - 3D Icon */}
        <button
          onClick={handleShare}
          className="relative group"
        >
          <div className="relative p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-blue-400/50 transition-all duration-500 overflow-hidden">
            {/* 3D Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* 3D Icon Container */}
            <div className="relative mb-4 mx-auto w-20 h-20 flex items-center justify-center">
              {/* Shadow Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/80 to-purple-500/80 rounded-2xl transform -rotate-6 group-hover:-rotate-12 transition-transform duration-500 blur-sm"></div>
              {/* Main Icon Layer */}
              <div className="relative bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl w-full h-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
                <Share2 className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
              {/* Highlight Layer */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-white/30 rounded-full blur-md group-hover:scale-150 transition-transform duration-500"></div>
            </div>
            
            <div className="relative text-center">
              <h4 className="text-white font-bold mb-2 group-hover:text-blue-200 transition-colors duration-300">Share with Friends</h4>
              <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">Tell other freelancers about this free tool</p>
            </div>
          </div>
        </button>

        {/* WhatsApp Feedback - 3D Icon */}
        <a
          href="https://api.whatsapp.com/send?phone=917860912118&text=Hi%20Ankit,%20I%20found%20your%20AI%20Upwork%20Proposals%20Tool%20amazing!%20🚀%20Here's%20my%20feedback:"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group"
        >
          <div className="relative p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-green-400/50 transition-all duration-500 overflow-hidden">
            {/* 3D Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* 3D Icon Container */}
            <div className="relative mb-4 mx-auto w-20 h-20 flex items-center justify-center">
              {/* Shadow Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/80 to-emerald-500/80 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500 blur-sm"></div>
              {/* Main Icon Layer */}
              <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl w-full h-full flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-2 transition-all duration-500 shadow-2xl">
                <MessageCircle className="w-10 h-10 text-white drop-shadow-lg" fill="currentColor" />
              </div>
              {/* Highlight Layer */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-white/30 rounded-full blur-md group-hover:scale-150 transition-transform duration-500"></div>
            </div>
            
            <div className="relative text-center">
              <h4 className="text-white font-bold mb-2 group-hover:text-green-200 transition-colors duration-300">Send Feedback</h4>
              <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">Share your suggestions via WhatsApp</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default SupportSection;