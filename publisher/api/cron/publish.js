import { rpc } from '../../lib/db.js';
import { isAdmin } from '../../lib/auth.js';
import { publishPost } from '../../lib/linkedin.js';

// Called by Vercel cron (daily) and/or the GitHub Actions workflow (every 15 minutes).
// li_claim_due marks due posts as "publishing" in one statement, so two overlapping runs never post twice.
export default async function handler(req, res) {
  if (!isAdmin(req, { allowCron: true })) return res.status(401).send('Unauthorized');

  const [auth] = await rpc('li_get_auth');
  if (!auth) return res.status(200).json({ published: 0, note: 'LinkedIn not connected' });
  if (new Date(auth.expires_at) < new Date()) {
    return res.status(200).json({ published: 0, note: 'LinkedIn token expired, reconnect at /api/auth/start' });
  }

  const due = await rpc('li_claim_due');
  const results = [];
  for (const post of due) {
    try {
      const urn = await publishPost({ token: auth.access_token, personUrn: auth.person_urn, body: post.body });
      await rpc('li_mark', { p_id: post.id, p_status: 'posted', p_urn: urn, p_error: null });
      results.push({ id: post.id, ok: true, urn });
    } catch (e) {
      console.error(`post ${post.id} failed:`, e.message);
      await rpc('li_mark', { p_id: post.id, p_status: 'failed', p_urn: null, p_error: e.message });
      results.push({ id: post.id, ok: false, error: e.message });
    }
  }
  res.status(200).json({ published: results.filter((r) => r.ok).length, results });
}
