// Accepts "Authorization: Bearer <ADMIN_KEY>" (scripts, Custom GPT actions) or ?key=<ADMIN_KEY> (browser).
// Vercel cron sends "Bearer <CRON_SECRET>", which is accepted where cron is allowed.
export function isAdmin(req, { allowCron = false } = {}) {
  const header = req.headers.authorization || '';
  const keys = [process.env.ADMIN_KEY, allowCron && process.env.CRON_SECRET].filter(Boolean);
  return keys.some((k) => header === `Bearer ${k}`) || (req.query.key && req.query.key === process.env.ADMIN_KEY);
}
