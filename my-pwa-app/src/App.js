import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isWelcomeMessageShown, setIsWelcomeMessageShown] = useState(false);

  useEffect(() => {
    // Listen for the 'beforeinstallprompt' event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); // Prevent Chrome's mini-infobar
      setDeferredPrompt(e);
      setIsInstallable(true); // Show the install button when the prompt is available
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null); // Clear the prompt
      setIsInstallable(false); // Hide the install button
      setIsWelcomeMessageShown(true); // Show welcome message
    }
  };

  const handleNotNowClick = () => {
    setIsInstallable(false); // Hide the install button
    setIsWelcomeMessageShown(true); // Show welcome message
  };

  return (
    <div className="App">
      <header className="App-header">
        {!isWelcomeMessageShown ? (
          <>
            <h1>Welcome to My PWA!</h1>
            {isInstallable && (
              <div>
                <button
                  onClick={handleInstallClick}
                  style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
                >
                  Install App
                </button>
                <button
                  onClick={handleNotNowClick}
                  style={{ padding: '10px', fontSize: '16px' }}
                >
                  Not Now
                </button>
              </div>
            )}
          </>
        ) : (
          <h1>Hi User, Welcome!</h1> // Welcome message after installation or "Not Now"
        )}
      </header>
    </div>
  );
}

export default App;
