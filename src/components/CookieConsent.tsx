'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verifică dacă utilizatorul a acceptat deja
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl animate-slideUp">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="w-6 h-6 text-accent-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">Utilizăm cookies</p>
            <p>
              Acest site folosește cookies esențiale pentru autentificare și salvarea preferințelor tale.
              Nu folosim cookies pentru publicitate sau tracking.{' '}
              <a href="/confidentialitate" className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                Politica de confidențialitate
              </a>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            Refuz
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2.5 text-sm bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
