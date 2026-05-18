const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function fetchCategories() {
  const res = await fetch(`${supabaseUrl}/rest/v1/categories?select=*`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
  })
  const data = await res.json()
  
  console.log(data)
}

fetchCategories()
