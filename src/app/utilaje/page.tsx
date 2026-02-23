'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import UtilajePlanner from '@/components/UtilajePlanner';
import { Utilaj, Implement, LucrareAgricolaPredefinita } from '@/types';
import { getUtilaje, getImplementele, getLucrari } from '@/lib/utilaje-service';

type TabType = 'utilaje' | 'implementele' | 'lucrari';

export default function UtilajePage() {
  const [utilaje, setUtilaje] = useState<Utilaj[]>([]);
  const [implementele, setImplementele] = useState<Implement[]>([]);
  const [lucrari, setLucrari] = useState<LucrareAgricolaPredefinita[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('utilaje');

  useEffect(() => {
    // Încarcă datele inițial
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    setUtilaje(getUtilaje());
    setImplementele(getImplementele());
    setLucrari(getLucrari());
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header pagină */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Management Utilaje Agricole
          </h1>
          <p className="text-gray-500 mt-2">
            Gestionează tractoarele, implementele și lucrările agricole din fermă
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('utilaje')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'utilaje'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🚜 Tractoare ({utilaje.length})
          </button>
          <button
            onClick={() => setActiveTab('implementele')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'implementele'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🔧 Implementele ({implementele.length})
          </button>
          <button
            onClick={() => setActiveTab('lucrari')}
            className={`pb-3 px-4 font-semibold transition-colors ${
              activeTab === 'lucrari'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Lucrări ({lucrari.length})
          </button>
        </div>

        {/* Componenta principală cu tabs */}
        <UtilajePlanner
          activeTab={activeTab}
          utilaje={utilaje}
          implementele={implementele}
          lucrari={lucrari}
          onRefresh={handleRefresh}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500 text-sm text-center">
            © 2024 FarmCalc - Management Utilaje Agricole
          </p>
        </div>
      </footer>
    </div>
  );
}
