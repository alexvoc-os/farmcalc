'use client';

import { useState, useMemo } from 'react';
import {
  Parcela,
  PlanRotatie,
  CULTURI_DB,
  getCulturaById,
  verificaRotatie,
  CATEGORII_CULTURI,
  IstoricCultura,
  Avertisment,
} from '@/types/rotatie';
import { genereazaId } from '@/lib/calcule';
import {
  Plus,
  Trash2,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Info,
} from 'lucide-react';

interface RotatiePlannerProps {
  plan: PlanRotatie;
  onUpdate: (plan: PlanRotatie) => void;
}

export default function RotatiePlanner({ plan, onUpdate }: RotatiePlannerProps) {
  const [parcelaSelectata, setParcelaSelectata] = useState<string | null>(null);
  const [anSelectat, setAnSelectat] = useState<number | null>(null);

  const ani = useMemo(() => {
    const result = [];
    for (let i = 0; i < plan.aniPlanificati; i++) {
      result.push(plan.anStart + i);
    }
    return result;
  }, [plan.anStart, plan.aniPlanificati]);

  // Adaugă parcelă nouă
  const adaugaParcela = () => {
    const nouaParcela: Parcela = {
      id: genereazaId(),
      nume: `Parcela ${plan.parcele.length + 1}`,
      suprafata: 10,
      istoricCulturi: [],
    };
    onUpdate({
      ...plan,
      parcele: [...plan.parcele, nouaParcela],
    });
  };

  // Șterge parcelă
  const stergeParcela = (id: string) => {
    onUpdate({
      ...plan,
      parcele: plan.parcele.filter(p => p.id !== id),
      planificare: plan.planificare.filter(p => p.parcelaId !== id),
    });
  };

  // Actualizează numele parcelei
  const actualizeazaParcela = (id: string, changes: Partial<Parcela>) => {
    onUpdate({
      ...plan,
      parcele: plan.parcele.map(p =>
        p.id === id ? { ...p, ...changes } : p
      ),
    });
  };

  // Setează cultura pentru o celulă
  const seteazaCultura = (parcelaId: string, an: number, culturaId: string | null) => {
    const planificareNoua = plan.planificare.filter(
      p => !(p.parcelaId === parcelaId && p.an === an)
    );

    if (culturaId) {
      // Găsește parcela și istoricul
      const parcela = plan.parcele.find(p => p.id === parcelaId);
      const istoricComplet: IstoricCultura[] = [
        ...(parcela?.istoricCulturi || []),
        ...plan.planificare
          .filter(p => p.parcelaId === parcelaId && p.an < an)
          .map(p => ({ an: p.an, culturaId: p.culturaId })),
      ];

      const avertismente = verificaRotatie(culturaId, istoricComplet, an);

      planificareNoua.push({
        parcelaId,
        an,
        culturaId,
        esteRecomandat: !avertismente.some(a => a.tip === 'critic'),
        avertismente,
      });
    }

    onUpdate({
      ...plan,
      planificare: planificareNoua,
    });

    setParcelaSelectata(null);
    setAnSelectat(null);
  };

  // Obține cultura planificată pentru o celulă
  const getCelula = (parcelaId: string, an: number) => {
    return plan.planificare.find(p => p.parcelaId === parcelaId && p.an === an);
  };

  return (
    <div className="space-y-6">
      {/* Header cu setări */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nume plan
            </label>
            <input
              type="text"
              value={plan.nume}
              onChange={(e) => onUpdate({ ...plan, nume: e.target.value })}
              className="input-field"
              placeholder="Planul meu de rotație"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              An start
            </label>
            <input
              type="number"
              value={plan.anStart}
              onChange={(e) => onUpdate({ ...plan, anStart: parseInt(e.target.value) || 2024 })}
              className="input-field w-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ani planificați
            </label>
            <select
              value={plan.aniPlanificati}
              onChange={(e) => onUpdate({ ...plan, aniPlanificati: parseInt(e.target.value) })}
              className="input-field w-20"
            >
              <option value={3}>3 ani</option>
              <option value={4}>4 ani</option>
              <option value={5}>5 ani</option>
            </select>
          </div>
          <button onClick={adaugaParcela} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Adaugă parcelă
          </button>
        </div>
      </div>

      {/* Legendă */}
      <div className="card bg-gray-50">
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="font-medium text-gray-700">Legendă:</span>
          {CATEGORII_CULTURI.map(cat => (
            <span key={cat.value} className={`px-2 py-1 rounded ${cat.culoare}`}>
              {cat.label}
            </span>
          ))}
          <span className="flex items-center gap-1 text-red-600">
            <AlertTriangle className="w-4 h-4" /> Probleme rotație
          </span>
          <span className="flex items-center gap-1 text-green-600">
            <Leaf className="w-4 h-4" /> Fixează azot
          </span>
        </div>
      </div>

      {/* Grid de rotație */}
      {plan.parcele.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <p>Adaugă parcele pentru a începe planificarea rotației</p>
          <button onClick={adaugaParcela} className="btn-primary mt-4">
            <Plus className="w-4 h-4 inline mr-2" /> Adaugă prima parcelă
          </button>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 min-w-[200px]">
                  Parcelă
                </th>
                {ani.map(an => (
                  <th key={an} className="text-center py-3 px-4 font-semibold text-gray-700 min-w-[140px]">
                    {an}
                  </th>
                ))}
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {plan.parcele.map(parcela => (
                <tr key={parcela.id} className="border-b hover:bg-gray-50">
                  {/* Numele parcelei */}
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      value={parcela.nume}
                      onChange={(e) => actualizeazaParcela(parcela.id, { nume: e.target.value })}
                      className="font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-farm-green-500 outline-none w-full"
                    />
                    <div className="text-sm text-gray-500">
                      <input
                        type="number"
                        value={parcela.suprafata}
                        onChange={(e) => actualizeazaParcela(parcela.id, { suprafata: parseFloat(e.target.value) || 0 })}
                        className="w-12 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-farm-green-500 outline-none"
                      /> ha
                    </div>
                  </td>

                  {/* Celule pentru fiecare an */}
                  {ani.map(an => {
                    const celula = getCelula(parcela.id, an);
                    const cultura = celula ? getCulturaById(celula.culturaId) : null;
                    const areProbleme = celula?.avertismente.some(a => a.tip === 'critic');
                    const esteSelectat = parcelaSelectata === parcela.id && anSelectat === an;

                    return (
                      <td key={an} className="py-2 px-2">
                        {esteSelectat ? (
                          <SelectorCultura
                            onSelect={(culturaId) => seteazaCultura(parcela.id, an, culturaId)}
                            onClose={() => { setParcelaSelectata(null); setAnSelectat(null); }}
                          />
                        ) : (
                          <button
                            onClick={() => { setParcelaSelectata(parcela.id); setAnSelectat(an); }}
                            className={`w-full p-2 rounded-lg border-2 border-dashed transition-all ${
                              cultura
                                ? `border-solid ${areProbleme ? 'border-red-300 bg-red-50' : 'border-gray-200'}`
                                : 'border-gray-300 hover:border-farm-green-400 hover:bg-farm-green-50'
                            }`}
                          >
                            {cultura ? (
                              <div className="text-left">
                                <div className="flex items-center gap-1">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: cultura.culoare }}
                                  />
                                  <span className="font-medium text-sm">{cultura.nume}</span>
                                  {cultura.fixeazaAzot && (
                                    <Leaf className="w-3 h-3 text-green-600" />
                                  )}
                                  {areProbleme && (
                                    <AlertTriangle className="w-3 h-3 text-red-500" />
                                  )}
                                </div>
                                {celula?.avertismente && celula.avertismente.length > 0 && (
                                  <div className="mt-1">
                                    {celula.avertismente.slice(0, 1).map((av, i) => (
                                      <p key={i} className={`text-xs ${
                                        av.tip === 'critic' ? 'text-red-600' :
                                        av.tip === 'info' ? 'text-green-600' : 'text-amber-600'
                                      }`}>
                                        {av.mesaj.substring(0, 50)}...
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">+ Adaugă</span>
                            )}
                          </button>
                        )}
                      </td>
                    );
                  })}

                  {/* Buton ștergere */}
                  <td className="py-2 px-2">
                    <button
                      onClick={() => stergeParcela(parcela.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sumar */}
      {plan.parcele.length > 0 && (
        <SumarRotatie plan={plan} />
      )}
    </div>
  );
}

// Selector de cultură (dropdown)
function SelectorCultura({
  onSelect,
  onClose,
}: {
  onSelect: (culturaId: string | null) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute z-50 bg-white rounded-lg shadow-xl border p-2 w-64 max-h-80 overflow-y-auto">
      <div className="flex justify-between items-center mb-2 pb-2 border-b">
        <span className="font-medium text-sm">Alege cultura</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <button
        onClick={() => onSelect(null)}
        className="w-full text-left px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded mb-2"
      >
        Șterge cultura
      </button>

      {CATEGORII_CULTURI.map(cat => (
        <div key={cat.value} className="mb-2">
          <p className={`text-xs font-medium px-2 py-1 ${cat.culoare} rounded`}>
            {cat.label}
          </p>
          {CULTURI_DB.filter(c => c.categorie === cat.value).map(cultura => (
            <button
              key={cultura.id}
              onClick={() => onSelect(cultura.id)}
              className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cultura.culoare }}
              />
              {cultura.nume}
              {cultura.fixeazaAzot && (
                <Leaf className="w-3 h-3 text-green-600 ml-auto" />
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// Sumar statistici
function SumarRotatie({ plan }: { plan: PlanRotatie }) {
  const totalParcele = plan.parcele.length;
  const totalSuprafata = plan.parcele.reduce((sum, p) => sum + p.suprafata, 0);
  const totalCelule = totalParcele * plan.aniPlanificati;
  const celulePlanificate = plan.planificare.length;
  const celuleCuProbleme = plan.planificare.filter(p =>
    p.avertismente.some(a => a.tip === 'critic')
  ).length;

  // Distribuție pe culturi
  const distributie = plan.planificare.reduce((acc, p) => {
    acc[p.culturaId] = (acc[p.culturaId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card">
        <h4 className="font-semibold text-gray-700 mb-2">Sumar Fermă</h4>
        <p className="text-2xl font-bold text-farm-green-600">{totalSuprafata} ha</p>
        <p className="text-sm text-gray-500">{totalParcele} parcele × {plan.aniPlanificati} ani</p>
      </div>

      <div className="card">
        <h4 className="font-semibold text-gray-700 mb-2">Progres Planificare</h4>
        <p className="text-2xl font-bold text-farm-green-600">
          {Math.round((celulePlanificate / totalCelule) * 100)}%
        </p>
        <p className="text-sm text-gray-500">
          {celulePlanificate} / {totalCelule} celule completate
        </p>
        {celuleCuProbleme > 0 && (
          <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-4 h-4" />
            {celuleCuProbleme} probleme de rotație
          </p>
        )}
      </div>

      <div className="card">
        <h4 className="font-semibold text-gray-700 mb-2">Distribuție Culturi</h4>
        <div className="space-y-1">
          {Object.entries(distributie)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([culturaId, count]) => {
              const cultura = getCulturaById(culturaId);
              return (
                <div key={culturaId} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cultura?.culoare }}
                  />
                  <span>{cultura?.nume}</span>
                  <span className="ml-auto text-gray-500">{count}×</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
