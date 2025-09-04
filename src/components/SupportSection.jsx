import React from 'react';
import { Star, Share2, Sparkles } from 'lucide-react';

// Custom WhatsApp Icon Component
const WhatsAppIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
  </svg>
);

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
      <h3 className="text-xl font-semibold text-white mb-6 text-center flex items-center justify-center">
        <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
        Other Ways to Support
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
                <WhatsAppIcon className="w-10 h-10 text-white drop-shadow-lg" />
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