'use client';

import { useState } from 'react';
import { Utilaj, Implement, LucrareAgricolaPredefinita } from '@/types';
import { saveUtilaj, deleteUtilaj, saveImplement, deleteImplement, saveLucrare, deleteLucrare } from '@/lib/utilaje-service';
import { genereazaId } from '@/lib/calcule';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

interface UtilajePlannerProps {
  activeTab: 'utilaje' | 'implementele' | 'lucrari';
  utilaje: Utilaj[];
  implementele: Implement[];
  lucrari: LucrareAgricolaPredefinita[];
  onRefresh: () => void;
}

export default function UtilajePlanner({ activeTab, utilaje, implementele, lucrari, onRefresh }: UtilajePlannerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  // === HANDLERS UTILAJE ===
  const handleAddUtilaj = () => {
    const nou: Utilaj = {
      id: genereazaId(),
      nume: '',
      marca: '',
      model: '',
      putereCP: 0,
      anFabricatie: new Date().getFullYear(),
      isGlobal: false,
    };
    setFormData(nou);
    setEditingId(nou.id);
  };

  const handleSaveUtilaj = () => {
    if (saveUtilaj(formData)) {
      setEditingId(null);
      setFormData({});
      onRefresh();
    }
  };

  const handleDeleteUtilaj = (id: string) => {
    if (window.confirm('Sigur vrei să ștergi acest tractor?')) {
      if (deleteUtilaj(id)) {
        onRefresh();
      }
    }
  };

  // === HANDLERS IMPLEMENTELE ===
  const handleAddImplement = () => {
    const nou: Implement = {
      id: genereazaId(),
      nume: '',
      tip: 'plug',
      isGlobal: false,
    };
    setFormData(nou);
    setEditingId(nou.id);
  };

  const handleSaveImplement = () => {
    if (saveImplement(formData)) {
      setEditingId(null);
      setFormData({});
      onRefresh();
    }
  };

  const handleDeleteImplement = (id: string) => {
    if (window.confirm('Sigur vrei să ștergi acest implement?')) {
      if (deleteImplement(id)) {
        onRefresh();
      }
    }
  };

  // === HANDLERS LUCRĂRI ===
  const handleAddLucrare = () => {
    const nou: LucrareAgricolaPredefinita = {
      id: genereazaId(),
      nume: '', // Va fi generat automat
      utilajId: '',
      implementId: '',
      consumMotorina: 0,
    };
    setFormData(nou);
    setEditingId(nou.id);
  };

  const handleSaveLucrare = () => {
    // Generează numele automat din utilaj + implement
    const utilaj = utilaje.find(u => u.id === formData.utilajId);
    const implement = implementele.find(i => i.id === formData.implementId);

    if (!utilaj || !implement) {
      alert('Selectează tractorul și implementul!');
      return;
    }

    const numeGenerat = `${implement.nume} + ${utilaj.nume}`;
    const dataFinala = { ...formData, nume: numeGenerat };

    if (saveLucrare(dataFinala)) {
      setEditingId(null);
      setFormData({});
      onRefresh();
    }
  };

  const handleDeleteLucrare = (id: string) => {
    if (window.confirm('Sigur vrei să ștergi această lucrare?')) {
      if (deleteLucrare(id)) {
        onRefresh();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* === TAB: UTILAJE === */}
      {activeTab === 'utilaje' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tractoare din fermă</h3>
            <button onClick={handleAddUtilaj} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Adaugă tractor
            </button>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nume</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Marcă</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Model</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Putere (CP)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">An</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {utilaje.map(utilaj => (
                  <tr key={utilaj.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{utilaj.nume}</td>
                    <td className="px-4 py-3">{utilaj.marca}</td>
                    <td className="px-4 py-3">{utilaj.model}</td>
                    <td className="px-4 py-3">{utilaj.putereCP} CP</td>
                    <td className="px-4 py-3">{utilaj.anFabricatie}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setFormData(utilaj);
                            setEditingId(utilaj.id);
                          }}
                          className="text-primary-600 hover:text-primary-700"
                          title="Editează"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUtilaj(utilaj.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Șterge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === TAB: IMPLEMENTELE === */}
      {activeTab === 'implementele' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Implementele agricole</h3>
            <button onClick={handleAddImplement} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Adaugă implement
            </button>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nume</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tip</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Lățime lucru</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {implementele.map(impl => (
                  <tr key={impl.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{impl.nume}</td>
                    <td className="px-4 py-3 capitalize">{impl.tip}</td>
                    <td className="px-4 py-3">{impl.latimeLucru ? `${impl.latimeLucru}m` : '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setFormData(impl);
                            setEditingId(impl.id);
                          }}
                          className="text-primary-600 hover:text-primary-700"
                          title="Editează"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteImplement(impl.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Șterge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === TAB: LUCRĂRI === */}
      {activeTab === 'lucrari' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Lucrări agricole</h3>
            <button onClick={handleAddLucrare} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Adaugă lucrare
            </button>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Denumire</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tractor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Implement</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Consum (L/ha)</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {lucrari.map(lucr => {
                  const utilaj = utilaje.find(u => u.id === lucr.utilajId);
                  const implement = implementele.find(i => i.id === lucr.implementId);
                  return (
                    <tr key={lucr.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{lucr.nume}</td>
                      <td className="px-4 py-3 text-sm">{utilaj?.nume || '-'}</td>
                      <td className="px-4 py-3 text-sm">{implement?.nume || '-'}</td>
                      <td className="px-4 py-3 font-semibold text-amber-700">{lucr.consumMotorina} L/ha</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setFormData(lucr);
                              setEditingId(lucr.id);
                            }}
                            className="text-primary-600 hover:text-primary-700"
                            title="Editează"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLucrare(lucr.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Șterge"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === MODAL EDIT/ADD === */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {activeTab === 'utilaje' && (utilaje.find(u => u.id === formData.id) ? 'Editează tractor' : 'Adaugă tractor nou')}
              {activeTab === 'implementele' && (implementele.find(i => i.id === formData.id) ? 'Editează implement' : 'Adaugă implement nou')}
              {activeTab === 'lucrari' && (lucrari.find(l => l.id === formData.id) ? 'Editează lucrare' : 'Adaugă lucrare nouă')}
            </h3>

            <div className="space-y-3">
              {/* FORM UTILAJE */}
              {activeTab === 'utilaje' && (
                <>
                  <input
                    type="text"
                    value={formData.nume || ''}
                    onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
                    placeholder="Nume (ex: John Deere 6230)"
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={formData.marca || ''}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    placeholder="Marcă"
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Model"
                    className="input-field"
                  />
                  <input
                    type="number"
                    value={formData.putereCP || ''}
                    onChange={(e) => setFormData({ ...formData, putereCP: parseInt(e.target.value) || 0 })}
                    placeholder="Putere (CP)"
                    className="input-field"
                  />
                  <input
                    type="number"
                    value={formData.anFabricatie || ''}
                    onChange={(e) => setFormData({ ...formData, anFabricatie: parseInt(e.target.value) || 2024 })}
                    placeholder="An fabricație"
                    className="input-field"
                  />
                </>
              )}

              {/* FORM IMPLEMENTELE */}
              {activeTab === 'implementele' && (
                <>
                  <input
                    type="text"
                    value={formData.nume || ''}
                    onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
                    placeholder="Nume (ex: Plug 5 trupițe)"
                    className="input-field"
                  />
                  <select
                    value={formData.tip || 'plug'}
                    onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
                    className="input-field"
                  >
                    <option value="plug">Plug</option>
                    <option value="disc">Disc</option>
                    <option value="semanatoare">Semănătoare</option>
                    <option value="combinator">Combinator</option>
                    <option value="tocator">Tocător</option>
                    <option value="stropitoare">Stropitoare</option>
                    <option value="combina">Combină</option>
                    <option value="altele">Altele</option>
                  </select>
                  <input
                    type="number"
                    value={formData.latimeLucru || ''}
                    onChange={(e) => setFormData({ ...formData, latimeLucru: parseFloat(e.target.value) || undefined })}
                    placeholder="Lățime lucru (m) - opțional"
                    className="input-field"
                  />
                </>
              )}

              {/* FORM LUCRĂRI */}
              {activeTab === 'lucrari' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Implement</label>
                    <select
                      value={formData.implementId || ''}
                      onChange={(e) => setFormData({ ...formData, implementId: e.target.value })}
                      className="input-field"
                    >
                      <option value="">-- Selectează implement --</option>
                      {implementele.map(impl => (
                        <option key={impl.id} value={impl.id}>{impl.nume}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tractor</label>
                    <select
                      value={formData.utilajId || ''}
                      onChange={(e) => setFormData({ ...formData, utilajId: e.target.value })}
                      className="input-field"
                    >
                      <option value="">-- Selectează tractor --</option>
                      {utilaje.map(utilaj => (
                        <option key={utilaj.id} value={utilaj.id}>{utilaj.nume} ({utilaj.putereCP} CP)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Consum motorină (L/ha)</label>
                    <input
                      type="number"
                      value={formData.consumMotorina || ''}
                      onChange={(e) => setFormData({ ...formData, consumMotorina: parseFloat(e.target.value) || 0 })}
                      placeholder="ex: 12"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Note (opțional)</label>
                    <input
                      type="text"
                      value={formData.descriere || ''}
                      onChange={(e) => setFormData({ ...formData, descriere: e.target.value })}
                      placeholder="Note suplimentare..."
                      className="input-field"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  if (activeTab === 'utilaje') handleSaveUtilaj();
                  if (activeTab === 'implementele') handleSaveImplement();
                  if (activeTab === 'lucrari') handleSaveLucrare();
                }}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Salvează
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({});
                }}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
