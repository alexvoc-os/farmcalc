'use client';

import { Cultura, RezultatCalcul } from '@/types';
import { calculeazaCosturi, formateazaLei, formateazaProcent, formateazaNumar } from '@/lib/calcule';
import { TrendingUp, TrendingDown, DollarSign, Target, Scale } from 'lucide-react';

interface DashboardProps {
  cultura: Cultura | null;
}

export default function Dashboard({ cultura }: DashboardProps) {
  if (!cultura) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Selectează sau creează o cultură pentru a vedea calculele</p>
      </div>
    );
  }

  const rezultat = calculeazaCosturi(cultura);
  const isProfitabil = rezultat.marjaBruta > 0;

  return (
    <div className="space-y-6">
      {/* Header cultura */}
      <div className="card">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{cultura.nume}</h2>
            <p className="text-gray-500">{cultura.hectare} hectare</p>
          </div>
          <div className={`px-4 py-2 rounded-full ${isProfitabil ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isProfitabil ? 'Profitabil' : 'În pierdere'}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          titlu="Cost Total / ha"
          valoare={formateazaLei(rezultat.costTotal)}
          icon={<DollarSign className="w-5 h-5" />}
          culoare="blue"
        />
        <KPICard
          titlu="Venit Brut / ha"
          valoare={formateazaLei(rezultat.venitBrut)}
          icon={<TrendingUp className="w-5 h-5" />}
          culoare="green"
        />
        <KPICard
          titlu="Marjă Brută / ha"
          valoare={formateazaLei(rezultat.marjaBruta)}
          icon={isProfitabil ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          culoare={isProfitabil ? 'green' : 'red'}
          subtitlu={formateazaProcent(rezultat.marjaProcentuala)}
        />
        <KPICard
          titlu="Break-even"
          valoare={`${formateazaNumar(rezultat.breakEvenKg)} kg/ha`}
          icon={<Target className="w-5 h-5" />}
          culoare="purple"
          subtitlu={`din ${formateazaNumar(cultura.productie)} kg producție`}
        />
      </div>

      {/* Detalii venituri */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Structură Venituri / Hectar</h3>
        <div className="space-y-3">
          <CostBar
            eticheta="Vânzare producție"
            valoare={rezultat.venitVanzare}
            total={rezultat.venitBrut}
            culoare="bg-green-500"
          />
          <CostBar
            eticheta="Subvenții (APIA, eco-scheme)"
            valoare={rezultat.venitSubventii}
            total={rezultat.venitBrut}
            culoare="bg-emerald-400"
          />
        </div>
      </div>

      {/* Detalii costuri */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Structură Costuri / Hectar</h3>
        <div className="space-y-3">
          <CostBar
            eticheta="Inputuri separate"
            valoare={rezultat.costInputuri}
            total={rezultat.costTotal}
            culoare="bg-blue-500"
          />
          <CostBar
            eticheta="Lucrări agricole (total)"
            valoare={rezultat.costMecanizare}
            total={rezultat.costTotal}
            culoare="bg-amber-500"
          />
          <CostBar
            eticheta="Manoperă suplimentară"
            valoare={rezultat.costManopera}
            total={rezultat.costTotal}
            culoare="bg-purple-500"
          />
          <CostBar
            eticheta="Costuri fixe (arendă, asigurări)"
            valoare={rezultat.costuriFixe}
            total={rezultat.costTotal}
            culoare="bg-gray-500"
          />
        </div>
      </div>

      {/* Detalii lucrări agricole */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Detalii Lucrări Agricole / Hectar</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Consum motorină total:</span>
            <span className="font-medium">{formateazaNumar(rezultat.totalConsumMotorina, 1)} litri</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Cost motorină:</span>
            <span className="font-medium">{formateazaLei(rezultat.totalCostMotorina)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Retribuții/manoperă:</span>
            <span className="font-medium">{formateazaLei(rezultat.totalRetributii)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Materiale operațiuni:</span>
            <span className="font-medium">{formateazaLei(rezultat.totalMaterialeOperatiuni)}</span>
          </div>
          <div className="flex justify-between py-2 font-semibold text-base">
            <span>Total lucrări:</span>
            <span>{formateazaLei(rezultat.costMecanizare)}</span>
          </div>
        </div>
      </div>

      {/* Total fermă */}
      <div className="card bg-farm-green-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-farm-green-100">Total Fermă ({cultura.hectare} ha)</p>
            <p className="text-3xl font-bold">{formateazaLei(rezultat.costTotal * cultura.hectare)}</p>
          </div>
          <div className="text-right">
            <p className="text-farm-green-100">Profit Estimat</p>
            <p className="text-3xl font-bold">{formateazaLei(rezultat.marjaBruta * cultura.hectare)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  titlu,
  valoare,
  icon,
  culoare,
  subtitlu
}: {
  titlu: string;
  valoare: string;
  icon: React.ReactNode;
  culoare: 'blue' | 'green' | 'red' | 'purple';
  subtitlu?: string;
}) {
  const culoriMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{titlu}</p>
          <p className="text-2xl font-bold mt-1">{valoare}</p>
          {subtitlu && <p className="text-sm text-gray-400 mt-1">{subtitlu}</p>}
        </div>
        <div className={`p-2 rounded-lg ${culoriMap[culoare]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function CostBar({
  eticheta,
  valoare,
  total,
  culoare,
}: {
  eticheta: string;
  valoare: number;
  total: number;
  culoare: string;
}) {
  const procent = total > 0 ? (valoare / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{eticheta}</span>
        <span className="font-medium">{formateazaLei(valoare)} ({formateazaProcent(procent)})</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${culoare} rounded-full transition-all duration-500`}
          style={{ width: `${procent}%` }}
        />
      </div>
    </div>
  );
}
