

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function fetchSchema() {
  const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${serviceKey}`, {
    headers: { Authorization: `Bearer ${serviceKey}` }
  })
  const data = await res.json()
  
  console.log(Object.keys(data.paths))
}

fetchSchema()
