'use client';

import { Component, ReactNode } from 'react';
import { clearStorageAndReload } from '@/lib/storage-manager';

interface StorageErrorBoundaryProps {
  children: ReactNode;
}

interface StorageErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

/**
 * StorageErrorBoundary - Error Boundary pentru probleme de storage
 * 
 * Prinde erorile legate de localStorage/cookies și oferă o
 * experiență de recovery automată prin curățarea storage-ului.
 */
class StorageErrorBoundary extends Component<
  StorageErrorBoundaryProps,
  StorageErrorBoundaryState
> {
  constructor(props: StorageErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: null,
    };
  }

  static getDerivedStateFromError(error: Error): StorageErrorBoundaryState {
    // Actualizează state-ul pentru a afișa fallback UI
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: any): void {
    console.error('🚨 Storage Error Boundary caught an error:', error);
    console.error('Error details:', errorInfo);

    // Verifică dacă este o eroare legată de storage
    const isStorageError = 
      error.message.includes('localStorage') ||
      error.message.includes('sessionStorage') ||
      error.message.includes('cookie') ||
      error.message.includes('storage') ||
      error.message.includes('quota') ||
      error.name === 'QuotaExceededError';

    if (isStorageError) {
      console.log('🧹 Storage error detected, clearing and reloading...');
      
      // Așteaptă puțin pentru ca log-urile să fie afișate
      setTimeout(() => {
        clearStorageAndReload();
      }, 1000);
    } else {
      console.error('❌ Non-storage error caught:', error);
    }
  }

  handleManualClear = (): void => {
    console.log('🔄 Manual storage clear triggered by user');
    clearStorageAndReload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Se curăță cache-ul...
              </h1>

              {/* Message */}
              <p className="text-gray-600 mb-6">
                Am detectat date vechi incompatibile. Cache-ul aplicației se curăță
                automat și pagina va fi reîncărcată în câteva secunde.
              </p>

              {/* Loading indicator */}
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
              </div>

              {/* Manual reload button (fallback) */}
              <button
                onClick={this.handleManualClear}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Reîncarcă acum
              </button>

              {/* Technical details (collapsed by default) */}
              {this.state.errorMessage && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                    Detalii tehnice
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <code className="text-xs text-gray-700 break-all">
                      {this.state.errorMessage}
                    </code>
                  </div>
                </details>
              )}
            </div>

            {/* Help text */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Dacă problema persistă, contactează suportul tehnic.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default StorageErrorBoundary;
