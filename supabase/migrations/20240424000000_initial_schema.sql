-- Create Enums
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
    'completed'
);
CREATE TYPE timeline_status AS ENUM ('pending', 'active', 'completed', 'rejected');
CREATE TYPE doc_type AS ENUM ('passport', 'cv', 'education', 'experience', 'cnic', 'other');
CREATE TYPE doc_status AS ENUM ('pending', 'approved', 'rejected', 'reupload_required');
CREATE TYPE payment_stage AS ENUM ('registration', 'processing', 'visa_ticket');
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'rejected');
CREATE TYPE notification_type AS ENUM ('stage_update', 'document', 'payment', 'message', 'system');

-- Create Tables

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

-- PAYMENTS
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    payment_stage payment_stage NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'PKR',
    receipt_url TEXT,
    status payment_status DEFAULT 'pending',
    confirmed_by UUID REFERENCES profiles(id),
    transaction_ref TEXT,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- MESSAGES
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    file_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type notification_type DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ACTIVITY LOGS
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    performed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- JOBS
CREATE POLICY "Jobs are viewable by everyone." ON jobs FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage jobs." ON jobs FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- APPLICATIONS
CREATE POLICY "Clients see only their own applications." ON applications FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Staff see assigned applications." ON applications FOR SELECT USING (assigned_staff_id = auth.uid());
CREATE POLICY "Admins see all applications." ON applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins/Staff can update applications." ON applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- DOCUMENTS
CREATE POLICY "Clients see only their own documents." ON documents FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Admins/Staff see all documents." ON documents FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
CREATE POLICY "Clients can upload documents." ON documents FOR INSERT WITH CHECK (client_id = auth.uid());

-- Similarly for other tables... (I'll keep it concise for now and expand if needed)
-- PAYMENTS
CREATE POLICY "Clients see only their own payments." ON payments FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Admins/Staff see all payments." ON payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
CREATE POLICY "Clients can create payments." ON payments FOR INSERT WITH CHECK (client_id = auth.uid());

-- MESSAGES
CREATE POLICY "Users can see messages they are part of." ON messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can send messages." ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- NOTIFICATIONS
CREATE POLICY "Users can see own notifications." ON notifications FOR SELECT USING (user_id = auth.uid());

-- Functions and Triggers
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
