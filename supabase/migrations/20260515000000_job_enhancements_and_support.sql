-- Job Application Enhancements & Support Desk Migration
-- Created at: 2026-05-15

-- 1. Profiles Update
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS surname TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

-- 2. Application Checkpoints
CREATE TABLE IF NOT EXISTS application_checkpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    document_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Support Tickets
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Open', -- Open, In Progress, Resolved, Closed
    priority TEXT DEFAULT 'Normal', -- Low, Normal, High
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE application_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Checkpoints
CREATE POLICY "Clients see own checkpoints" ON application_checkpoints FOR SELECT 
USING (EXISTS (SELECT 1 FROM applications WHERE id = application_id AND client_id = auth.uid()));

CREATE POLICY "Admins manage checkpoints" ON application_checkpoints FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Tickets
CREATE POLICY "Clients manage own tickets" ON tickets FOR ALL 
USING (client_id = auth.uid());

CREATE POLICY "Admins manage all tickets" ON tickets FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Ticket Replies
CREATE POLICY "Users see own ticket replies" ON ticket_replies FOR SELECT 
USING (EXISTS (SELECT 1 FROM tickets WHERE id = ticket_id AND (client_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))));

CREATE POLICY "Users create ticket replies" ON ticket_replies FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM tickets WHERE id = ticket_id AND (client_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))));
