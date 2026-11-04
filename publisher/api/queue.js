import { rpc } from '../lib/db.js';
import { isAdmin } from '../lib/auth.js';

// GET    → upcoming and recent posts
// POST   → { posts: [{ at, text, manual? }] } (the schedule.json the skill writes)
// DELETE → ?id=<id> cancels a scheduled post
export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).send('Unauthorized');

  if (req.method === 'GET') return res.status(200).json(await rpc('li_queue_list'));

  if (req.method === 'DELETE') {
    const id = Number(req.query.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id is required' });
    const ok = await rpc('li_cancel', { p_id: id });
    return res.status(ok ? 200 : 404).json({ cancelled: ok, id });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const posts = Array.isArray(body) ? body : body?.posts;
    if (!Array.isArray(posts)) return res.status(400).json({ error: 'Send { "posts": [ ... ] }' });

    const rows = [];
    const errors = [];
    posts.forEach((p, i) => {
      if (p.manual) return;
      const at = new Date(p.at);
      const text = String(p.text || '').trim();
      if (Number.isNaN(at.getTime())) errors.push(`posts[${i}]: "at" is not a valid date`);
      else if (at < new Date(Date.now() - 5 * 60000)) errors.push(`posts[${i}]: "at" is in the past`);
      else if (!text || text.length > 3000) errors.push(`posts[${i}]: text must be 1 to 3000 characters`);
      else rows.push({ body: text, scheduled_at: at.toISOString() });
    });
    if (errors.length) return res.status(400).json({ queued: 0, errors });

    const queued = rows.length ? await rpc('li_queue_add', { p_posts: rows }) : [];
    return res.status(200).json({ queued: queued.length, posts: queued });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  res.status(405).send('Method not allowed');
}
