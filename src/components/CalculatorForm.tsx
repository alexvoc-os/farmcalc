'use client';

import { useState } from 'react';
import { Cultura, Input, Mecanizare, Manopera, CostFix, MaterialOperatiune, CULTURI_PREDEFINITE, CATEGORII_INPUT } from '@/types';
import { genereazaId, DEFAULTS_CULTURI } from '@/lib/calcule';
import { Plus, Trash2, ChevronDown, ChevronUp, Wheat, Tractor, Users, Layers, TrendingUp } from 'lucide-react';
import { getLucrari, getUtilaje, getImplementele, getLucrareById } from '@/lib/utilaje-service';

interface CalculatorFormProps {
  cultura: Cultura;
  onUpdate: (cultura: Cultura) => void;
}

export default function CalculatorForm({ cultura, onUpdate }: CalculatorFormProps) {
  const [sectiuniDeschise, setSectiuniDeschise] = useState({
    general: true,
    mecanizare: true,
    inputuri: false,
    manopera: false,
    costuriFixe: false,
    productie: true,
  });

  // State pentru detalii tehnice expandabile per operațiune
  const [detaliiTehniceDeschise, setDetaliiTehniceDeschise] = useState<{[key: string]: boolean}>({});

  const toggleSectiune = (sectiune: keyof typeof sectiuniDeschise) => {
    setSectiuniDeschise(prev => ({ ...prev, [sectiune]: !prev[sectiune] }));
  };

  const toggleDetaliiTehnice = (operatiuneId: string) => {
    setDetaliiTehniceDeschise(prev => ({
      ...prev,
      [operatiuneId]: !prev[operatiuneId]
    }));
  };

  // Agregă toate materialele din operațiuni pentru afișare read-only
  const materialeDinOperatiuni = cultura.mecanizare.flatMap(mec =>
    (mec.materiale || []).map(mat => ({
      ...mat,
      operatiune: mec.operatiune,
    }))
  );

  const updateField = <K extends keyof Cultura>(camp: K, valoare: Cultura[K]) => {
    onUpdate({ ...cultura, [camp]: valoare });
  };

  // Input handlers
  const adaugaInput = () => {
    const nouInput: Input = {
      id: genereazaId(),
      produs: '',
      categorie: 'seminte',
      cantitatePerHa: 0,
      unitateMasura: 'kg',
      pretUnitar: 0,
    };
    updateField('inputuri', [...cultura.inputuri, nouInput]);
  };

  const actualizeazaInput = (id: string, changes: Partial<Input>) => {
    updateField('inputuri', cultura.inputuri.map(i =>
      i.id === id ? { ...i, ...changes } : i
    ));
  };

  const stergeInput = (id: string) => {
    updateField('inputuri', cultura.inputuri.filter(i => i.id !== id));
  };

  // Mecanizare handlers
  const adaugaMecanizare = () => {
    const nou: Mecanizare = {
      id: genereazaId(),
      operatiune: '',
      consumMotorina: 0,
      pretMotorina: 8.0,
      retributii: 0,
      materiale: [],
    };
    updateField('mecanizare', [...cultura.mecanizare, nou]);
  };

  const actualizeazaMecanizare = (id: string, changes: Partial<Mecanizare>) => {
    updateField('mecanizare', cultura.mecanizare.map(m =>
      m.id === id ? { ...m, ...changes } : m
    ));
  };

  const stergeMecanizare = (id: string) => {
    updateField('mecanizare', cultura.mecanizare.filter(m => m.id !== id));
  };

  // Material handlers pentru operațiuni
  const adaugaMaterialLaOperatiune = (operatiuneId: string) => {
    const nouMaterial: MaterialOperatiune = {
      id: genereazaId(),
      denumire: '',
      um: 'kg',
      cantitate: 0,
      pretUnitar: 0,
    };
    updateField('mecanizare', cultura.mecanizare.map(m =>
      m.id === operatiuneId
        ? { ...m, materiale: [...(m.materiale || []), nouMaterial] }
        : m
    ));
  };

  const actualizeazaMaterial = (operatiuneId: string, materialId: string, changes: Partial<MaterialOperatiune>) => {
    updateField('mecanizare', cultura.mecanizare.map(m =>
      m.id === operatiuneId
        ? {
            ...m,
            materiale: (m.materiale || []).map(mat =>
              mat.id === materialId ? { ...mat, ...changes } : mat
            )
          }
        : m
    ));
  };

  const stergeMaterial = (operatiuneId: string, materialId: string) => {
    updateField('mecanizare', cultura.mecanizare.map(m =>
      m.id === operatiuneId
        ? { ...m, materiale: (m.materiale || []).filter(mat => mat.id !== materialId) }
        : m
    ));
  };

  // Manopera handlers
  const adaugaManopera = () => {
    const nou: Manopera = {
      id: genereazaId(),
      activitate: '',
      tip: 'sezonier',
      orePerHa: 0,
      costOrar: 30,
    };
    updateField('manopera', [...cultura.manopera, nou]);
  };

  const actualizeazaManopera = (id: string, changes: Partial<Manopera>) => {
    updateField('manopera', cultura.manopera.map(m =>
      m.id === id ? { ...m, ...changes } : m
    ));
  };

  const stergeManopera = (id: string) => {
    updateField('manopera', cultura.manopera.filter(m => m.id !== id));
  };

  // Costuri fixe handlers
  const adaugaCostFix = () => {
    const nou: CostFix = {
      id: genereazaId(),
      element: '',
      costPerHa: 0,
    };
    updateField('costuriFixe', [...cultura.costuriFixe, nou]);
  };

  const actualizeazaCostFix = (id: string, changes: Partial<CostFix>) => {
    updateField('costuriFixe', cultura.costuriFixe.map(c =>
      c.id === id ? { ...c, ...changes } : c
    ));
  };

  const stergeCostFix = (id: string) => {
    updateField('costuriFixe', cultura.costuriFixe.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Secțiune Generală */}
      <Sectiune
        titlu="Informații Generale"
        icon={<Wheat className="w-5 h-5" />}
        deschisa={sectiuniDeschise.general}
        onToggle={() => toggleSectiune('general')}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cultură</label>
            <select
              value={cultura.nume}
              onChange={(e) => {
                const numeCultura = e.target.value;
                const defaults = DEFAULTS_CULTURI[numeCultura] || {};
                updateField('nume', numeCultura);
                if (defaults.productie) updateField('productie', defaults.productie);
                if (defaults.pretVanzare) updateField('pretVanzare', defaults.pretVanzare);
              }}
              className="input-field font-medium"
            >
              {CULTURI_PREDEFINITE.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Suprafață (ha)</label>
            <input
              type="number"
              value={cultura.hectare || ''}
              onChange={(e) => updateField('hectare', parseFloat(e.target.value) || 0)}
              className="input-field font-medium"
              placeholder="100"
            />
          </div>
        </div>
      </Sectiune>

      {/* Secțiune Lucrări/Operațiuni */}
      <Sectiune
        titlu={`Lucrări Agricole (${cultura.mecanizare.length})`}
        icon={<Tractor className="w-5 h-5" />}
        deschisa={sectiuniDeschise.mecanizare}
        onToggle={() => toggleSectiune('mecanizare')}
      >
        <div className="space-y-4">
          {[...cultura.mecanizare]
            .sort((a, b) => {
              // Operațiuni fără dată merg la final
              if (!a.data && !b.data) return 0;
              if (!a.data) return 1;
              if (!b.data) return -1;
              // Sortare cronologică pentru operațiuni cu dată
              return new Date(a.data).getTime() - new Date(b.data).getTime();
            })
            .map((mec) => {
            const costMotorina = (mec.consumMotorina || 0) * (mec.pretMotorina || 0);
            const costMateriale = (mec.materiale || []).reduce((sum, m) => sum + (m.cantitate || 0) * (m.pretUnitar || 0), 0);
            const totalOperatiune = costMotorina + (mec.retributii || 0) + costMateriale;

            const lucrare = getLucrareById(mec.lucrareId || '');
            const detaliiDeschise = detaliiTehniceDeschise[mec.id] || false;

            return (
              <div key={mec.id} className="border-2 border-green-200 rounded-2xl overflow-hidden hover:border-green-400 transition-all shadow-sm hover:shadow-md">
                {/* NIVEL 1: Primary Info - Data, Lucrare, Cost Total (MARI ȘI VIZIBILE) */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    {/* Data - MARE și VIZIBILĂ */}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📅</span>
                      <input
                        type="date"
                        value={mec.data || ''}
                        onChange={(e) => actualizeazaMecanizare(mec.id, { data: e.target.value })}
                        className="input-field text-lg font-bold px-4 py-3 w-48 border-2 border-green-300 focus:border-green-500"
                        title="Data lucrării"
                      />
                    </div>

                    {/* Tip Lucrare - DROPDOWN MARE */}
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-2xl">🚜</span>
                      <select
                        value={mec.lucrareId || ''}
                        onChange={(e) => {
                          const lucrareId = e.target.value;
                          const lucrare = getLucrareById(lucrareId);
                          actualizeazaMecanizare(mec.id, {
                            lucrareId,
                            operatiune: lucrare?.nume || '', // Backward compatibility
                            // Auto-completare detalii tehnice din lucrare
                            utilajId: lucrare?.utilajId || '',
                            implementId: lucrare?.implementId || '',
                            consumMotorina: lucrare?.consumMotorina || mec.consumMotorina || 0,
                          });
                        }}
                        className="input-field text-lg font-semibold px-4 py-3 flex-1 border-2 border-green-300 focus:border-green-500"
                        title="Selectează lucrare agricolă"
                      >
                        <option value="">-- Selectează Lucrarea --</option>
                        {getLucrari().map(l => (
                          <option key={l.id} value={l.id}>{l.nume}</option>
                        ))}
                      </select>
                    </div>

                    {/* Cost Total - BADGE MARE VIZIBIL */}
                    <div className="flex items-center gap-3">
                      <div className="px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-md">
                        <div className="text-xs font-semibold opacity-90 mb-0.5">💰 COST TOTAL</div>
                        <div className="text-2xl font-bold">{totalOperatiune.toFixed(0)} lei/ha</div>
                      </div>
                      <button
                        onClick={() => stergeMecanizare(mec.id)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl flex-shrink-0 transition-colors"
                        title="Șterge operațiunea"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* NIVEL 2: Detalii Tehnice (COLLAPSIBLE - Secondary Info) */}
                <div className="border-t-2 border-green-100">
                  <button
                    onClick={() => toggleDetaliiTehnice(mec.id)}
                    className="w-full px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2 font-semibold text-gray-700">
                      <span className="text-lg">🔧</span>
                      Detalii Tehnice (Tractor, Consum, etc.)
                    </span>
                    <span className={`transform transition-transform ${detaliiDeschise ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    </span>
                  </button>
                  
                  {detaliiDeschise && (
                    <div className="p-5 bg-gray-50 space-y-3 transition-all duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Tractor</label>
                          <select
                            value={mec.utilajId || ''}
                            onChange={(e) => actualizeazaMecanizare(mec.id, { utilajId: e.target.value })}
                            className="input-field text-sm w-full"
                            title="Selectează tractor"
                          >
                            <option value="">-- Tractor --</option>
                            {getUtilaje().map(u => (
                              <option key={u.id} value={u.id}>{u.nume} ({u.putereCP} CP)</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Implement</label>
                          <select
                            value={mec.implementId || ''}
                            onChange={(e) => actualizeazaMecanizare(mec.id, { implementId: e.target.value })}
                            className="input-field text-sm w-full"
                            title="Selectează implement"
                          >
                            <option value="">-- Implement --</option>
                            {getImplementele().map(i => (
                              <option key={i.id} value={i.id}>{i.nume}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Consum Motorină (L/ha)</label>
                          <input
                            type="number"
                            value={mec.consumMotorina || ''}
                            onChange={(e) => actualizeazaMecanizare(mec.id, { consumMotorina: parseFloat(e.target.value) || 0 })}
                            className="input-field w-full"
                            placeholder="10"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Preț Motorină (lei/L)</label>
                          <input
                            type="number"
                            value={mec.pretMotorina || ''}
                            onChange={(e) => actualizeazaMecanizare(mec.id, { pretMotorina: parseFloat(e.target.value) || 0 })}
                            className="input-field w-full"
                            placeholder="8.0"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Retribuții Operator (lei/ha)</label>
                          <input
                            type="number"
                            value={mec.retributii || ''}
                            onChange={(e) => actualizeazaMecanizare(mec.id, { retributii: parseFloat(e.target.value) || 0 })}
                            className="input-field w-full"
                            placeholder="150"
                          />
                        </div>
                        <div className="flex items-end">
                          <div className="px-4 py-2.5 bg-amber-100 rounded-lg w-full">
                            <div className="text-xs font-semibold text-amber-700">Cost Motorină</div>
                            <div className="text-lg font-bold text-amber-900">{costMotorina.toFixed(0)} lei</div>
                          </div>
                        </div>
                        <div className="flex items-end">
                          <div className="px-4 py-2.5 bg-blue-100 rounded-lg w-full">
                            <div className="text-xs font-semibold text-blue-700">Cost Retribuții</div>
                            <div className="text-lg font-bold text-blue-900">{(mec.retributii || 0).toFixed(0)} lei</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* NIVEL 3: Materiale (TABEL LARG ȘI VIZIBIL) */}
                <div className="p-5 bg-white border-t-2 border-amber-200">
                  <h4 className="text-base font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">📦</span>
                    Materiale folosite în această operațiune
                  </h4>
                  
                  {(mec.materiale || []).length > 0 && (
                    <div className="space-y-2 mb-4">
                      {/* Header tabel */}
                      <div className="hidden md:grid grid-cols-[2fr_80px_120px_120px_100px_50px] gap-3 px-3 py-2 bg-amber-50 rounded-lg text-xs font-bold text-amber-900 uppercase tracking-wide">
                        <div>Denumire Material</div>
                        <div className="text-center">UM</div>
                        <div className="text-center">Cantitate</div>
                        <div className="text-center">Preț/Unitate</div>
                        <div className="text-right">Total</div>
                        <div></div>
                      </div>
                      
                      {/* Rânduri materiale */}
                      {(mec.materiale || []).map((mat) => (
                        <div key={mat.id} className="grid grid-cols-1 md:grid-cols-[2fr_80px_120px_120px_100px_50px] gap-3 items-center p-3 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors">
                          <input
                            type="text"
                            value={mat.denumire}
                            onChange={(e) => actualizeazaMaterial(mec.id, mat.id, { denumire: e.target.value })}
                            className="input-field font-medium text-base"
                            placeholder="ex: Sămânță grâu certificată"
                          />
                          <input
                            type="text"
                            value={mat.um}
                            onChange={(e) => actualizeazaMaterial(mec.id, mat.id, { um: e.target.value })}
                            className="input-field text-center font-medium"
                            placeholder="kg"
                          />
                          <input
                            type="number"
                            value={mat.cantitate || ''}
                            onChange={(e) => actualizeazaMaterial(mec.id, mat.id, { cantitate: parseFloat(e.target.value) || 0 })}
                            className="input-field text-center font-semibold"
                            placeholder="220"
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={mat.pretUnitar || ''}
                            onChange={(e) => actualizeazaMaterial(mec.id, mat.id, { pretUnitar: parseFloat(e.target.value) || 0 })}
                            className="input-field text-center font-semibold"
                            placeholder="2.50"
                          />
                          <div className="text-right font-bold text-lg text-amber-900 px-2">
                            {((mat.cantitate || 0) * (mat.pretUnitar || 0)).toFixed(0)} lei
                          </div>
                          <button
                            onClick={() => stergeMaterial(mec.id, mat.id)}
                            className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Șterge material"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Total materiale */}
                      <div className="mt-3 pt-3 border-t-2 border-amber-300">
                        <div className="flex justify-between items-center px-3">
                          <span className="font-bold text-amber-900">Total Cost Materiale:</span>
                          <span className="text-2xl font-bold text-amber-900">{costMateriale.toFixed(0)} lei/ha</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => adaugaMaterialLaOperatiune(mec.id)}
                    className="btn-secondary w-full md:w-auto flex items-center justify-center gap-2 text-base px-6 py-3"
                  >
                    <Plus className="w-5 h-5" /> Adaugă material
                  </button>
                </div>
              </div>
            );
          })}
          <button onClick={adaugaMecanizare} className="btn-secondary w-full flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Adaugă operațiune
          </button>
        </div>
      </Sectiune>

      {/* Secțiune Inputuri */}
      <Sectiune
        titlu={`Inputuri (${materialeDinOperatiuni.length + cultura.inputuri.length})`}
        icon={<Layers className="w-5 h-5" />}
        deschisa={sectiuniDeschise.inputuri}
        onToggle={() => toggleSectiune('inputuri')}
      >
        <div className="space-y-6">
          {/* Subsecțiune: Materiale din operațiuni (read-only) */}
          {materialeDinOperatiuni.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <h4 className="font-semibold text-gray-700 text-sm">
                  Materiale din operațiuni ({materialeDinOperatiuni.length})
                </h4>
                <span className="text-xs text-gray-500 italic">
                  (Auto-generate, editează în secțiunea Lucrări Agricole)
                </span>
              </div>
              <div className="space-y-2">
                {materialeDinOperatiuni.map((mat, idx) => (
                  <div key={`${mat.id}-${idx}`} className="flex gap-2 items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2">
                      <div className="input-field !py-2 bg-white/50 cursor-not-allowed" title="Read-only">
                        {mat.denumire || '-'}
                      </div>
                      <div className="input-field !py-2 bg-white/50 cursor-not-allowed text-xs" title={`Operațiune: ${mat.operatiune}`}>
                        {mat.operatiune}
                      </div>
                      <div className="input-field !py-2 bg-white/50 cursor-not-allowed">
                        {mat.cantitate} {mat.um}
                      </div>
                      <div className="input-field !py-2 bg-white/50 cursor-not-allowed">
                        {mat.pretUnitar} lei/{mat.um}
                      </div>
                      <div className="text-sm font-bold text-blue-700 flex items-center justify-center bg-blue-100 rounded-xl px-2">
                        = {((mat.cantitate || 0) * (mat.pretUnitar || 0)).toFixed(0)} lei/ha
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subsecțiune: Inputuri suplimentare (editabile) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <h4 className="font-semibold text-gray-700 text-sm">
                Inputuri suplimentare ({cultura.inputuri.length})
              </h4>
              <span className="text-xs text-gray-500 italic">
                (Inputuri care nu sunt legate de operațiuni specifice)
              </span>
            </div>
            <div className="space-y-3">
              {cultura.inputuri.map((input) => (
                <div key={input.id} className="flex gap-2 items-start p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2">
                    <input
                      type="text"
                      value={input.produs}
                      onChange={(e) => actualizeazaInput(input.id, { produs: e.target.value })}
                      className="input-field !py-2"
                      placeholder="Produs"
                    />
                    <select
                      value={input.categorie}
                      onChange={(e) => actualizeazaInput(input.id, { categorie: e.target.value as Input['categorie'] })}
                      className="input-field !py-2"
                    >
                      {CATEGORII_INPUT.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={input.cantitatePerHa || ''}
                      onChange={(e) => actualizeazaInput(input.id, { cantitatePerHa: parseFloat(e.target.value) || 0 })}
                      className="input-field !py-2"
                      placeholder="Cant/ha"
                    />
                    <input
                      type="number"
                      value={input.pretUnitar || ''}
                      onChange={(e) => actualizeazaInput(input.id, { pretUnitar: parseFloat(e.target.value) || 0 })}
                      className="input-field !py-2"
                      placeholder="Preț/unit"
                    />
                    <div className="text-sm font-bold text-gray-900 flex items-center justify-center bg-primary-50 rounded-xl px-2">
                      = {(input.cantitatePerHa * input.pretUnitar).toFixed(0)} lei/ha
                    </div>
                  </div>
                  <button
                    onClick={() => stergeInput(input.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={adaugaInput} className="btn-secondary w-full flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Adaugă input suplimentar
              </button>
            </div>
          </div>
        </div>
      </Sectiune>

      {/* Secțiune Manoperă */}
      <Sectiune
        titlu={`Manoperă (${cultura.manopera.length})`}
        icon={<Users className="w-5 h-5" />}
        deschisa={sectiuniDeschise.manopera}
        onToggle={() => toggleSectiune('manopera')}
      >
        <div className="space-y-3">
          {cultura.manopera.map((man) => (
            <div key={man.id} className="flex gap-2 items-start p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={man.activitate}
                  onChange={(e) => actualizeazaManopera(man.id, { activitate: e.target.value })}
                  className="input-field !py-2"
                  placeholder="Activitate"
                />
                <select
                  value={man.tip}
                  onChange={(e) => actualizeazaManopera(man.id, { tip: e.target.value as Manopera['tip'] })}
                  className="input-field !py-2"
                >
                  <option value="permanent">Permanent</option>
                  <option value="sezonier">Sezonier</option>
                  <option value="terti">Servicii terți</option>
                </select>
                <input
                  type="number"
                  value={man.orePerHa || ''}
                  onChange={(e) => actualizeazaManopera(man.id, { orePerHa: parseFloat(e.target.value) || 0 })}
                  className="input-field !py-2"
                  placeholder="Ore/ha"
                />
                <input
                  type="number"
                  value={man.costOrar || ''}
                  onChange={(e) => actualizeazaManopera(man.id, { costOrar: parseFloat(e.target.value) || 0 })}
                  className="input-field !py-2"
                  placeholder="Lei/oră"
                />
              </div>
              <button
                onClick={() => stergeManopera(man.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={adaugaManopera} className="btn-secondary w-full flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Adaugă manoperă
          </button>
        </div>
      </Sectiune>

      {/* Secțiune Costuri Fixe */}
      <Sectiune
        titlu={`Costuri Fixe (${cultura.costuriFixe.length})`}
        icon={<Layers className="w-5 h-5" />}
        deschisa={sectiuniDeschise.costuriFixe}
        onToggle={() => toggleSectiune('costuriFixe')}
      >
        <div className="space-y-3">
          {cultura.costuriFixe.map((cost) => (
            <div key={cost.id} className="flex gap-2 items-start p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cost.element}
                  onChange={(e) => actualizeazaCostFix(cost.id, { element: e.target.value })}
                  className="input-field !py-2"
                  placeholder="Element (ex: Arendă)"
                />
                <input
                  type="number"
                  value={cost.costPerHa || ''}
                  onChange={(e) => actualizeazaCostFix(cost.id, { costPerHa: parseFloat(e.target.value) || 0 })}
                  className="input-field !py-2"
                  placeholder="Lei/ha"
                />
              </div>
              <button
                onClick={() => stergeCostFix(cost.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={adaugaCostFix} className="btn-secondary w-full flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Adaugă cost fix
          </button>
        </div>
      </Sectiune>

      {/* Secțiune Producție și Vânzare */}
      <Sectiune
        titlu="Producție și Venituri"
        icon={<TrendingUp className="w-5 h-5" />}
        deschisa={sectiuniDeschise.productie}
        onToggle={() => toggleSectiune('productie')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Producție estimată (kg/ha)</label>
            <input
              type="number"
              value={cultura.productie || ''}
              onChange={(e) => updateField('productie', parseFloat(e.target.value) || 0)}
              className="input-field font-medium"
              placeholder="5500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Preț vânzare (lei/kg)</label>
            <input
              type="number"
              step="0.01"
              value={cultura.pretVanzare || ''}
              onChange={(e) => updateField('pretVanzare', parseFloat(e.target.value) || 0)}
              className="input-field font-medium"
              placeholder="0.95"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subvenție (lei/ha)</label>
            <input
              type="number"
              value={cultura.subventiePerHa || ''}
              onChange={(e) => updateField('subventiePerHa', parseFloat(e.target.value) || 0)}
              className="input-field font-medium"
              placeholder="1200 (APIA + eco-scheme, etc.)"
            />
            <p className="text-xs text-gray-500 mt-2 bg-blue-50 px-3 py-2 rounded-lg">
              ℹ️ Include: plata de bază APIA, eco-scheme, plăți redistributive, etc.
            </p>
          </div>
        </div>
      </Sectiune>
    </div>
  );
}

function Sectiune({
  titlu,
  icon,
  deschisa,
  onToggle,
  children
}: {
  titlu: string;
  icon: React.ReactNode;
  deschisa: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left group"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-colors ${deschisa ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-700'}`}>
            {icon}
          </div>
          <h3 className="section-heading">{titlu}</h3>
        </div>
        <div className={`p-2 rounded-xl transition-colors ${deschisa ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}`}>
          {deschisa ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      {deschisa && <div className="mt-5">{children}</div>}
    </div>
  );
}
