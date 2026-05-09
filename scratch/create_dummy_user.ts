import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createDummyUser() {
  const email = 'client@example.com'
  const password = 'password123'

  console.log(`Attempting to register dummy user: ${email}`)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'John Client',
      }
    }
  })

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('User already exists. You can try logging in.')
    } else {
      console.error('Error creating user:', error.message)
    }
  } else {
    console.log('User created successfully!')
    console.log('Note: If email verification is enabled, you might need to check your email or disable it in Supabase dashboard.')
  }
}

createDummyUser()
