'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import RotatiePlanner from '@/components/RotatiePlanner';
import { PlanRotatie } from '@/types/rotatie';
import { genereazaId } from '@/lib/calcule';

// Plan demo
const planDemo: PlanRotatie = {
  id: genereazaId(),
  nume: 'Plan Rotație 2024-2028',
  anStart: 2024,
  aniPlanificati: 5,
  parcele: [
    {
      id: genereazaId(),
      nume: 'Parcela Nord',
      suprafata: 50,
      istoricCulturi: [
        { an: 2023, culturaId: 'grau' },
        { an: 2022, culturaId: 'porumb' },
      ],
    },
    {
      id: genereazaId(),
      nume: 'Parcela Sud',
      suprafata: 35,
      istoricCulturi: [
        { an: 2023, culturaId: 'floarea_soarelui' },
        { an: 2022, culturaId: 'grau' },
      ],
    },
    {
      id: genereazaId(),
      nume: 'Parcela Est',
      suprafata: 45,
      istoricCulturi: [
        { an: 2023, culturaId: 'porumb' },
        { an: 2022, culturaId: 'soia' },
      ],
    },
    {
      id: genereazaId(),
      nume: 'Parcela Vest',
      suprafata: 40,
      istoricCulturi: [
        { an: 2023, culturaId: 'rapita' },
        { an: 2022, culturaId: 'grau' },
      ],
    },
    {
      id: genereazaId(),
      nume: 'Parcela Centru',
      suprafata: 30,
      istoricCulturi: [
        { an: 2023, culturaId: 'soia' },
        { an: 2022, culturaId: 'porumb' },
      ],
    },
  ],
  planificare: [],
};

export default function RotatiePage() {
  const [plan, setPlan] = useState<PlanRotatie>(planDemo);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Planificator Rotație Culturi
          </h1>
          <p className="text-gray-500 mt-1">
            Planifică rotația culturilor pe 3-5 ani. Click pe o celulă pentru a adăuga o cultură.
          </p>
        </div>

        <RotatiePlanner plan={plan} onUpdate={setPlan} />
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500 text-sm text-center">
            © 2024 FarmCalc - Planificator Rotație Culturi
          </p>
        </div>
      </footer>
    </div>
  );
}
