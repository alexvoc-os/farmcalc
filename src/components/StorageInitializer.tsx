'use client';

import { useEffect } from 'react';
import { initializeStorage } from '@/lib/storage-manager';

/**
 * StorageInitializer - Component client pentru inițializarea storage-ului
 * 
 * Acest component se ocupă de verificarea și curățarea automată
 * a localStorage la pornirea aplicației.
 */
export default function StorageInitializer() {
  useEffect(() => {
    // Verifică și inițializează storage-ul doar pe client
    if (typeof window !== 'undefined') {
      console.log('🚀 Initializing FarmCalc storage system...');
      initializeStorage();
    }
  }, []); // Rulează doar o dată la mount

  // Acest component nu renderează nimic în UI
  return null;
}
