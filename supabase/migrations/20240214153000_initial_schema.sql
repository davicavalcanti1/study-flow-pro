-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUMs
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('STUDENT', 'ASSESSOR', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE profile_type AS ENUM ('ROUTINE', 'CYCLE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. PROFILES (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role user_role DEFAULT 'STUDENT',
    avatar_url TEXT,
    
    -- Student specific fields
    profile_type profile_type DEFAULT 'ROUTINE',
    weak_subjects TEXT[], -- Array of strings
    goals JSONB DEFAULT '{}'::jsonb, -- Stores dailyQuestions, dailyHours, etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. ASSESSOR_STUDENTS (Relationship)
CREATE TABLE IF NOT EXISTS public.assessor_students (
    assessor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (assessor_id, student_id)
);
ALTER TABLE public.assessor_students ENABLE ROW LEVEL SECURITY;

-- 3. STUDY SESSIONS
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    method TEXT, -- Check constraint can vary, kept text for flexibility
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_seconds INTEGER DEFAULT 0,
    questions_total INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- 4. SIMULATIONS
CREATE TABLE IF NOT EXISTS public.simulations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type TEXT,
    score NUMERIC,
    max_score NUMERIC DEFAULT 1000,
    breakdown JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- 5. ESSAYS (Redações)
CREATE TABLE IF NOT EXISTS public.essays (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    theme TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'Pendente',
    score INTEGER,
    feedback TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;

-- 6. FORUM POSTS
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    attachment_url TEXT,
    attachment_type TEXT,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- 7. FORUM COMMENTS
CREATE TABLE IF NOT EXISTS public.forum_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

-- POLICIES (Simplified for initial setup)

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- STUDY SESSIONS
CREATE POLICY "Users can manage their own study sessions" ON public.study_sessions FOR ALL USING (auth.uid() = student_id);

-- SIMULATIONS
CREATE POLICY "Users can manage their own simulations" ON public.simulations FOR ALL USING (auth.uid() = student_id);

-- ESSAYS
CREATE POLICY "Users can manage their own essays" ON public.essays FOR ALL USING (auth.uid() = student_id);

-- FORUM
CREATE POLICY "Authenticated users can read posts" ON public.forum_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create posts" ON public.forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authenticated users can read comments" ON public.forum_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create comments" ON public.forum_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

-- TRIGGER FOR NEW USER (Profile Creation)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', 'STUDENT');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
