import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local")
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function addAdmin() {
  const email = 'akramfarmonov5@gmail.com'
  
  // Get all users
  const { data, error } = await supabaseAdmin.auth.admin.listUsers()
  if (error) {
    console.error("Error fetching users:", error)
    process.exit(1)
  }

  const user = data.users.find(u => u.email === email)
  
  if (!user) {
    console.error(`User with email ${email} not found in Supabase Auth.`)
    process.exit(1)
  }

  console.log(`Found user! UUID: ${user.id}`)

  // Add to admin_users table
  const { data: insertData, error: insertError } = await supabaseAdmin
    .from('admin_users')
    .insert([{ user_id: user.id }])
    .select()

  if (insertError) {
    if (insertError.code === '23505') {
      console.log("User is already in admin_users table!")
    } else {
      console.error("Error inserting into admin_users:", insertError)
      process.exit(1)
    }
  } else {
    console.log("Successfully added user to admin_users:", insertData)
  }
}

addAdmin()
