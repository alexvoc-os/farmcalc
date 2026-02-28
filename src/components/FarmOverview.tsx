'use client';

import { Cultura } from '@/types';
import { calculeazaCosturi, formateazaLei, formateazaProcent, formateazaNumar } from '@/lib/calcule';
import { TrendingUp, TrendingDown, BarChart3, Sprout, MapPin, DollarSign, Target } from 'lucide-react';
import { useMemo } from 'react';

interface FarmOverviewProps {
  culturi: Cultura[];
  onSelectCultura?: (id: string) => void;
  toolbarSlot?: React.ReactNode;
}

export default function FarmOverview({ culturi, onSelectCultura, toolbarSlot }: FarmOverviewProps) {
  // Calculează statisticile generale
  const stats = useMemo(() => {
    if (culturi.length === 0) {
      return {
        totalHectare: 0,
        totalCost: 0,
        totalVenit: 0,
        totalProfit: 0,
        marjaProcentuala: 0,
        culturiProfitabile: 0,
        totalMotorina: 0,
      };
    }

    let totalHectare = 0;
    let totalCost = 0;
    let totalVenit = 0;
    let totalProfit = 0;
    let culturiProfitabile = 0;
    let totalMotorina = 0;

    culturi.forEach(cultura => {
      const rezultat = calculeazaCosturi(cultura);
      totalHectare += cultura.hectare;
      totalCost += rezultat.costTotal * cultura.hectare;
      totalVenit += rezultat.venitBrut * cultura.hectare;
      totalProfit += rezultat.marjaBruta * cultura.hectare;
      totalMotorina += rezultat.totalConsumMotorina * cultura.hectare;
      if (rezultat.marjaBruta > 0) culturiProfitabile++;
    });

    const marjaProcentuala = totalVenit > 0 ? (totalProfit / totalVenit) * 100 : 0;

    return {
      totalHectare,
      totalCost,
      totalVenit,
      totalProfit,
      marjaProcentuala,
      culturiProfitabile,
      totalMotorina,
    };
  }, [culturi]);

  if (culturi.length === 0) {
    return (
      <div className="card text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Sprout className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium mb-2">Nicio cultură salvată</p>
        <p className="text-sm text-gray-400">Adaugă prima cultură pentru a vedea dashboard-ul general</p>
      </div>
    );
  }

  const isProfitabil = stats.totalProfit > 0;

  return (
    <div className="space-y-6">
      {/* Header General Fermă */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-green-700 p-6 shadow-lg">
        <div className="absolute top-0 right-0 opacity-10">
          <MapPin className="w-32 h-32" />
        </div>
        <div className="relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm font-semibold mb-1">📊 Informații Generale</p>
              <h2 className="text-3xl font-bold text-white mb-2">Ferma Mea</h2>
              <p className="text-green-100 font-medium">
                <span className="text-2xl font-bold text-white">{formateazaNumar(stats.totalHectare)}</span> hectare totale
              </p>
              <p className="text-green-100 font-medium mt-1">
                <span className="text-xl font-bold text-white">{culturi.length}</span> {culturi.length === 1 ? 'cultură' : 'culturi'}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className={`px-4 py-2 rounded-xl font-semibold shadow-sm ${
                isProfitabil
                  ? 'bg-white text-green-700'
                  : 'bg-red-500 text-white'
              }`}>
                {isProfitabil ? '✓ Fermă profitabilă' : '⚠ Atenție: pierderi'}
              </div>
              <div className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-xl font-semibold text-center">
                {stats.culturiProfitabile} / {culturi.length} profitabile
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI-uri Generale */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          titlu="Cost Total Fermă"
          valoare={formateazaLei(stats.totalCost)}
          icon={<DollarSign className="w-5 h-5" />}
          culoare="blue"
          sublinie={`${formateazaLei(stats.totalCost / stats.totalHectare)} / hectar`}
        />
        <KPICard
          titlu="Venit Total Brut"
          valoare={formateazaLei(stats.totalVenit)}
          icon={<TrendingUp className="w-5 h-5" />}
          culoare="green"
          sublinie={`${formateazaLei(stats.totalVenit / stats.totalHectare)} / hectar`}
        />
        <KPICard
          titlu="Profit Total"
          valoare={formateazaLei(stats.totalProfit)}
          icon={isProfitabil ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          culoare={isProfitabil ? 'green' : 'red'}
          subtitlu={formateazaProcent(stats.marjaProcentuala)}
          sublinie={`${formateazaLei(stats.totalProfit / stats.totalHectare)} / hectar`}
        />
        <KPICard
          titlu="Motorină Totală"
          valoare={`${formateazaNumar(stats.totalMotorina, 0)} L`}
          icon={<Target className="w-5 h-5" />}
          culoare="purple"
          sublinie={`${formateazaNumar(stats.totalMotorina / stats.totalHectare, 1)} L / hectar`}
        />
      </div>

      {/* Toolbar Slot */}
      {toolbarSlot && <div className="my-6">{toolbarSlot}</div>}

      {/* Distribuția Culturilor */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-green-700" />
          </div>
          <h3 className="section-heading">Distribuție Culturi pe Suprafață</h3>
        </div>
        
        <div className="space-y-3">
          {culturi.map(cultura => {
            const procent = (cultura.hectare / stats.totalHectare) * 100;
            const rezultat = calculeazaCosturi(cultura);
            const isProfitabila = rezultat.marjaBruta > 0;
            
            return (
              <div 
                key={cultura.id} 
                className="group hover:bg-gray-50 rounded-xl p-3 transition-all cursor-pointer"
                onClick={() => onSelectCultura?.(cultura.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{cultura.nume}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isProfitabila 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {isProfitabila ? '✓ Profit' : '✗ Pierdere'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {formateazaNumar(cultura.hectare)} ha
                    </span>
                    <span className="font-bold text-gray-900">
                      {formateazaProcent(procent)}
                    </span>
                  </div>
                </div>
                
                {/* Bară de progres */}
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${
                      isProfitabila
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${procent}%` }}
                  />
                </div>
                
                {/* Detalii suplimentare */}
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Cost/ha:</span>
                    <span className="ml-1 font-semibold text-gray-700">
                      {formateazaLei(rezultat.costTotal)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Venit/ha:</span>
                    <span className="ml-1 font-semibold text-gray-700">
                      {formateazaLei(rezultat.venitBrut)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Profit/ha:</span>
                    <span className={`ml-1 font-semibold ${
                      isProfitabila ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formateazaLei(rezultat.marjaBruta)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabel comparativ detaliat */}
      <div className="card overflow-x-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="section-heading">Comparație Detaliatăper Cultură</h3>
        </div>
        
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-3 font-bold text-gray-700">Cultură</th>
              <th className="text-right py-3 px-3 font-bold text-gray-700">Hectare</th>
              <th className="text-right py-3 px-3 font-bold text-gray-700">Cost Total</th>
              <th className="text-right py-3 px-3 font-bold text-gray-700">Venit Brut</th>
              <th className="text-right py-3 px-3 font-bold text-gray-700">Profit</th>
              <th className="text-right py-3 px-3 font-bold text-gray-700">Marjă %</th>
            </tr>
          </thead>
          <tbody>
            {culturi.map(cultura => {
              const rezultat = calculeazaCosturi(cultura);
              const isProfitabila = rezultat.marjaBruta > 0;
              
              return (
                <tr 
                  key={cultura.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelectCultura?.(cultura.id)}
                >
                  <td className="py-3 px-3 font-semibold text-gray-900">{cultura.nume}</td>
                  <td className="py-3 px-3 text-right text-gray-700">{formateazaNumar(cultura.hectare)}</td>
                  <td className="py-3 px-3 text-right font-semibold text-red-600">
                    {formateazaLei(rezultat.costTotal * cultura.hectare)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-green-600">
                    {formateazaLei(rezultat.venitBrut * cultura.hectare)}
                  </td>
                  <td className={`py-3 px-3 text-right font-bold ${
                    isProfitabila ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formateazaLei(rezultat.marjaBruta * cultura.hectare)}
                  </td>
                  <td className={`py-3 px-3 text-right font-semibold ${
                    isProfitabila ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formateazaProcent(rezultat.marjaProcentuala)}
                  </td>
                </tr>
              );
            })}
            {/* Linie totale */}
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
              <td className="py-3 px-3 text-gray-900">TOTAL FERMĂ</td>
              <td className="py-3 px-3 text-right text-gray-900">{formateazaNumar(stats.totalHectare)}</td>
              <td className="py-3 px-3 text-right text-red-600">{formateazaLei(stats.totalCost)}</td>
              <td className="py-3 px-3 text-right text-green-600">{formateazaLei(stats.totalVenit)}</td>
              <td className={`py-3 px-3 text-right ${isProfitabil ? 'text-green-600' : 'text-red-600'}`}>
                {formateazaLei(stats.totalProfit)}
              </td>
              <td className={`py-3 px-3 text-right ${isProfitabil ? 'text-green-600' : 'text-red-600'}`}>
                {formateazaProcent(stats.marjaProcentuala)}
              </td>
            </tr>
          </tbody>
        </table>
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
          <p className="text-2xl font-bold text-gray-900 mt-1">{valoare}</p>
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
