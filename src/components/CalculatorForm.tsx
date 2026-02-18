'use client';

import { useState } from 'react';
import { Cultura, Input, Mecanizare, Manopera, CostFix, MaterialOperatiune, CULTURI_PREDEFINITE, CATEGORII_INPUT } from '@/types';
import { genereazaId, DEFAULTS_CULTURI } from '@/lib/calcule';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface CalculatorFormProps {
  cultura: Cultura;
  onUpdate: (cultura: Cultura) => void;
}

export default function CalculatorForm({ cultura, onUpdate }: CalculatorFormProps) {
  const [sectiuniDeschise, setSectiuniDeschise] = useState({
    general: true,
    inputuri: true,
    mecanizare: false,
    manopera: false,
    costuriFixe: false,
    productie: true,
  });

  const toggleSectiune = (sectiune: keyof typeof sectiuniDeschise) => {
    setSectiuniDeschise(prev => ({ ...prev, [sectiune]: !prev[sectiune] }));
  };

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
    <div className="space-y-4">
      {/* Secțiune Generală */}
      <Sectiune
        titlu="Informații Generale"
        deschisa={sectiuniDeschise.general}
        onToggle={() => toggleSectiune('general')}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cultură</label>
            <select
              value={cultura.nume}
              onChange={(e) => {
                const numeCultura = e.target.value;
                const defaults = DEFAULTS_CULTURI[numeCultura] || {};
                updateField('nume', numeCultura);
                if (defaults.productie) updateField('productie', defaults.productie);
                if (defaults.pretVanzare) updateField('pretVanzare', defaults.pretVanzare);
              }}
              className="input-field"
            >
              {CULTURI_PREDEFINITE.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Suprafață (ha)</label>
            <input
              type="number"
              value={cultura.hectare || ''}
              onChange={(e) => updateField('hectare', parseFloat(e.target.value) || 0)}
              className="input-field"
              placeholder="100"
            />
          </div>
        </div>
      </Sectiune>

      {/* Secțiune Inputuri */}
      <Sectiune
        titlu={`Inputuri (${cultura.inputuri.length})`}
        deschisa={sectiuniDeschise.inputuri}
        onToggle={() => toggleSectiune('inputuri')}
      >
        <div className="space-y-3">
          {cultura.inputuri.map((input) => (
            <div key={input.id} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2">
                <input
                  type="text"
                  value={input.produs}
                  onChange={(e) => actualizeazaInput(input.id, { produs: e.target.value })}
                  className="input-field"
                  placeholder="Produs"
                />
                <select
                  value={input.categorie}
                  onChange={(e) => actualizeazaInput(input.id, { categorie: e.target.value as Input['categorie'] })}
                  className="input-field"
                >
                  {CATEGORII_INPUT.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={input.cantitatePerHa || ''}
                  onChange={(e) => actualizeazaInput(input.id, { cantitatePerHa: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="Cant/ha"
                />
                <input
                  type="number"
                  value={input.pretUnitar || ''}
                  onChange={(e) => actualizeazaInput(input.id, { pretUnitar: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="Preț/unit"
                />
                <div className="text-sm text-gray-600 flex items-center">
                  = {(input.cantitatePerHa * input.pretUnitar).toFixed(0)} lei/ha
                </div>
              </div>
              <button
                onClick={() => stergeInput(input.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={adaugaInput} className="btn-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Adaugă input
          </button>
        </div>
      </Sectiune>

      {/* Secțiune Lucrări/Operațiuni */}
      <Sectiune
        titlu={`Lucrări Agricole (${cultura.mecanizare.length})`}
        deschisa={sectiuniDeschise.mecanizare}
        onToggle={() => toggleSectiune('mecanizare')}
      >
        <div className="space-y-4">
          {cultura.mecanizare.map((mec) => {
            const costMotorina = (mec.consumMotorina || 0) * (mec.pretMotorina || 0);
            const costMateriale = (mec.materiale || []).reduce((sum, m) => sum + (m.cantitate || 0) * (m.pretUnitar || 0), 0);
            const totalOperatiune = costMotorina + (mec.retributii || 0) + costMateriale;

            return (
              <div key={mec.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header operațiune */}
                <div className="bg-gray-50 p-3">
                  <div className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2">
                      <input
                        type="text"
                        value={mec.operatiune}
                        onChange={(e) => actualizeazaMecanizare(mec.id, { operatiune: e.target.value })}
                        className="input-field md:col-span-2"
                        placeholder="Denumire operațiune"
                      />
                      <input
                        type="number"
                        value={mec.consumMotorina || ''}
                        onChange={(e) => actualizeazaMecanizare(mec.id, { consumMotorina: parseFloat(e.target.value) || 0 })}
                        className="input-field"
                        placeholder="Consum (L/ha)"
                      />
                      <input
                        type="number"
                        value={mec.pretMotorina || ''}
                        onChange={(e) => actualizeazaMecanizare(mec.id, { pretMotorina: parseFloat(e.target.value) || 0 })}
                        className="input-field"
                        placeholder="Preț motorină"
                      />
                      <input
                        type="number"
                        value={mec.retributii || ''}
                        onChange={(e) => actualizeazaMecanizare(mec.id, { retributii: parseFloat(e.target.value) || 0 })}
                        className="input-field"
                        placeholder="Retribuții (lei/ha)"
                      />
                    </div>
                    <button
                      onClick={() => stergeMecanizare(mec.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 flex gap-4">
                    <span>Cost motorină: {costMotorina.toFixed(0)} lei</span>
                    <span>|</span>
                    <span className="font-medium">Total operațiune: {totalOperatiune.toFixed(0)} lei/ha</span>
                  </div>
                </div>

                {/* Materiale pentru operațiune */}
                <div className="p-3 bg-white">
                  <p className="text-sm font-medium text-gray-700 mb-2">Materiale folosite:</p>
                  {(mec.materiale || []).length > 0 && (
                    <div className="space-y-2 mb-2">
                      {(mec.materiale || []).map((mat) => (
                        <div key={mat.id} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={mat.denumire}
                            onChange={(e) => actualizeazaMaterial(mec.id, mat.id, { denumire: e.target.value })}
                            className="input-field flex-1"
                            placeholder="Denumire material"
                          />
                          <input
                            type="text"
                            value={mat.um}
                            onChange={(e) => actualizeazaMaterial(mec.id, mat.id, { um: e.target.value })}
                            className="input-field w-16"
                            placeholder="UM"
                          />
                          <input
                            type="number"
                            value={mat.cantitate || ''}
                            onChange={(e) => actualizeazaMaterial(mec.id, mat.id, { cantitate: parseFloat(e.target.value) || 0 })}
                            className="input-field w-24"
                            placeholder="Cantitate"
                          />
                          <input
                            type="number"
                            value={mat.pretUnitar || ''}
                            onChange={(e) => actualizeazaMaterial(mec.id, mat.id, { pretUnitar: parseFloat(e.target.value) || 0 })}
                            className="input-field w-24"
                            placeholder="Preț/unit"
                          />
                          <span className="text-sm text-gray-600 w-20 text-right">
                            {((mat.cantitate || 0) * (mat.pretUnitar || 0)).toFixed(0)} lei
                          </span>
                          <button
                            onClick={() => stergeMaterial(mec.id, mat.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => adaugaMaterialLaOperatiune(mec.id)}
                    className="text-sm text-farm-green-600 hover:text-farm-green-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Adaugă material
                  </button>
                </div>
              </div>
            );
          })}
          <button onClick={adaugaMecanizare} className="btn-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Adaugă operațiune
          </button>
        </div>
      </Sectiune>

      {/* Secțiune Manoperă */}
      <Sectiune
        titlu={`Manoperă (${cultura.manopera.length})`}
        deschisa={sectiuniDeschise.manopera}
        onToggle={() => toggleSectiune('manopera')}
      >
        <div className="space-y-3">
          {cultura.manopera.map((man) => (
            <div key={man.id} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={man.activitate}
                  onChange={(e) => actualizeazaManopera(man.id, { activitate: e.target.value })}
                  className="input-field"
                  placeholder="Activitate"
                />
                <select
                  value={man.tip}
                  onChange={(e) => actualizeazaManopera(man.id, { tip: e.target.value as Manopera['tip'] })}
                  className="input-field"
                >
                  <option value="permanent">Permanent</option>
                  <option value="sezonier">Sezonier</option>
                  <option value="terti">Servicii terți</option>
                </select>
                <input
                  type="number"
                  value={man.orePerHa || ''}
                  onChange={(e) => actualizeazaManopera(man.id, { orePerHa: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="Ore/ha"
                />
                <input
                  type="number"
                  value={man.costOrar || ''}
                  onChange={(e) => actualizeazaManopera(man.id, { costOrar: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="Lei/oră"
                />
              </div>
              <button
                onClick={() => stergeManopera(man.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={adaugaManopera} className="btn-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Adaugă manoperă
          </button>
        </div>
      </Sectiune>

      {/* Secțiune Costuri Fixe */}
      <Sectiune
        titlu={`Costuri Fixe (${cultura.costuriFixe.length})`}
        deschisa={sectiuniDeschise.costuriFixe}
        onToggle={() => toggleSectiune('costuriFixe')}
      >
        <div className="space-y-3">
          {cultura.costuriFixe.map((cost) => (
            <div key={cost.id} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cost.element}
                  onChange={(e) => actualizeazaCostFix(cost.id, { element: e.target.value })}
                  className="input-field"
                  placeholder="Element (ex: Arendă)"
                />
                <input
                  type="number"
                  value={cost.costPerHa || ''}
                  onChange={(e) => actualizeazaCostFix(cost.id, { costPerHa: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="Lei/ha"
                />
              </div>
              <button
                onClick={() => stergeCostFix(cost.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={adaugaCostFix} className="btn-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Adaugă cost fix
          </button>
        </div>
      </Sectiune>

      {/* Secțiune Producție și Vânzare */}
      <Sectiune
        titlu="Producție și Venituri"
        deschisa={sectiuniDeschise.productie}
        onToggle={() => toggleSectiune('productie')}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Producție estimată (kg/ha)</label>
            <input
              type="number"
              value={cultura.productie || ''}
              onChange={(e) => updateField('productie', parseFloat(e.target.value) || 0)}
              className="input-field"
              placeholder="5500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preț vânzare (lei/kg)</label>
            <input
              type="number"
              step="0.01"
              value={cultura.pretVanzare || ''}
              onChange={(e) => updateField('pretVanzare', parseFloat(e.target.value) || 0)}
              className="input-field"
              placeholder="0.95"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subvenție (lei/ha)</label>
            <input
              type="number"
              value={cultura.subventiePerHa || ''}
              onChange={(e) => updateField('subventiePerHa', parseFloat(e.target.value) || 0)}
              className="input-field"
              placeholder="1200 (APIA + eco-scheme, etc.)"
            />
            <p className="text-xs text-gray-500 mt-1">Include: plata de bază APIA, eco-scheme, plăți redistributive, etc.</p>
          </div>
        </div>
      </Sectiune>
    </div>
  );
}

function Sectiune({
  titlu,
  deschisa,
  onToggle,
  children
}: {
  titlu: string;
  deschisa: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="text-lg font-semibold">{titlu}</h3>
        {deschisa ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {deschisa && <div className="mt-4">{children}</div>}
    </div>
  );
}
