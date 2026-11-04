import { rpc } from '../lib/db.js';
import { isAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).send('Unauthorized');
  const status = await rpc('li_status');
  const expires = status?.expires_at ? new Date(status.expires_at) : null;
  const daysLeft = expires ? Math.floor((expires - Date.now()) / 86400000) : null;
  res.status(200).json({ ...status, token_days_left: daysLeft, reconnect_soon: daysLeft !== null && daysLeft < 7 });
}
