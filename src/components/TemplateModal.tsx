'use client';

import { useState } from 'react';
import { X, Wheat, Sun, Leaf, Sprout } from 'lucide-react';
import { TEMPLATES_CULTURI, createCulturaFromTemplate } from '@/lib/templates-culturi';
import { Cultura } from '@/types';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (cultura: Cultura) => void;
}

export default function TemplateModal({ isOpen, onClose, onSelectTemplate }: TemplateModalProps) {
  const [hectare, setHectare] = useState(100);

  if (!isOpen) return null;

  const handleSelectTemplate = (templateId: string) => {
    const template = TEMPLATES_CULTURI.find(t => t.id === templateId);
    if (template) {
      const cultura = createCulturaFromTemplate(template, hectare);
      onSelectTemplate(cultura);
      onClose();
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wheat':
        return Wheat;
      case 'Sun':
        return Sun;
      case 'Leaf':
        return Leaf;
      case 'Sprout':
        return Sprout;
      default:
        return Wheat;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Creează din Template
        </h2>
        <p className="text-gray-500 mb-6">
          Selectează o cultură pentru a încărca o fișă tehnologică predefinită cu date reale România 2024-2025
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suprafață (ha)
          </label>
          <input
            type="number"
            value={hectare}
            onChange={(e) => setHectare(parseFloat(e.target.value) || 100)}
            className="input-field max-w-xs"
            placeholder="100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES_CULTURI.map(template => {
            const Icon = getIcon(template.icon);
            return (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className="card hover:border-farm-green-500 transition-all text-left p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-farm-green-100 p-2 rounded-lg">
                    <Icon className="w-6 h-6 text-farm-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{template.nume}</h3>
                    <p className="text-sm text-gray-500 mt-1">{template.descriere}</p>
                    <div className="mt-2 text-xs text-gray-400">
                      {template.mecanizare.length} lucrări •
                      Producție: {template.productieEstimata} kg/ha
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
