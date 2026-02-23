'use client';

import { Cultura, RezultatCalcul } from '@/types';
import { calculeazaCosturi, formateazaLei, formateazaProcent, formateazaNumar } from '@/lib/calcule';
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Layers, PieChart as PieChartIcon, Download } from 'lucide-react';
import CosturiPieChart from './CosturiPieChart';
import { exportToExcel } from '@/lib/excel-export';

interface DashboardProps {
  cultura: Cultura | null;
}

export default function Dashboard({ cultura }: DashboardProps) {
  if (!cultura) {
    return (
      <div className="card text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Selectează sau creează o cultură pentru a vedea calculele</p>
      </div>
    );
  }

  const rezultat = calculeazaCosturi(cultura);
  const isProfitabil = rezultat.marjaBruta > 0;

  return (
    <div className="space-y-6">
      {/* Header cultura */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-agri-green-700 to-agri-green-900 p-6 shadow-lg">
        <div className="absolute top-0 right-0 opacity-10">
          <BarChart3 className="w-32 h-32" />
        </div>
        <div className="relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-agri-green-100 text-sm font-semibold mb-1">Cultură</p>
              <h2 className="text-3xl font-bold text-white mb-2">{cultura.nume}</h2>
              <p className="text-agri-green-100 font-medium">
                <span className="text-2xl font-bold text-white">{cultura.hectare}</span> hectare
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className={`px-4 py-2 rounded-xl font-semibold shadow-sm ${
                isProfitabil
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {isProfitabil ? '✓ Profitabil' : '✗ În pierdere'}
              </div>
              <button
                onClick={() => exportToExcel(cultura, rezultat)}
                className="px-4 py-2 bg-white text-agri-green-700 rounded-xl font-semibold shadow-sm hover:bg-agri-green-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </button>
            </div>
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
          sublinie={`Total fermă: ${formateazaLei(rezultat.costTotal * cultura.hectare)}`}
        />
        <KPICard
          titlu="Venit Brut / ha"
          valoare={formateazaLei(rezultat.venitBrut)}
          icon={<TrendingUp className="w-5 h-5" />}
          culoare="green"
          sublinie={`Total fermă: ${formateazaLei(rezultat.venitBrut * cultura.hectare)}`}
        />
        <KPICard
          titlu="Marjă Brută / ha"
          valoare={formateazaLei(rezultat.marjaBruta)}
          icon={isProfitabil ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          culoare={isProfitabil ? 'green' : 'red'}
          subtitlu={formateazaProcent(rezultat.marjaProcentuala)}
          sublinie={`Total fermă: ${formateazaLei(rezultat.marjaBruta * cultura.hectare)}`}
        />
        <KPICard
          titlu="Break-even"
          valoare={`${formateazaNumar(rezultat.breakEvenKg)} kg/ha`}
          icon={<Target className="w-5 h-5" />}
          culoare="purple"
          subtitlu={`din ${formateazaNumar(cultura.productie)} kg producție`}
          sublinie={`${formateazaProcent((rezultat.breakEvenKg / cultura.productie) * 100)} din total`}
        />
      </div>

      {/* Detalii venituri */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-700" />
          </div>
          <h3 className="section-heading">Structură Venituri / Hectar</h3>
        </div>
        <div className="space-y-4">
          <CostBar
            eticheta="Vânzare producție"
            valoare={rezultat.venitVanzare}
            total={rezultat.venitBrut}
            culoare="bg-gradient-to-r from-green-500 to-green-600"
          />
          <CostBar
            eticheta="Subvenții (APIA, eco-scheme)"
            valoare={rezultat.venitSubventii}
            total={rezultat.venitBrut}
            culoare="bg-gradient-to-r from-emerald-400 to-emerald-500"
          />
        </div>
        <div className="mt-5 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Total Venit Brut:</span>
            <span className="text-2xl font-bold text-green-600">{formateazaLei(rezultat.venitBrut)}</span>
          </div>
        </div>
      </div>

      {/* Detalii costuri */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Layers className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="section-heading">Structură Costuri / Hectar</h3>
        </div>
        <div className="space-y-4">
          <CostBar
            eticheta="Inputuri separate"
            valoare={rezultat.costInputuri}
            total={rezultat.costTotal}
            culoare="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <CostBar
            eticheta="Lucrări agricole (total)"
            valoare={rezultat.costMecanizare}
            total={rezultat.costTotal}
            culoare="bg-gradient-to-r from-amber-500 to-amber-600"
          />
          <CostBar
            eticheta="Manoperă suplimentară"
            valoare={rezultat.costManopera}
            total={rezultat.costTotal}
            culoare="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <CostBar
            eticheta="Costuri fixe (arendă, asigurări)"
            valoare={rezultat.costuriFixe}
            total={rezultat.costTotal}
            culoare="bg-gradient-to-r from-gray-500 to-gray-600"
          />
        </div>
        <div className="mt-5 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Total Cost:</span>
            <span className="text-2xl font-bold text-red-600">{formateazaLei(rezultat.costTotal)}</span>
          </div>
        </div>
      </div>

      {/* Grafic pie chart costuri */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <PieChartIcon className="w-5 h-5 text-indigo-700" />
          </div>
          <h3 className="section-heading">Distribuție Costuri (Vizualizare)</h3>
        </div>
        <CosturiPieChart rezultat={rezultat} />
        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-xs text-blue-700 leading-relaxed">
            ℹ️ <strong>Notă:</strong> Graficul afișează doar costurile majore pe categorii principale.
            Materiale = inputuri folosite în operațiuni (sămânță, erbicide, îngrășăminte).
            Mecanizare = motorină + retribuții pentru operatori.
          </p>
        </div>
      </div>

      {/* Detalii lucrări agricole */}
      <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="section-heading text-amber-900">Detalii Lucrări Agricole / Hectar</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between py-2 px-3 bg-white rounded-xl">
            <span className="text-gray-600 font-medium">Consum motorină total:</span>
            <span className="font-bold text-gray-900">{formateazaNumar(rezultat.totalConsumMotorina, 1)} litri</span>
          </div>
          <div className="flex justify-between py-2 px-3 bg-white rounded-xl">
            <span className="text-gray-600 font-medium">Cost motorină:</span>
            <span className="font-bold text-gray-900">{formateazaLei(rezultat.totalCostMotorina)}</span>
          </div>
          <div className="flex justify-between py-2 px-3 bg-white rounded-xl">
            <span className="text-gray-600 font-medium">Retribuții/manoperă:</span>
            <span className="font-bold text-gray-900">{formateazaLei(rezultat.totalRetributii)}</span>
          </div>
          <div className="flex justify-between py-2 px-3 bg-white rounded-xl">
            <span className="text-gray-600 font-medium">Materiale operațiuni:</span>
            <span className="font-bold text-gray-900">{formateazaLei(rezultat.totalMaterialeOperatiuni)}</span>
          </div>
          <div className="flex justify-between py-3 px-3 bg-amber-100 rounded-xl border-2 border-amber-300">
            <span className="font-bold text-amber-900">Total lucrări:</span>
            <span className="text-xl font-bold text-amber-900">{formateazaLei(rezultat.costMecanizare)}</span>
          </div>
        </div>
      </div>

      {/* Total fermă */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-agri-green-600 via-agri-green-700 to-agri-green-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 opacity-10">
          <Target className="w-40 h-40" />
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-agri-green-100 text-sm font-semibold mb-1">Total Costuri Fermă</p>
            <p className="text-agri-green-50 text-sm mb-1">{cultura.hectare} hectare</p>
            <p className="text-4xl font-bold text-white">{formateazaLei(rezultat.costTotal * cultura.hectare)}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-agri-green-100 text-sm font-semibold mb-1">
              {isProfitabil ? 'Profit Estimat' : 'Pierdere Estimată'}
            </p>
            <p className="text-agri-green-50 text-sm mb-1">Marjă: {formateazaProcent(rezultat.marjaProcentuala)}</p>
            <p className={`text-4xl font-bold ${isProfitabil ? 'text-white' : 'text-red-200'}`}>
              {formateazaLei(rezultat.marjaBruta * cultura.hectare)}
            </p>
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
  subtitlu,
  sublinie
}: {
  titlu: string;
  valoare: string;
  icon: React.ReactNode;
  culoare: 'blue' | 'green' | 'red' | 'purple';
  subtitlu?: string;
  sublinie?: string;
}) {
  const culoriMap = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{titlu}</p>
          <p className="text-2xl font-bold text-agri-text mt-1">{valoare}</p>
          {subtitlu && <p className="text-sm text-gray-500 font-medium mt-1">{subtitlu}</p>}
        </div>
        <div className={`p-3 rounded-xl ${culoriMap[culoare]}`}>
          {icon}
        </div>
      </div>
      {sublinie && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">{sublinie}</p>
        </div>
      )}
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
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-700 font-medium">{eticheta}</span>
        <span className="font-bold text-agri-text">
          {formateazaLei(valoare)} <span className="text-gray-500 font-normal">({formateazaProcent(procent)})</span>
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full ${culoare} rounded-full transition-all duration-700 ease-out shadow-sm`}
          style={{ width: `${procent}%` }}
        />
      </div>
    </div>
  );
}
