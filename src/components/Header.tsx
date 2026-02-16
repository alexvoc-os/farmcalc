'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthModal from './AuthModal';
import { Sprout, Calculator, RefreshCw, User, LogOut, Crown } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifică sesiunea curentă
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Ascultă schimbările de autentificare
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const navLinks = [
    { href: '/', label: 'Calculator Costuri', icon: Calculator },
    { href: '/rotatie', label: 'Rotație Culturi', icon: RefreshCw },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-farm-green-600 p-2 rounded-lg">
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-farm-green-100 text-farm-green-700'
                        : 'text-gray-600 hover:bg-gray-100'
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
                  <button className="btn-primary text-sm flex items-center gap-1">
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-farm-green-100 text-farm-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
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
