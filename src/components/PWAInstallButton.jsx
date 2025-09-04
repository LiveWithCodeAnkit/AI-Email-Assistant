import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      // Check if running in standalone mode (iOS)
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
      
      // Show banner after 3 seconds if not installed
      setTimeout(() => {
        if (!isInstalled) {
          setShowBanner(true);
        }
      }, 3000);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
    setShowBanner(false);
  };

  const handleManualInstall = () => {
    // Show instructions for manual installation
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructions = '';
    
    if (isIOS) {
      instructions = `
📱 Install on iPhone/iPad:
1. Tap the Share button (📤) at the bottom
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to confirm

Your app will appear on your home screen!`;
    } else if (isAndroid) {
      instructions = `
📱 Install on Android:
1. Tap the menu (⋮) in your browser
2. Look for "Install app" or "Add to Home Screen"
3. Tap it and confirm installation

Your app will appear on your home screen!`;
    } else {
      instructions = `
💻 Install on Desktop:
1. Look for the install icon (⬇️) in your browser address bar
2. Click it and select "Install"
3. Or use Ctrl+Shift+A (Chrome) to open install menu

Your app will open in a new window!`;
    }
    
    alert(instructions);
  };

  // Don't show anything if already installed
  if (isInstalled) return null;

  return (
    <>
      {/* Install Banner */}
      {showBanner && (
        <div className="fixed top-2 left-2 right-2 sm:top-4 sm:right-4 sm:left-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 sm:p-4 rounded-lg shadow-lg z-50 sm:max-w-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-xs sm:text-sm">Install App</h3>
                <p className="text-xs text-purple-100 mt-1">
                  Get quick access with our mobile app!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-purple-200 hover:text-white transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 mt-3">
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="bg-white text-purple-600 px-3 py-1.5 rounded text-xs font-medium hover:bg-purple-50 transition-colors flex items-center justify-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>Install Now</span>
              </button>
            )}
            <button
              onClick={handleManualInstall}
              className="bg-purple-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-purple-400 transition-colors"
            >
              How to Install
            </button>
          </div>
        </div>
      )}

      {/* Install Button in Header */}
      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg text-xs sm:text-sm w-full sm:w-auto"
        >
          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}
    </>
  );
};

export default PWAInstallButton;
