'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import FarmOverview from '@/components/FarmOverview';
import CalculatorForm from '@/components/CalculatorForm';
import { Cultura } from '@/types';
import { genereazaId, DEFAULTS_CULTURI } from '@/lib/calcule';
import { getCulturi, saveCultura, deleteCultura, migreazaCulturiLaAnAgricol } from '@/lib/culturi-service';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, Cloud, CloudOff, Loader2, Sprout, Calendar, X } from 'lucide-react';
import TemplateModal from '@/components/TemplateModal';
import CreateAnAgricolModal from '@/components/CreateAnAgricolModal';
import { useAnAgricol } from '@/contexts/AnAgricolContext';

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
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCreateAnModal, setShowCreateAnModal] = useState(false);

  // Hook pentru an agricol
  const { anAgricolCurent } = useAnAgricol();

  // State pentru detectarea anului gol
  const [anulAnteriorAreCulturi, setAnulAnteriorAreCulturi] = useState(false);
  const [verificatAnGol, setVerificatAnGol] = useState(false);

  // Migrare automată - rulează o singură dată la prima conectare
  // TEMPORARY: Migrare automată dezactivată până la rularea scriptului SQL în Supabase
  // useEffect(() => {
  //   const runMigrare = async () => {
  //     if (!user || !supabase) return;

  //     // Verifică dacă migrarea a fost deja făcută
  //     const migrareKey = `farmcalc_migrare_an_agricol_${user.id}`;
  //     const migrareFacuta = localStorage.getItem(migrareKey);

  //     if (migrareFacuta === 'done') {
  //       return; // Migrarea a fost deja făcută
  //     }

  //     console.log('🔄 Rulare migrare automată pentru an_agricol...');
  //     const result = await migreazaCulturiLaAnAgricol();

  //     if (result.success) {
  //       console.log(`✅ Migrare completă: ${result.count} culturi actualizate`);
  //       localStorage.setItem(migrareKey, 'done');

  //       // Reîncarcă culturile după migrare
  //       if (result.count > 0) {
  //         const culturiActualizate = await getCulturi(anAgricolCurent);
  //         setCulturi(culturiActualizate);
  //         if (culturiActualizate.length > 0) {
  //           setCulturaSelectata(culturiActualizate[0]);
  //         }
  //       }
  //     }
  //   };

  //   runMigrare();
  // }, [user, anAgricolCurent]);

  // Verifică autentificarea și încarcă culturile
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase; // TypeScript knows this is not null
    let mounted = true;

    const loadUserData = async (currentUser: any) => {
      if (!mounted) return;

      if (currentUser) {
        try {
          console.log('Loading data for user:', currentUser.email, 'An:', anAgricolCurent);
          const culturiSalvate = await getCulturi(anAgricolCurent);
          if (!mounted) return;

          if (culturiSalvate.length > 0) {
            setCulturi(culturiSalvate);
            setCulturaSelectata(culturiSalvate[0]);
            console.log('Loaded', culturiSalvate.length, 'cultures for', anAgricolCurent);
          } else {
            setCulturi([]);
            setCulturaSelectata(culturaNoua());
          }
        } catch (err) {
          console.error('Eroare la încărcarea culturilor:', err);
        }
      } else {
        setCulturi([]);
        setCulturaSelectata(culturaNoua());
      }
    };

    // Ascultă schimbările de autentificare - aceasta e sursa principală
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth event:', event, 'User:', session?.user?.email);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // La INITIAL_SESSION sau SIGNED_IN, încarcă datele
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (currentUser) {
          await loadUserData(currentUser);
        }
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setCulturi([]);
        setCulturaSelectata(culturaNoua());
        setHasChanges(false);
        setLoading(false);
      }
    });

    // Fallback: dacă nu primim INITIAL_SESSION în 2 secunde, verificăm manual
    const timeout = setTimeout(async () => {
      if (!mounted || !loading) return;

      console.log('Fallback: checking session manually');
      try {
        const { data: { session } } = await client.auth.getSession();
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);
        await loadUserData(currentUser);
      } catch (err) {
        console.error('Eroare la fallback getSession:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [anAgricolCurent]); // Reîncarcă culturile când se schimbă anul agricol

  // Verifică dacă anul curent e gol și anul anterior are culturi
  useEffect(() => {
    const verificaAnGol = async () => {
      if (!user || culturi.length > 0) {
        setVerificatAnGol(false);
        return;
      }

      // Dacă anul curent e gol, verifică dacă anul anterior are culturi
      const [startYear] = anAgricolCurent.split('-').map(Number);
      const anAnterior = `${startYear - 1}-${startYear}`;

      try {
        const culturiAnAnterior = await getCulturi(anAnterior);
        if (culturiAnAnterior.length > 0) {
          setAnulAnteriorAreCulturi(true);
          setVerificatAnGol(true);
        } else {
          setAnulAnteriorAreCulturi(false);
          setVerificatAnGol(false);
        }
      } catch (error) {
        console.error('Eroare verificare an anterior:', error);
        setVerificatAnGol(false);
      }
    };

    verificaAnGol();
  }, [user, culturi, anAgricolCurent]);

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
    const saved = await saveCultura(culturaSelectata, anAgricolCurent);

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

  // Adaugă o cultură nouă - deschide modal template-uri
  const handleAdaugaCultura = () => {
    setShowTemplateModal(true);
  };

  // Selectează template și creează cultură nouă
  const handleSelectTemplate = (culturaTemplate: Cultura) => {
    // Creează o nouă cultură cu ID unic
    const culturaNouaCuIdNou = {
      ...culturaTemplate,
      id: genereazaId(), // ID nou pentru a nu avea conflicte
    };

    // Adaugă în lista de culturi (chiar dacă nu e salvată încă)
    setCulturi(prev => [culturaNouaCuIdNou, ...prev]);

    // Selectează noua cultură
    setCulturaSelectata(culturaNouaCuIdNou);
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

  // Handler pentru success creare an nou
  const handleCreateAnSuccess = async () => {
    // Reîncarcă culturile (useEffect se va triggera automat când se schimbă anul în context)
    if (user) {
      const culturiSalvate = await getCulturi(anAgricolCurent);
      setCulturi(culturiSalvate);
      if (culturiSalvate.length > 0) {
        setCulturaSelectata(culturiSalvate[0]);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mesaj pentru utilizatori neautentificați */}
        {!loading && !user && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-5 text-sm shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-blue-900 mb-1">💡 Sfat pro</p>
                <p className="text-blue-700 leading-relaxed">
                  Conectează-te pentru a salva culturile în cloud și a le accesa de pe orice dispozitiv.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Banner sugestie creare an nou când anul e gol */}
        {user && verificatAnGol && anulAnteriorAreCulturi && (
          <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-900 text-lg mb-2">
                    📅 An agricol nou disponibil!
                  </h3>
                  <p className="text-amber-800 mb-3 leading-relaxed">
                    Ai selectat <strong>{anAgricolCurent}</strong> dar nu există culturi încă.
                    Avem culturi salvate din anul anterior care pot fi copiate automat.
                  </p>
                  <ul className="text-sm text-amber-700 space-y-1 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Toate lucrările și prețurile vor fi copiate
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Poți modifica suprafețele pentru fiecare cultură
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Prețurile pot fi actualizate după creare
                    </li>
                  </ul>
                  <button
                    onClick={() => setShowCreateAnModal(true)}
                    className="btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Creează {anAgricolCurent} acum</span>
                  </button>
                </div>
              </div>
              <button
                onClick={() => setVerificatAnGol(false)}
                className="text-amber-600 hover:text-amber-800 p-1 rounded-lg hover:bg-amber-100 transition-colors"
                title="Ascunde mesajul"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Dashboard General Fermă - afișat când există culturi salvate */}
        {culturi.length > 0 && (
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">📊 Dashboard General Fermă</h2>
              <p className="text-sm text-gray-600">Vizualizare completă a tuturor culturilor și statistici generale</p>
            </div>

            <FarmOverview
              culturi={culturi}
              onSelectCultura={handleSelectCultura}
              anAgricolCurent={anAgricolCurent}
              toolbarSlot={
                user ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      {/* Selector culturi */}
                      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        {hasChanges && (
                          <span className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-lg whitespace-nowrap">
                            📝 Nesalvat
                          </span>
                        )}
                        <select
                          value={culturaSelectata.id}
                          onChange={(e) => handleSelectCultura(e.target.value)}
                          className="input-field flex-1 font-semibold text-sm"
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

                      {/* Edit suprafață rapidă */}
                      <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-xl border border-green-200">
                        <label className="text-sm font-semibold text-green-700 whitespace-nowrap">
                          Suprafață:
                        </label>
                        <input
                          type="number"
                          value={culturaSelectata.hectare || ''}
                          onChange={(e) => handleUpdateCultura({ ...culturaSelectata, hectare: parseFloat(e.target.value) || 0 })}
                          className="input-field w-20 text-center font-bold text-green-700 text-sm"
                          placeholder="100"
                          min="0"
                          step="0.1"
                        />
                        <span className="text-sm font-medium text-green-700">ha</span>
                      </div>

                      {/* Butoane acțiuni */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleAdaugaCultura}
                          className="btn-primary flex items-center gap-2 text-sm px-3 py-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="whitespace-nowrap">Cultură nouă</span>
                        </button>

                        <button
                          onClick={handleSave}
                          disabled={saving || !hasChanges}
                          className={`btn-primary flex items-center gap-2 text-sm px-3 py-2 ${
                            !hasChanges ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          <span className="whitespace-nowrap">Salvează</span>
                        </button>

                        {culturi.length > 0 && (
                          <button
                            onClick={handleStergeCultura}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200 hover:border-red-300 text-sm font-medium"
                            title="Șterge cultura selectată"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="whitespace-nowrap">Șterge</span>
                          </button>
                        )}

                        {culturi.length > 0 && user && (
                          <button
                            onClick={() => setShowCreateAnModal(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all text-sm font-medium shadow-sm"
                            title="Creează un an agricol nou bazat pe anul curent"
                          >
                            <Calendar className="w-4 h-4" />
                            <span className="whitespace-nowrap">An Nou</span>
                          </button>
                        )}
                      </div>

                      {/* Status sincronizare */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                        {hasChanges ? (
                          <>
                            <CloudOff className="w-4 h-4 text-amber-500" />
                            <span className="hidden sm:inline text-sm font-semibold text-amber-700">Modificări nesalvate</span>
                          </>
                        ) : culturi.length > 0 ? (
                          <>
                            <Cloud className="w-4 h-4 text-green-500" />
                            <span className="hidden sm:inline text-sm font-semibold text-green-700">Salvat în cloud</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : undefined
              }
            />
          </div>
        )}

        {/* Separator */}
        {culturi.length > 0 && (
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 py-2 text-sm font-semibold text-gray-700 rounded-full border-2 border-gray-300">
                  Detalii Cultură Selectată: {culturaSelectata.nume}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Layout vertical: Formular full-width apoi Dashboard full-width */}
        <div className="space-y-8">
          {/* Formular - Full width pentru mai mult spațiu la Lucrări Agricole */}
          <div className="w-full">
            <CalculatorForm
              cultura={culturaSelectata}
              onUpdate={handleUpdateCultura}
            />
          </div>

          {/* Dashboard - Full width dedesubt */}
          <div className="w-full">
            <Dashboard cultura={culturaSelectata} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-200 mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm font-medium">
              © 2024 FarmCalc România. Calculator costuri agricole pentru fermieri.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-primary-700 text-sm font-semibold transition-colors">Contact</a>
              <a href="#" className="text-gray-600 hover:text-primary-700 text-sm font-semibold transition-colors">Termeni</a>
              <a href="#" className="text-gray-600 hover:text-primary-700 text-sm font-semibold transition-colors">Confidențialitate</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Modal Creare An Agricol Nou */}
      <CreateAnAgricolModal
        isOpen={showCreateAnModal}
        onClose={() => setShowCreateAnModal(false)}
        onSuccess={handleCreateAnSuccess}
        anAgricolCurent={anAgricolCurent}
        culturiCurente={culturi}
      />
    </div>
  );
}
