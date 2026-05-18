const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

async function fetchBotUsers() {
  const res = await fetch(`${supabaseUrl}/rest/v1/bot_users?limit=1`, {
    headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey }
  })
  const data = await res.json()
  
  console.log(data)
}

fetchBotUsers()
