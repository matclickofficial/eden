-- SQL script to create a seed admin user profile
-- Note: You must first register the user via the UI to create the Auth user, 
-- or use the Supabase 'Users' dashboard to create a user with email/password.
-- Once the Auth user is created, copy their 'id' (UUID) and run this:

-- Replace 'YOUR_USER_UUID' with the actual ID from the Auth.users table
-- This will give them full admin access.

INSERT INTO public.profiles (id, full_name, role, phone)
VALUES (
  'YOUR_USER_UUID', 
  'System Admin', 
  'admin', 
  '+923000000000'
)
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', full_name = 'System Admin';

-- Alternative: If you just want to update an existing user to Admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@eden.com'; -- Assuming you added email to profiles or use a join
