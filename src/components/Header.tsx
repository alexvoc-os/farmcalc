'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, Calculator, RefreshCw, BarChart3 } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Calculator Costuri', icon: Calculator },
    { href: '/rotatie', label: 'Rotație Culturi', icon: RefreshCw },
  ];

  return (
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

          {/* CTA */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">Versiune Gratuită</span>
            <button className="btn-primary text-sm">
              Upgrade Premium
            </button>
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
  );
}
