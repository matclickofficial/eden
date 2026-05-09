-- Create Interview Questions Table
CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Interview questions are viewable by everyone." ON interview_questions FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage interview questions." ON interview_questions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert Initial Global Questions
INSERT INTO interview_questions (question, category) VALUES 
('What is the primary purpose of your travel to the destination country?', 'General'),
('How will you support yourself financially during your stay?', 'Finance'),
('Tell me about your previous work experience and qualifications?', 'Experience'),
('Do you have any family members currently residing at the destination?', 'Family'),
('What are your long-term plans after your initial visa period ends?', 'Intent');
