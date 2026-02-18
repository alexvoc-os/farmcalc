'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import CalculatorForm from '@/components/CalculatorForm';
import { Cultura } from '@/types';
import { genereazaId, DEFAULTS_CULTURI } from '@/lib/calcule';
import { getCulturi, saveCultura, deleteCultura } from '@/lib/culturi-service';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Cloud, CloudOff, Loader2 } from 'lucide-react';

// Cultură demo cu date pre-populate
const culturaNoua = (): Cultura => ({
  id: genereazaId(),
  nume: 'Grâu',
  hectare: 100,
  inputuri: [
    // Inputurile sunt acum legate de operațiuni în secțiunea "Lucrări Agricole"
    // Aici poți adăuga inputuri care nu sunt legate de nicio operațiune specifică
  ],
  mecanizare: [
    {
      id: genereazaId(),
      operatiune: 'Dezmiristit',
      consumMotorina: 10,
      pretMotorina: 8.0,
      retributii: 150,
      materiale: [],
    },
    {
      id: genereazaId(),
      operatiune: 'Fertilizat cu îngrășăminte chimice',
      consumMotorina: 1,
      pretMotorina: 8.0,
      retributii: 80,
      materiale: [
        { id: genereazaId(), denumire: 'P35', um: 'kg', cantitate: 150, pretUnitar: 2.5 },
      ],
    },
    {
      id: genereazaId(),
      operatiune: 'Pregătire pat germinativ',
      consumMotorina: 10,
      pretMotorina: 8.0,
      retributii: 150,
      materiale: [],
    },
    {
      id: genereazaId(),
      operatiune: 'Semănat grâu',
      consumMotorina: 5,
      pretMotorina: 8.0,
      retributii: 150,
      materiale: [
        { id: genereazaId(), denumire: 'Sămânță grâu certificată', um: 'kg', cantitate: 220, pretUnitar: 2.5 },
      ],
    },
    {
      id: genereazaId(),
      operatiune: 'Erbicidat + Insecticid',
      consumMotorina: 1,
      pretMotorina: 8.0,
      retributii: 80,
      materiale: [
        { id: genereazaId(), denumire: 'Omnera', um: 'kg', cantitate: 0.8, pretUnitar: 117 },
        { id: genereazaId(), denumire: 'Deltagri', um: 'l', cantitate: 0.3, pretUnitar: 52 },
      ],
    },
    {
      id: genereazaId(),
      operatiune: 'Fungicid + stimulator foliar',
      consumMotorina: 1,
      pretMotorina: 8.0,
      retributii: 80,
      materiale: [
        { id: genereazaId(), denumire: 'Falcon Pro', um: 'l', cantitate: 0.6, pretUnitar: 170 },
        { id: genereazaId(), denumire: 'Foliar', um: 'l', cantitate: 2, pretUnitar: 23 },
      ],
    },
    {
      id: genereazaId(),
      operatiune: 'Recoltat grâu',
      consumMotorina: 22,
      pretMotorina: 8.0,
      retributii: 132,
      materiale: [],
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
  subventiePerHa: 1200,
});

export default function Home() {
  const [culturi, setCulturi] = useState<Cultura[]>([]);
  const [culturaSelectata, setCulturaSelectata] = useState<Cultura>(culturaNoua());
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Verifică autentificarea și încarcă culturile
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase; // TypeScript knows this is not null

    const checkAuthAndLoad = async () => {
      const { data: { user } } = await client.auth.getUser();
      setUser(user);

      if (user) {
        const culturiSalvate = await getCulturi();
        if (culturiSalvate.length > 0) {
          setCulturi(culturiSalvate);
          setCulturaSelectata(culturiSalvate[0]);
        }
      }
      setLoading(false);
    };

    checkAuthAndLoad();

    // Ascultă schimbările de autentificare
    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const culturiSalvate = await getCulturi();
        if (culturiSalvate.length > 0) {
          setCulturi(culturiSalvate);
          setCulturaSelectata(culturiSalvate[0]);
        }
      } else {
        setCulturi([]);
        setCulturaSelectata(culturaNoua());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Actualizează cultura curentă
  const handleUpdateCultura = useCallback((culturaActualizata: Cultura) => {
    setCulturaSelectata(culturaActualizata);
    setHasChanges(true);

    // Actualizează și în lista de culturi
    setCulturi(prev =>
      prev.map(c => c.id === culturaActualizata.id ? culturaActualizata : c)
    );
  }, []);

  // Salvează cultura în baza de date
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const saved = await saveCultura(culturaSelectata);

    if (saved) {
      // Adaugă în listă dacă e nouă
      setCulturi(prev => {
        const exists = prev.find(c => c.id === saved.id);
        if (exists) {
          return prev.map(c => c.id === saved.id ? saved : c);
        }
        return [saved, ...prev];
      });
      setHasChanges(false);
    }
    setSaving(false);
  };

  // Adaugă o cultură nouă
  const handleAdaugaCultura = () => {
    const noua = culturaNoua();
    setCulturaSelectata(noua);
    setHasChanges(true);
  };

  // Șterge cultura curentă
  const handleStergeCultura = async () => {
    if (!user || culturi.length === 0) return;

    const confirmat = window.confirm(`Sigur vrei să ștergi cultura "${culturaSelectata.nume}"?`);
    if (!confirmat) return;

    const success = await deleteCultura(culturaSelectata.id);
    if (success) {
      const culturiRamase = culturi.filter(c => c.id !== culturaSelectata.id);
      setCulturi(culturiRamase);
      setCulturaSelectata(culturiRamase[0] || culturaNoua());
      setHasChanges(false);
    }
  };

  // Selectează o cultură din listă
  const handleSelectCultura = (id: string) => {
    const cultura = culturi.find(c => c.id === id);
    if (cultura) {
      setCulturaSelectata(cultura);
      setHasChanges(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar pentru culturi */}
        {user && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {/* Selector culturi */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <select
                value={culturaSelectata.id}
                onChange={(e) => handleSelectCultura(e.target.value)}
                className="input-field flex-1"
              >
                {culturi.length === 0 && (
                  <option value={culturaSelectata.id}>Cultură nouă (nesalvată)</option>
                )}
                {culturi.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nume} - {c.hectare} ha
                  </option>
                ))}
              </select>
            </div>

            {/* Butoane acțiuni */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAdaugaCultura}
                className="btn-secondary flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Cultură nouă</span>
              </button>

              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className={`btn-primary flex items-center gap-1 text-sm ${
                  !hasChanges ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Salvează</span>
              </button>

              {culturi.length > 0 && (
                <button
                  onClick={handleStergeCultura}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Șterge cultura"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status sincronizare */}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              {hasChanges ? (
                <>
                  <CloudOff className="w-4 h-4 text-amber-500" />
                  <span className="hidden sm:inline text-amber-600">Modificări nesalvate</span>
                </>
              ) : culturi.length > 0 ? (
                <>
                  <Cloud className="w-4 h-4 text-green-500" />
                  <span className="hidden sm:inline text-green-600">Salvat în cloud</span>
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* Mesaj pentru utilizatori neautentificați */}
        {!loading && !user && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
            <strong>Sfat:</strong> Conectează-te pentru a salva culturile în cloud și a le accesa de pe orice dispozitiv.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coloana stânga - Formular */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Date Cultură
            </h2>
            <CalculatorForm
              cultura={culturaSelectata}
              onUpdate={handleUpdateCultura}
            />
          </div>

          {/* Coloana dreapta - Dashboard */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Rezultate Calcul
            </h2>
            <Dashboard cultura={culturaSelectata} />
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
