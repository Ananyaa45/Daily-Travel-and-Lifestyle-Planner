-- Saanjh: users table + profile storage bucket (SRS §10)
-- Run in Supabase SQL Editor or via CLI

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT NOT NULL UNIQUE,
  email TEXT,
  username TEXT UNIQUE,
  display_name TEXT,
  profile_photo_url TEXT,
  dietary_tags TEXT[] NOT NULL DEFAULT '{}',
  lifestyle_tags TEXT[] NOT NULL DEFAULT '{}',
  interest_tags TEXT[] NOT NULL DEFAULT '{}',
  onboarding_profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_preferences_complete BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_calendar_complete BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_wardrobe_complete BOOLEAN NOT NULL DEFAULT FALSE,
  city TEXT DEFAULT 'Delhi',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users (clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (username);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON public.users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Service upload profile photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Service update profile photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Service delete profile photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'profile-photos');
