-- Payment System Enhancements
-- 1. Create Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    instructions TEXT,
    image_url TEXT, -- for QR code or bank logo
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Update Payments Table (if not already enhanced)
-- Check if payment_method_id exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payments' AND column_name='payment_method_id') THEN
        ALTER TABLE payments ADD COLUMN payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- 4. Policies
DROP POLICY IF EXISTS "Payment methods viewable by everyone." ON payment_methods;
CREATE POLICY "Payment methods viewable by everyone." ON payment_methods FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admins manage payment methods." ON payment_methods;
CREATE POLICY "Admins manage payment methods." ON payment_methods FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Ensure storage bucket 'documents' exists (usually it does, but for robustness)
-- This part is usually handled via Supabase dashboard or separate management
