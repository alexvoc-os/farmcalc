-- ================================================
-- MANAGEMENT UTILAJE ȘI LUCRĂRI AGRICOLE
-- Data: 2026-02-28
-- Scop: Tabele pentru salvarea utilajelor și lucrărilor per utilizator
-- ================================================

-- 1. TABEL UTILAJE (Tractoare)
CREATE TABLE IF NOT EXISTS utilaje (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nume TEXT NOT NULL,
  marca TEXT NOT NULL,
  model TEXT NOT NULL,
  putere_cp INTEGER NOT NULL,
  an_fabricatie INTEGER,
  consum_mediu_l_ora NUMERIC(10,2),
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL IMPLEMENTELE
CREATE TABLE IF NOT EXISTS implementele (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nume TEXT NOT NULL,
  tip TEXT NOT NULL,
  latime_lucru NUMERIC(10,2),
  greutate NUMERIC(10,2),
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL LUCRĂRI CUSTOM
CREATE TABLE IF NOT EXISTS lucrari_custom (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nume TEXT NOT NULL,
  tip TEXT NOT NULL,
  descriere TEXT,
  is_global BOOLEAN DEFAULT false,
  ordine INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

ALTER TABLE utilaje ENABLE ROW LEVEL SECURITY;
ALTER TABLE implementele ENABLE ROW LEVEL SECURITY;
ALTER TABLE lucrari_custom ENABLE ROW LEVEL SECURITY;

-- Policies pentru UTILAJE
DROP POLICY IF EXISTS "Users can view own utilaje" ON utilaje;
DROP POLICY IF EXISTS "Users can insert own utilaje" ON utilaje;
DROP POLICY IF EXISTS "Users can update own utilaje" ON utilaje;
DROP POLICY IF EXISTS "Users can delete own utilaje" ON utilaje;

CREATE POLICY "Users can view own utilaje" ON utilaje FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own utilaje" ON utilaje FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own utilaje" ON utilaje FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own utilaje" ON utilaje FOR DELETE USING (auth.uid() = user_id);

-- Policies pentru IMPLEMENTELE
DROP POLICY IF EXISTS "Users can view own implementele" ON implementele;
DROP POLICY IF EXISTS "Users can insert own implementele" ON implementele;
DROP POLICY IF EXISTS "Users can update own implementele" ON implementele;
DROP POLICY IF EXISTS "Users can delete own implementele" ON implementele;

CREATE POLICY "Users can view own implementele" ON implementele FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own implementele" ON implementele FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own implementele" ON implementele FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own implementele" ON implementele FOR DELETE USING (auth.uid() = user_id);

-- Policies pentru LUCRĂRI CUSTOM
DROP POLICY IF EXISTS "Users can view own lucrari" ON lucrari_custom;
DROP POLICY IF EXISTS "Users can insert own lucrari" ON lucrari_custom;
DROP POLICY IF EXISTS "Users can update own lucrari" ON lucrari_custom;
DROP POLICY IF EXISTS "Users can delete own lucrari" ON lucrari_custom;

CREATE POLICY "Users can view own lucrari" ON lucrari_custom FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lucrari" ON lucrari_custom FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lucrari" ON lucrari_custom FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lucrari" ON lucrari_custom FOR DELETE USING (auth.uid() = user_id);

-- ================================================
-- INDEXES pentru performanță
-- ================================================

CREATE INDEX IF NOT EXISTS idx_utilaje_user_id ON utilaje(user_id);
CREATE INDEX IF NOT EXISTS idx_implementele_user_id ON implementele(user_id);
CREATE INDEX IF NOT EXISTS idx_lucrari_custom_user_id ON lucrari_custom(user_id);

-- ================================================
-- VERIFICARE TABELE
-- ================================================

SELECT
  'utilaje' as tabel,
  COUNT(*) as numar_inregistrari
FROM utilaje
UNION ALL
SELECT
  'implementele' as tabel,
  COUNT(*) as numar_inregistrari
FROM implementele
UNION ALL
SELECT
  'lucrari_custom' as tabel,
  COUNT(*) as numar_inregistrari
FROM lucrari_custom;

-- ================================================
-- INSTRUCȚIUNI:
-- 1. Deschide Supabase Dashboard → SQL Editor
-- 2. Creează New Query
-- 3. Copiază și Rulează acest script (Cmd+Enter)
-- 4. Verifică că tabelele au fost create cu succes
-- ================================================
