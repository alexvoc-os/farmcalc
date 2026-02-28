-- ================================================
-- SOLUȚIE SIMPLĂ: Creează/Recreează tabelele
-- ================================================

-- 1. Șterge tabelele vechi (dacă există)
DROP TABLE IF EXISTS lucrari_custom CASCADE;
DROP TABLE IF EXISTS implementele CASCADE;
DROP TABLE IF EXISTS utilaje CASCADE;

-- 2. TABEL UTILAJE (simplu, fără generated columns)
CREATE TABLE utilaje (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marca TEXT NOT NULL,
  model TEXT NOT NULL,
  putere_cp INTEGER NOT NULL,
  an_fabricatie INTEGER,
  consum_mediu_l_ora NUMERIC(10,2),
  valoare NUMERIC(10,2), -- Valoare de inventar (opțional)
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL IMPLEMENTELE
CREATE TABLE implementele (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nume TEXT NOT NULL,
  tip TEXT NOT NULL,
  latime_lucru NUMERIC(10,2),
  numar_randuri INTEGER, -- Număr rânduri (pentru semănători, plantatoare)
  greutate NUMERIC(10,2),
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL LUCRĂRI CUSTOM
CREATE TABLE lucrari_custom (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nume TEXT NOT NULL,
  utilaj_id TEXT NOT NULL, -- ID tractor
  implement_id TEXT NOT NULL, -- ID implement
  consum_motorina NUMERIC(10,2) NOT NULL, -- litri/ha
  descriere TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS POLICIES
ALTER TABLE utilaje ENABLE ROW LEVEL SECURITY;
ALTER TABLE implementele ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucrari_custom ENABLE ROW LEVEL SECURITY;

-- Utilaje policies
CREATE POLICY "Users can view own utilaje" ON utilaje FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own utilaje" ON utilaje FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own utilaje" ON utilaje FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own utilaje" ON utilaje FOR DELETE USING (auth.uid() = user_id);

-- Implementele policies
CREATE POLICY "Users can view own implementele" ON implementele FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own implementele" ON implementele FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own implementele" ON implementele FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own implementele" ON implementele FOR DELETE USING (auth.uid() = user_id);

-- Lucrari policies
CREATE POLICY "Users can view own lucrari" ON lucrari_custom FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lucrari" ON lucrari_custom FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lucrari" ON lucrari_custom FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lucrari" ON lucrari_custom FOR DELETE USING (auth.uid() = user_id);

-- 6. Indexes
CREATE INDEX idx_utilaje_user_id ON utilaje(user_id);
CREATE INDEX idx_implementele_user_id ON implementele(user_id);
CREATE INDEX idx_lucrari_custom_user_id ON lucrari_custom(user_id);

-- 7. Verificare
SELECT 'utilaje' as tabel, COUNT(*) as inregistrari FROM utilaje
UNION ALL
SELECT 'implementele', COUNT(*) FROM implementele
UNION ALL
SELECT 'lucrari_custom', COUNT(*) FROM lucrari_custom;
