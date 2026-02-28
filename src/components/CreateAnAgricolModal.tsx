'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Cultura } from '@/types';
import { copiazaCulturiInAnNou } from '@/lib/culturi-service';
import { formatAgriculturalYear, getNextAgriculturalYear } from '@/lib/an-agricol-helpers';

interface CreateAnAgricolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  anAgricolCurent: string;
  culturiCurente: Cultura[];
}

export default function CreateAnAgricolModal({
  isOpen,
  onClose,
  onSuccess,
  anAgricolCurent,
  culturiCurente,
}: CreateAnAgricolModalProps) {
  const [loading, setLoading] = useState(false);
  const [suprafete, setSuprafete] = useState<Record<string, number>>({});
  const anNou = getNextAgriculturalYear(anAgricolCurent);

  // Inițializează suprafețele cu valorile curente
  useEffect(() => {
    if (isOpen) {
      const initialSuprafete: Record<string, number> = {};
      culturiCurente.forEach(cultura => {
        initialSuprafete[cultura.id] = cultura.hectare;
      });
      setSuprafete(initialSuprafete);
    }
  }, [isOpen, culturiCurente]);

  const handleCreareAnNou = async () => {
    setLoading(true);

    try {
      const success = await copiazaCulturiInAnNou(
        anAgricolCurent,
        anNou,
        suprafete
      );

      if (success) {
        onSuccess();
        onClose();
      } else {
        alert('Eroare la crearea anului agricol nou. Verifică consola pentru detalii.');
      }
    } catch (error) {
      console.error('Eroare la crearea anului:', error);
      alert('Eroare la crearea anului agricol nou.');
    } finally {
      setLoading(false);
    }
  };

  const updateSuprafata = (id: string, hectare: number) => {
    setSuprafete(prev => ({ ...prev, [id]: hectare }));
  };

  const totalHectare = Object.values(suprafete).reduce((sum, ha) => sum + ha, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Creează An Agricol Nou</h2>
                <p className="text-primary-100 text-sm mt-1">
                  {formatAgriculturalYear(anNou)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {culturiCurente.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto text-amber-500 mb-4" />
              <p className="text-gray-600 font-medium mb-2">
                Nu există culturi în anul curent
              </p>
              <p className="text-sm text-gray-500">
                Adaugă culturi în {formatAgriculturalYear(anAgricolCurent)} înainte de a crea un an nou.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Cum funcționează?</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                      <li>Toate culturile vor fi copiate cu structura lor completă (lucrări, inputuri, prețuri)</li>
                      <li>Modifică suprafețele mai jos pentru fiecare cultură</li>
                      <li>Poți actualiza prețurile după creare din calculatorul de costuri</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Modifică Suprafețele</h3>
                  <div className="text-sm">
                    <span className="text-gray-600">Total:</span>{' '}
                    <span className="font-bold text-primary-600">{totalHectare.toFixed(1)} ha</span>
                  </div>
                </div>

                {culturiCurente.map(cultura => (
                  <div
                    key={cultura.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{cultura.nume}</p>
                      <p className="text-xs text-gray-500">
                        Anul curent: {cultura.hectare} ha
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={suprafete[cultura.id] || 0}
                        onChange={(e) => updateSuprafata(cultura.id, parseFloat(e.target.value) || 0)}
                        className="input-field w-24 text-center font-bold"
                        min="0"
                        step="0.1"
                        disabled={loading}
                      />
                      <span className="text-sm font-medium text-gray-700">ha</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {culturiCurente.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              disabled={loading}
            >
              Anulează
            </button>
            <button
              onClick={handleCreareAnNou}
              disabled={loading || totalHectare === 0}
              className="btn-primary flex items-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Se creează...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Creează {formatAgriculturalYear(anNou)}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
