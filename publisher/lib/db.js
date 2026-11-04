// Calls the SECURITY DEFINER functions in Supabase. Every call carries DB_SECRET,
// so the public publishable key alone cannot read the token or the queue.
export async function rpc(fn, args = {}) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_secret: process.env.DB_SECRET, ...args }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase ${fn} ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}
