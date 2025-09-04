import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, AlertCircle } from 'lucide-react';

const CustomModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Enter Information", 
  message = "Please provide the required information:",
  placeholder = "Enter text here...",
  confirmText = "OK",
  cancelText = "Cancel",
  type = "input" // "input", "confirm", "alert"
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setIsLoading(false);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scrolling when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConfirm = async () => {
    if (type === 'input' && !inputValue.trim()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onConfirm(inputValue.trim());
      onClose();
    } catch (error) {
      console.error('Modal confirm error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: '1rem'
      }}
    >
      <div 
        className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 relative z-[10000]"
        style={{
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            {type === 'alert' && <AlertCircle className="w-6 h-6 text-yellow-400" />}
            {type === 'confirm' && <AlertCircle className="w-6 h-6 text-blue-400" />}
            {type === 'input' && <Check className="w-6 h-6 text-green-400" />}
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-white/80 mb-4">{message}</p>
          
          {type === 'input' && (
            <div className="space-y-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                autoFocus
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || (type === 'input' && !inputValue.trim())}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CustomModal;
