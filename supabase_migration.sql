-- Run this inside your Supabase Project's SQL Editor to enable the new XP level system!
-- We decided to use the `personality_profiles` table since the game already fetches and updates traits there.

ALTER TABLE public.personality_profiles 
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;

ALTER TABLE public.personality_profiles 
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

ALTER TABLE public.personality_profiles 
ADD COLUMN IF NOT EXISTS stories_completed INTEGER DEFAULT 0;

-- Daily Challenge and Streak System
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_date DATE,
ADD COLUMN IF NOT EXISTS daily_challenge_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS daily_challenge_personality TEXT;
