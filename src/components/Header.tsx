'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthModal from './AuthModal';
import { Sprout, Calculator, RefreshCw, User, LogOut, Crown, RotateCcw, Wrench } from 'lucide-react';
import { clearStorageAndReload } from '@/lib/storage-manager';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;
    let mounted = true;

    // Verifică sesiunea curentă imediat
    const init = async () => {
      try {
        const { data: { session } } = await client.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Eroare la getSession:', err);
        if (mounted) setLoading(false);
      }
    };

    init();

    // Ascultă login/logout
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const navLinks = [
    { href: '/', label: 'Calculator Costuri', icon: Calculator },
    { href: '/rotatie', label: 'Rotație Culturi', icon: RefreshCw },
    { href: '/utilaje', label: 'Utilaje', icon: Wrench },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-primary-500 p-2.5 rounded-xl transition-transform duration-200 hover:scale-105">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FarmCalc România</h1>
                <p className="text-xs text-gray-500">Instrumente pentru fermieri</p>
              </div>
            </Link>

            {/* Navigație */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Auth buttons */}
            <div className="flex items-center gap-3">
              {/* Clear Cache Button - întotdeauna vizibil */}
              <button
                onClick={clearStorageAndReload}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                title="Șterge cache-ul și reîncarcă aplicația"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden lg:inline">Clear Cache</span>
              </button>

              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{user.user_metadata?.nume || user.email?.split('@')[0]}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Ieși</span>
                  </button>
                  <button className="bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white text-sm flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200">
                    <Crown className="w-4 h-4" />
                    <span className="hidden sm:inline">Premium</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2"
                  >
                    Conectare
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="btn-primary text-sm"
                  >
                    Înregistrare
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigație mobilă */}
          <nav className="md:hidden flex gap-1 pb-3 -mt-1 overflow-x-auto">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Modal autentificare */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}
