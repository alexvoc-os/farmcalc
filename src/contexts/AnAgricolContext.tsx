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
  // State pentru anul agricol selectat (default = anul curent)
  const [anAgricolCurent, setAnAgricolCurentState] = useState<string>(() => {
    // Încearcă să citești din localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('farmcalc_an_agricol_curent');
      if (saved) return saved;
    }
    return getCurrentAgriculturalYear();
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
    const ani = getAvailableAgriculturalYears(5, true);
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
