/**
 * Date predefinite pentru sistemul de management utilaje agricole
 * Datele sunt globale (isGlobal: true) și nu pot fi modificate de utilizatori
 */

import { LucrareAgricolaPredefinita, Utilaj, Implement } from '@/types';
import { genereazaId } from './calcule';

// === 20 LUCRĂRI AGRICOLE COMUNE ÎN ROMÂNIA ===

export const LUCRARI_PREDEFINITE: LucrareAgricolaPredefinita[] = [
  // Lucrări de câmp
  { id: genereazaId(), nume: 'Arat', tip: 'camp', descriere: 'Arătură de bază (toamnă/primăvară)', isGlobal: true, ordine: 1 },
  { id: genereazaId(), nume: 'Discuit', tip: 'camp', descriere: 'Afânarea solului', isGlobal: true, ordine: 2 },
  { id: genereazaId(), nume: 'Pregătit pat germinativ', tip: 'camp', descriere: 'Combinare/grăpat', isGlobal: true, ordine: 3 },
  { id: genereazaId(), nume: 'Semănat grâu/orz', tip: 'camp', descriere: 'Semănat cereale păioase de toamnă', isGlobal: true, ordine: 4 },
  { id: genereazaId(), nume: 'Semănat porumb', tip: 'camp', descriere: 'Semănat porumb boabe/siloz', isGlobal: true, ordine: 5 },
  { id: genereazaId(), nume: 'Semănat floarea-soarelui', tip: 'camp', descriere: 'Semănat cultură tehnică', isGlobal: true, ordine: 6 },
  { id: genereazaId(), nume: 'Semănat rapiță', tip: 'camp', descriere: 'Semănat rapiță de toamnă', isGlobal: true, ordine: 7 },
  { id: genereazaId(), nume: 'Fertilizat cu îngrășăminte chimice', tip: 'camp', descriere: 'Împrăștiat îngrășăminte minerale', isGlobal: true, ordine: 8 },
  { id: genereazaId(), nume: 'Prășit porumb', tip: 'camp', descriere: 'Prășit mecanic între rânduri', isGlobal: true, ordine: 9 },
  { id: genereazaId(), nume: 'Tăvălugit', tip: 'camp', descriere: 'Tasare sol după semănat', isGlobal: true, ordine: 10 },

  // Tratamente fitosanitare
  { id: genereazaId(), nume: 'Erbicidat', tip: 'tratament', descriere: 'Aplicare erbicide', isGlobal: true, ordine: 11 },
  { id: genereazaId(), nume: 'Fungicidat', tip: 'tratament', descriere: 'Aplicare fungicide', isGlobal: true, ordine: 12 },
  { id: genereazaId(), nume: 'Insecticid', tip: 'tratament', descriere: 'Aplicare insecticide', isGlobal: true, ordine: 13 },
  { id: genereazaId(), nume: 'Tratament foliar', tip: 'tratament', descriere: 'Fertilizare foliară', isGlobal: true, ordine: 14 },

  // Recoltare
  { id: genereazaId(), nume: 'Recoltat cereale', tip: 'recoltare', descriere: 'Recoltat grâu/orz/ovăz', isGlobal: true, ordine: 15 },
  { id: genereazaId(), nume: 'Recoltat porumb', tip: 'recoltare', descriere: 'Recoltat porumb boabe', isGlobal: true, ordine: 16 },
  { id: genereazaId(), nume: 'Recoltat floarea-soarelui', tip: 'recoltare', descriere: 'Recoltat cultură tehnică', isGlobal: true, ordine: 17 },

  // Transport
  { id: genereazaId(), nume: 'Transport la siloz', tip: 'transport', descriere: 'Transport produse recoltate', isGlobal: true, ordine: 18 },

  // Altele
  { id: genereazaId(), nume: 'Tocarea resturilor vegetale', tip: 'altele', descriere: 'Tocător masă vegetală', isGlobal: true, ordine: 19 },
  { id: genereazaId(), nume: 'Dezmiristit', tip: 'altele', descriere: 'Combatere buruieni perene', isGlobal: true, ordine: 20 },
];

// === 12 TRACTOARE POPULARE ÎN ROMÂNIA ===

export const TRACTOARE_PREDEFINITE: Utilaj[] = [
  // John Deere
  { id: genereazaId(), nume: 'John Deere 6230', marca: 'John Deere', model: '6230', putereCP: 230, anFabricatie: 2020, consumMediuLOra: 15, isGlobal: true },
  { id: genereazaId(), nume: 'John Deere 6150R', marca: 'John Deere', model: '6150R', putereCP: 150, anFabricatie: 2019, consumMediuLOra: 12, isGlobal: true },

  // Case IH
  { id: genereazaId(), nume: 'Case IH Puma 185', marca: 'Case IH', model: 'Puma 185', putereCP: 185, anFabricatie: 2021, consumMediuLOra: 14, isGlobal: true },

  // New Holland
  { id: genereazaId(), nume: 'New Holland T7.270', marca: 'New Holland', model: 'T7.270', putereCP: 270, anFabricatie: 2020, consumMediuLOra: 18, isGlobal: true },

  // Fendt
  { id: genereazaId(), nume: 'Fendt 724 Vario', marca: 'Fendt', model: '724 Vario', putereCP: 240, anFabricatie: 2019, consumMediuLOra: 16, isGlobal: true },

  // Massey Ferguson
  { id: genereazaId(), nume: 'Massey Ferguson 7726', marca: 'Massey Ferguson', model: '7726', putereCP: 260, anFabricatie: 2021, consumMediuLOra: 17, isGlobal: true },

  // Claas
  { id: genereazaId(), nume: 'Claas Axion 850', marca: 'Claas', model: 'Axion 850', putereCP: 340, anFabricatie: 2020, consumMediuLOra: 22, isGlobal: true },

  // Deutz-Fahr
  { id: genereazaId(), nume: 'Deutz-Fahr 6215 TTV', marca: 'Deutz-Fahr', model: '6215 TTV', putereCP: 215, anFabricatie: 2018, consumMediuLOra: 15, isGlobal: true },

  // Valtra
  { id: genereazaId(), nume: 'Valtra T234', marca: 'Valtra', model: 'T234', putereCP: 240, anFabricatie: 2019, consumMediuLOra: 16, isGlobal: true },

  // Same
  { id: genereazaId(), nume: 'Same Virtus 140', marca: 'Same', model: 'Virtus 140', putereCP: 140, anFabricatie: 2017, consumMediuLOra: 11, isGlobal: true },

  // Landini
  { id: genereazaId(), nume: 'Landini 6-175', marca: 'Landini', model: '6-175', putereCP: 175, anFabricatie: 2018, consumMediuLOra: 13, isGlobal: true },

  // Kubota
  { id: genereazaId(), nume: 'Kubota M7-172', marca: 'Kubota', model: 'M7-172', putereCP: 170, anFabricatie: 2020, consumMediuLOra: 13, isGlobal: true },
];

// === 18 IMPLEMENTELE AGRICOLE COMUNE ===

export const IMPLEMENTELE_PREDEFINITE: Implement[] = [
  // Pluguri
  { id: genereazaId(), nume: 'Plug reversibil 5 trupițe', tip: 'plug', latimeLucru: 2.5, greutate: 1200, isGlobal: true },
  { id: genereazaId(), nume: 'Plug reversibil 4 trupițe', tip: 'plug', latimeLucru: 2.0, greutate: 1000, isGlobal: true },
  { id: genereazaId(), nume: 'Plug fix 3 trupițe', tip: 'plug', latimeLucru: 1.5, greutate: 600, isGlobal: true },

  // Discuri
  { id: genereazaId(), nume: 'Disc greu 32 talere', tip: 'disc', latimeLucru: 4.0, greutate: 2500, isGlobal: true },
  { id: genereazaId(), nume: 'Disc greu 28 talere', tip: 'disc', latimeLucru: 3.5, greutate: 2200, isGlobal: true },
  { id: genereazaId(), nume: 'Disc offset 24 talere', tip: 'disc', latimeLucru: 3.0, greutate: 1800, isGlobal: true },

  // Semănători
  { id: genereazaId(), nume: 'Semănătoare cereale 4m', tip: 'semanatoare', latimeLucru: 4.0, numarRanduri: 24, greutate: 1500, isGlobal: true },
  { id: genereazaId(), nume: 'Semănătoare porumb 6 rânduri', tip: 'semanatoare', latimeLucru: 4.5, numarRanduri: 6, greutate: 1200, isGlobal: true },
  { id: genereazaId(), nume: 'Semănătoare porumb 8 rânduri', tip: 'semanatoare', latimeLucru: 6.0, numarRanduri: 8, greutate: 1500, isGlobal: true },
  { id: genereazaId(), nume: 'Semănătoare pneumatică 12 rânduri', tip: 'semanatoare', latimeLucru: 9.0, numarRanduri: 12, greutate: 2000, isGlobal: true },

  // Combinatoare
  { id: genereazaId(), nume: 'Combinator 4m', tip: 'combinator', latimeLucru: 4.0, greutate: 800, isGlobal: true },
  { id: genereazaId(), nume: 'Combinator 6m', tip: 'combinator', latimeLucru: 6.0, greutate: 1200, isGlobal: true },

  // Tocătoare
  { id: genereazaId(), nume: 'Tocător resturi vegetale 4m', tip: 'tocator', latimeLucru: 4.0, greutate: 1000, isGlobal: true },
  { id: genereazaId(), nume: 'Tocător resturi vegetale 6m', tip: 'tocator', latimeLucru: 6.0, greutate: 1500, isGlobal: true },

  // Stropitoare
  { id: genereazaId(), nume: 'Stropitoare cu ramă 18m', tip: 'stropitoare', latimeLucru: 18.0, greutate: 1200, isGlobal: true },
  { id: genereazaId(), nume: 'Stropitoare cu ramă 24m', tip: 'stropitoare', latimeLucru: 24.0, greutate: 1800, isGlobal: true },

  // Combină
  { id: genereazaId(), nume: 'Combină cereale 6m', tip: 'combina', latimeLucru: 6.0, isGlobal: true },
  { id: genereazaId(), nume: 'Combină cereale 7.5m', tip: 'combina', latimeLucru: 7.5, isGlobal: true },
];
