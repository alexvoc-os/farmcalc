-- =============================================
-- MIGRARE SUPABASE PENTRU UTILAJE
-- Adaugă tabele pentru utilaje, implementele și lucrări
-- Rulează acest script în Supabase SQL Editor
-- =============================================

-- Tabel pentru utilaje (tractoare)
CREATE TABLE IF NOT EXISTS utilaje (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nume TEXT NOT NULL,
  marca TEXT NOT NULL,
  model TEXT NOT NULL,
  putere_cp INTEGER NOT NULL DEFAULT 0,
  an_fabricatie INTEGER NOT NULL DEFAULT 2020,
  consum_mediu_l_ora NUMERIC DEFAULT NULL,
  valoare NUMERIC DEFAULT NULL,
  is_global BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pentru căutări rapide per utilizator
CREATE INDEX IF NOT EXISTS utilaje_user_id_idx ON utilaje(user_id);

-- RLS pentru utilaje
ALTER TABLE utilaje ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilizatorii pot vedea propriile utilaje"
  ON utilaje FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot adăuga utilaje"
  ON utilaje FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot actualiza propriile utilaje"
  ON utilaje FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot șterge propriile utilaje"
  ON utilaje FOR DELETE
  USING (auth.uid() = user_id);

-- Tabel pentru implementele agricole
CREATE TABLE IF NOT EXISTS implementele (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nume TEXT NOT NULL,
  tip TEXT NOT NULL,
  latime_lucru NUMERIC DEFAULT NULL,
  numar_randuri INTEGER DEFAULT NULL,
  greutate NUMERIC DEFAULT NULL,
  is_global BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pentru căutări rapide per utilizator
CREATE INDEX IF NOT EXISTS implementele_user_id_idx ON implementele(user_id);

-- RLS pentru implementele
ALTER TABLE implementele ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilizatorii pot vedea propriile implementele"
  ON implementele FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot adăuga implementele"
  ON implementele FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot actualiza propriile implementele"
  ON implementele FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot șterge propriile implementele"
  ON implementele FOR DELETE
  USING (auth.uid() = user_id);

-- Tabel pentru lucrări agricole predefinite
CREATE TABLE IF NOT EXISTS lucrari (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nume TEXT NOT NULL,
  utilaj_id UUID REFERENCES utilaje(id) ON DELETE CASCADE NOT NULL,
  implement_id UUID REFERENCES implementele(id) ON DELETE CASCADE NOT NULL,
  consum_motorina NUMERIC NOT NULL DEFAULT 0,
  descriere TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pentru căutări rapide
CREATE INDEX IF NOT EXISTS lucrari_user_id_idx ON lucrari(user_id);
CREATE INDEX IF NOT EXISTS lucrari_utilaj_id_idx ON lucrari(utilaj_id);
CREATE INDEX IF NOT EXISTS lucrari_implement_id_idx ON lucrari(implement_id);

-- RLS pentru lucrări
ALTER TABLE lucrari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilizatorii pot vedea propriile lucrări"
  ON lucrari FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot adăuga lucrări"
  ON lucrari FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot actualiza propriile lucrări"
  ON lucrari FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Utilizatorii pot șterge propriile lucrări"
  ON lucrari FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pentru updated_at pe utilaje
DROP TRIGGER IF EXISTS update_utilaje_updated_at ON utilaje;
CREATE TRIGGER update_utilaje_updated_at
  BEFORE UPDATE ON utilaje
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pentru updated_at pe implementele
DROP TRIGGER IF EXISTS update_implementele_updated_at ON implementele;
CREATE TRIGGER update_implementele_updated_at
  BEFORE UPDATE ON implementele
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pentru updated_at pe lucrări
DROP TRIGGER IF EXISTS update_lucrari_updated_at ON lucrari;
CREATE TRIGGER update_lucrari_updated_at
  BEFORE UPDATE ON lucrari
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
