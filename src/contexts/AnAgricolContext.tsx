'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentAgriculturalYear, getAvailableAgriculturalYears } from '@/lib/an-agricol-helpers';

interface AnAgricolContextType {
  anAgricolCurent: string;
  aniDisponibili: string[];
  setAnAgricolCurent: (an: string) => void;
  refreshAniDisponibili: () => void;
}

const AnAgricolContext = createContext<AnAgricolContextType | undefined>(undefined);

interface AnAgricolProviderProps {
  children: ReactNode;
}

export function AnAgricolProvider({ children }: AnAgricolProviderProps) {
  // State pentru anul agricol selectat (default = 2024-2025)
  const [anAgricolCurent, setAnAgricolCurentState] = useState<string>(() => {
    // Încearcă să citești din localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('farmcalc_an_agricol_curent');
      if (saved) return saved;
    }
    // TEMPORARY: Pornim cu 2024-2025 hardcodat
    return '2024-2025';
  });

  // State pentru lista de ani disponibili
  const [aniDisponibili, setAniDisponibili] = useState<string[]>([]);

  // Funcție pentru setarea anului curent (cu salvare în localStorage)
  const setAnAgricolCurent = (an: string) => {
    setAnAgricolCurentState(an);
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmcalc_an_agricol_curent', an);
    }
  };

  // Funcție pentru refresh lista ani disponibili
  const refreshAniDisponibili = () => {
    // Doar 1 an pentru început (2024-2025) + anul viitor (2025-2026)
    const ani = getAvailableAgriculturalYears(1, true);
    setAniDisponibili(ani);
  };

  // Inițializare ani disponibili
  useEffect(() => {
    refreshAniDisponibili();
  }, []);

  const value: AnAgricolContextType = {
    anAgricolCurent,
    aniDisponibili,
    setAnAgricolCurent,
    refreshAniDisponibili,
  };

  return (
    <AnAgricolContext.Provider value={value}>
      {children}
    </AnAgricolContext.Provider>
  );
}

// Hook pentru folosirea context-ului
export function useAnAgricol() {
  const context = useContext(AnAgricolContext);
  if (context === undefined) {
    throw new Error('useAnAgricol must be used within an AnAgricolProvider');
  }
  return context;
}
