-- Run this inside your Supabase Project's SQL Editor to enable the new XP level system!
-- We decided to use the `personality_profiles` table since the game already fetches and updates traits there.

ALTER TABLE public.personality_profiles 
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;

ALTER TABLE public.personality_profiles 
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

ALTER TABLE public.personality_profiles 
ADD COLUMN IF NOT EXISTS stories_completed INTEGER DEFAULT 0;
