-- =============================================
-- SCHEMA SUPABASE PENTRU FARMCALC
-- Rulează acest script în Supabase SQL Editor
-- =============================================

-- Tabel pentru culturile utilizatorilor
CREATE TABLE IF NOT EXISTS culturi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nume TEXT NOT NULL,
  hectare NUMERIC NOT NULL DEFAULT 0,
  inputuri JSONB NOT NULL DEFAULT '[]',
  mecanizare JSONB NOT NULL DEFAULT '[]',
  manopera JSONB NOT NULL DEFAULT '[]',
  costuri_fixe JSONB NOT NULL DEFAULT '[]',
  productie NUMERIC NOT NULL DEFAULT 0,
  pret_vanzare NUMERIC NOT NULL DEFAULT 0,
  subventie_per_ha NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pentru căutări rapide per utilizator
CREATE INDEX IF NOT EXISTS culturi_user_id_idx ON culturi(user_id);

-- RLS (Row Level Security) - utilizatorii văd doar propriile culturi
ALTER TABLE culturi ENABLE ROW LEVEL SECURITY;

-- Policy: utilizatorii pot vedea doar propriile culturi
CREATE POLICY "Utilizatorii pot vedea propriile culturi"
  ON culturi FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: utilizatorii pot insera doar pentru ei înșiși
CREATE POLICY "Utilizatorii pot adăuga culturi"
  ON culturi FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: utilizatorii pot actualiza doar propriile culturi
CREATE POLICY "Utilizatorii pot actualiza propriile culturi"
  ON culturi FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: utilizatorii pot șterge doar propriile culturi
CREATE POLICY "Utilizatorii pot șterge propriile culturi"
  ON culturi FOR DELETE
  USING (auth.uid() = user_id);

-- Funcție pentru actualizarea automată a updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pentru updated_at
DROP TRIGGER IF EXISTS update_culturi_updated_at ON culturi;
CREATE TRIGGER update_culturi_updated_at
  BEFORE UPDATE ON culturi
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
