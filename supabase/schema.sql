-- PULSE Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_stars INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories (M1-M5)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- M1, M2, M3, M4, M5
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  question TEXT, -- Motivational prompt
  sort_order INTEGER DEFAULT 0,
  is_avoid BOOLEAN DEFAULT FALSE, -- For "Not To Do" category
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Missions (habits within categories)
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  weekly_goal INTEGER DEFAULT 7,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly Sprints
CREATE TABLE sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL, -- 1-52
  year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_stars INTEGER DEFAULT 0,
  avg_stars DECIMAL(3,2) DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, completed
  reflection TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_number, year)
);

-- Daily Completions
CREATE TABLE completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  value TEXT DEFAULT 'X', -- X, 1, or specific value (like wake time)
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mission_id, completed_date)
);

-- Daily Scores (aggregated)
CREATE TABLE daily_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
  score_date DATE NOT NULL,
  total_completed INTEGER DEFAULT 0,
  stars_earned INTEGER DEFAULT 0, -- 0-5
  category_scores JSONB DEFAULT '{}', -- {m1: 3, m2: 4, ...}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, score_date)
);

-- Calendar Events (synced from Google)
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  external_id TEXT, -- Google Calendar event ID
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  category_id UUID REFERENCES categories(id),
  mission_id UUID REFERENCES missions(id),
  source TEXT DEFAULT 'manual', -- manual, google, outlook
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements (PokeDex badges)
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  xp_reward INTEGER DEFAULT 0,
  requirement_type TEXT, -- streak, total_stars, category_mastery, etc.
  requirement_value INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Achievements (unlocked badges)
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Teams (for multiplayer)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL, -- Join code
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- owner, admin, member
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Weekly Challenges (head-to-head)
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenger_id UUID REFERENCES profiles(id),
  opponent_id UUID REFERENCES profiles(id),
  sprint_id UUID REFERENCES sprints(id),
  status TEXT DEFAULT 'pending', -- pending, active, completed
  winner_id UUID REFERENCES profiles(id),
  challenger_score INTEGER DEFAULT 0,
  opponent_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own categories" ON categories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own missions" ON missions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sprints" ON sprints FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own completions" ON completions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own daily_scores" ON daily_scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own calendar_events" ON calendar_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to initialize default categories for new user
CREATE OR REPLACE FUNCTION initialize_user_categories(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO categories (user_id, code, name, color, icon, question, sort_order, is_avoid) VALUES
    (p_user_id, 'M1', 'Morning Routine', '#EF9F27', '☀️', 'How you start determines how you finish.', 1, FALSE),
    (p_user_id, 'M2', 'Career / Work', '#378ADD', '💼', 'What skills will make you invaluable?', 2, FALSE),
    (p_user_id, 'M3', 'Health / Fuel', '#1D9E75', '💪', 'Your body is the vehicle. Maintain it.', 3, FALSE),
    (p_user_id, 'M4', 'Family & Accountability', '#D4537E', '❤️', 'Who are you showing up for?', 4, FALSE),
    (p_user_id, 'M5', 'Not To Do', '#5F5E5A', '🛡️', 'Awareness. Mark if you AVOIDED it.', 5, TRUE);
END;
$$ LANGUAGE plpgsql;

-- Function to initialize default missions for a category
CREATE OR REPLACE FUNCTION initialize_default_missions(p_user_id UUID, p_category_id UUID, p_category_code TEXT)
RETURNS VOID AS $$
BEGIN
  CASE p_category_code
    WHEN 'M1' THEN
      INSERT INTO missions (user_id, category_id, name, sort_order) VALUES
        (p_user_id, p_category_id, 'Wake Up (Target: 6AM)', 1),
        (p_user_id, p_category_id, 'Meditate', 2),
        (p_user_id, p_category_id, 'Gratitude / Journal', 3),
        (p_user_id, p_category_id, 'Read (10 pages)', 4),
        (p_user_id, p_category_id, 'Hydrate / Move', 5);
    WHEN 'M2' THEN
      INSERT INTO missions (user_id, category_id, name, sort_order) VALUES
        (p_user_id, p_category_id, 'Deep Work Block', 1),
        (p_user_id, p_category_id, 'Priority Task #1', 2),
        (p_user_id, p_category_id, 'Priority Task #2', 3),
        (p_user_id, p_category_id, 'Learning / Skill Build', 4),
        (p_user_id, p_category_id, 'Admin / Comms', 5);
    WHEN 'M3' THEN
      INSERT INTO missions (user_id, category_id, name, sort_order) VALUES
        (p_user_id, p_category_id, 'Sleep (7+ hrs)', 1),
        (p_user_id, p_category_id, 'Workout / Training', 2),
        (p_user_id, p_category_id, 'Nutrition Goal', 3),
        (p_user_id, p_category_id, 'Supplements / Water', 4),
        (p_user_id, p_category_id, 'Recovery / Stretch', 5);
    WHEN 'M4' THEN
      INSERT INTO missions (user_id, category_id, name, sort_order) VALUES
        (p_user_id, p_category_id, 'Present at Meals', 1),
        (p_user_id, p_category_id, 'Quality Time', 2),
        (p_user_id, p_category_id, 'Check-in / Call', 3),
        (p_user_id, p_category_id, 'Acts of Service', 4),
        (p_user_id, p_category_id, 'Weekly Review Together', 5);
    WHEN 'M5' THEN
      INSERT INTO missions (user_id, category_id, name, sort_order) VALUES
        (p_user_id, p_category_id, 'No Doom Scrolling', 1),
        (p_user_id, p_category_id, 'No Junk Food', 2),
        (p_user_id, p_category_id, 'No Excuses', 3),
        (p_user_id, p_category_id, 'No Negative Self-Talk', 4),
        (p_user_id, p_category_id, 'No ___', 5);
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Insert default achievements
INSERT INTO achievements (code, name, description, icon, color, xp_reward, requirement_type, requirement_value) VALUES
  ('first_star', 'First Light', 'Earn your first star', '⭐', '#EF9F27', 10, 'total_stars', 1),
  ('week_warrior', 'Week Warrior', 'Complete a full week', '🗓️', '#378ADD', 50, 'streak', 7),
  ('streak_14', 'On Fire', '14 day streak', '🔥', '#E24B4A', 100, 'streak', 14),
  ('streak_30', 'Unstoppable', '30 day streak', '💎', '#7F77DD', 250, 'streak', 30),
  ('perfect_day', 'Perfect Day', 'Earn all 5 stars in one day', '🌟', '#FFD700', 75, 'daily_stars', 5),
  ('category_master_m1', 'Early Bird', 'Complete M1 for 7 days straight', '🌅', '#EF9F27', 100, 'category_streak', 7),
  ('category_master_m2', 'Grinder', 'Complete M2 for 7 days straight', '💼', '#378ADD', 100, 'category_streak', 7),
  ('category_master_m3', 'Machine', 'Complete M3 for 7 days straight', '💪', '#1D9E75', 100, 'category_streak', 7),
  ('category_master_m4', 'Heart', 'Complete M4 for 7 days straight', '❤️', '#D4537E', 100, 'category_streak', 7),
  ('category_master_m5', 'Disciplined', 'Complete M5 for 7 days straight', '🛡️', '#5F5E5A', 100, 'category_streak', 7),
  ('centurion', 'Centurion', 'Earn 100 total stars', '💯', '#1D9E75', 200, 'total_stars', 100),
  ('level_5', 'Rising', 'Reach Level 5', '📈', '#378ADD', 150, 'level', 5),
  ('level_10', 'Elevated', 'Reach Level 10', '🚀', '#7F77DD', 300, 'level', 10);
