'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import CalculatorForm from '@/components/CalculatorForm';
import { Cultura } from '@/types';
import { genereazaId, DEFAULTS_CULTURI } from '@/lib/calcule';

// Cultură demo cu date pre-populate
const culturaDemo: Cultura = {
  id: genereazaId(),
  nume: 'Grâu',
  hectare: 100,
  inputuri: [
    {
      id: genereazaId(),
      produs: 'Semințe grâu certificat',
      categorie: 'seminte',
      cantitatePerHa: 220,
      unitateMasura: 'kg',
      pretUnitar: 2.5,
    },
    {
      id: genereazaId(),
      produs: 'Îngrășământ NPK 20-20-0',
      categorie: 'ingrasaminte',
      cantitatePerHa: 300,
      unitateMasura: 'kg',
      pretUnitar: 3.2,
    },
    {
      id: genereazaId(),
      produs: 'Uree 46%',
      categorie: 'ingrasaminte',
      cantitatePerHa: 150,
      unitateMasura: 'kg',
      pretUnitar: 2.8,
    },
    {
      id: genereazaId(),
      produs: 'Erbicid post-emergent',
      categorie: 'erbicide',
      cantitatePerHa: 1,
      unitateMasura: 'litri',
      pretUnitar: 180,
    },
    {
      id: genereazaId(),
      produs: 'Fungicid',
      categorie: 'fungicide',
      cantitatePerHa: 0.8,
      unitateMasura: 'litri',
      pretUnitar: 250,
    },
  ],
  mecanizare: [
    {
      id: genereazaId(),
      operatiune: 'Arat',
      consumMotorina: 25,
      pretMotorina: 7.5,
      oreLucru: 1.5,
      costReparatii: 50,
    },
    {
      id: genereazaId(),
      operatiune: 'Discuit + Pregătit pat germinare',
      consumMotorina: 15,
      pretMotorina: 7.5,
      oreLucru: 1,
      costReparatii: 30,
    },
    {
      id: genereazaId(),
      operatiune: 'Semănat',
      consumMotorina: 8,
      pretMotorina: 7.5,
      oreLucru: 0.5,
      costReparatii: 40,
    },
    {
      id: genereazaId(),
      operatiune: 'Stropit (3 treceri)',
      consumMotorina: 6,
      pretMotorina: 7.5,
      oreLucru: 0.3,
      costReparatii: 20,
    },
    {
      id: genereazaId(),
      operatiune: 'Recoltat',
      consumMotorina: 20,
      pretMotorina: 7.5,
      oreLucru: 0.8,
      costReparatii: 100,
    },
  ],
  manopera: [
    {
      id: genereazaId(),
      activitate: 'Operator utilaje',
      tip: 'permanent',
      orePerHa: 4,
      costOrar: 35,
    },
    {
      id: genereazaId(),
      activitate: 'Supraveghere și management',
      tip: 'permanent',
      orePerHa: 0.5,
      costOrar: 50,
    },
  ],
  costuriFixe: [
    {
      id: genereazaId(),
      element: 'Arendă',
      costPerHa: 800,
    },
    {
      id: genereazaId(),
      element: 'Asigurare culturi',
      costPerHa: 120,
    },
    {
      id: genereazaId(),
      element: 'Impozit teren',
      costPerHa: 50,
    },
  ],
  productie: DEFAULTS_CULTURI['Grâu']?.productie || 5500,
  pretVanzare: DEFAULTS_CULTURI['Grâu']?.pretVanzare || 0.95,
  subventiePerHa: 1200, // APIA + eco-scheme estimat
};

export default function Home() {
  const [cultura, setCultura] = useState<Cultura>(culturaDemo);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coloana stânga - Formular */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Date Cultură
            </h2>
            <CalculatorForm
              cultura={cultura}
              onUpdate={setCultura}
            />
          </div>

          {/* Coloana dreapta - Dashboard */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Rezultate Calcul
            </h2>
            <Dashboard cultura={cultura} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 FarmCalc. Calculator costuri agricole pentru fermieri.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Contact</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Termeni</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">Confidențialitate</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
