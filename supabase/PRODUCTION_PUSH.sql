-- Master Migration Script for Eden Immigration Portal
-- Run this in the Supabase SQL Editor for your new project

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'client');
CREATE TYPE job_type AS ENUM ('full-time', 'contract', 'seasonal');
CREATE TYPE lmia_status AS ENUM ('approved', 'pending', 'not_required');
CREATE TYPE application_stage AS ENUM (
    'application_submitted',
    'documents_required',
    'documents_verified',
    'lmia_process',
    'offer_letter_issued',
    'visa_file_submitted',
    'visa_approved',
    'ticket_booked',
    'deployment_ready',
    'WAITING_FOR_DECISION',
    'completed'
);
CREATE TYPE timeline_status AS ENUM ('pending', 'active', 'completed', 'rejected');
CREATE TYPE doc_type AS ENUM ('passport', 'cv', 'education', 'experience', 'cnic', 'other');
CREATE TYPE doc_status AS ENUM ('pending', 'approved', 'rejected', 'reupload_required');
CREATE TYPE payment_stage AS ENUM ('registration', 'processing', 'visa_ticket');
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'rejected');
CREATE TYPE notification_type AS ENUM ('stage_update', 'document', 'payment', 'message', 'system');

-- 2. Create Tables

-- PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    cnic TEXT,
    passport_number TEXT,
    country_of_origin TEXT,
    education TEXT,
    experience_years INT,
    role user_role DEFAULT 'client',
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES profiles(id),
    language_preference TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- JOBS
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    country TEXT NOT NULL,
    salary_min NUMERIC,
    salary_max NUMERIC,
    job_type job_type DEFAULT 'full-time',
    category TEXT,
    lmia_status lmia_status DEFAULT 'pending',
    requirements TEXT[],
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    posted_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- APPLICATIONS
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    assigned_staff_id UUID REFERENCES profiles(id),
    current_stage application_stage DEFAULT 'application_submitted',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- APPLICATION TIMELINE
CREATE TABLE application_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    stage application_stage NOT NULL,
    status timeline_status DEFAULT 'pending',
    date_reached TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    admin_note TEXT,
    updated_by UUID REFERENCES profiles(id)
);

-- DOCUMENTS
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    doc_type doc_type NOT NULL,
    file_url TEXT NOT NULL,
    status doc_status DEFAULT 'pending',
    admin_note TEXT,
    verified_by UUID REFERENCES profiles(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- INTERVIEW QUESTIONS
CREATE TABLE interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone." ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Jobs viewable by everyone." ON jobs FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage jobs." ON jobs FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Clients see own apps." ON applications FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Admins see all apps." ON applications FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Questions viewable by everyone." ON interview_questions FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage questions." ON interview_questions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 4. Initial Data
INSERT INTO interview_questions (question, category) VALUES 
('What is the primary purpose of your travel to the destination country?', 'General'),
('How will you support yourself financially during your stay?', 'Finance'),
('Tell me about your previous work experience and qualifications?', 'Experience'),
('Do you have any family members currently residing at the destination?', 'Family'),
('What are your long-term plans after your initial visa period ends?', 'Intent');

-- 5. Auth Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
