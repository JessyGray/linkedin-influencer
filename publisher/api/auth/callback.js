import { checkState } from '../../lib/state.js';
import { rpc } from '../../lib/db.js';

export default async function handler(req, res) {
  const { code, state, error, error_description } = req.query;
  if (error) return res.status(400).send(`LinkedIn error: ${error_description || error}`);
  if (!checkState(state)) return res.status(400).send('Invalid or expired state. Start again.');

  try {
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.APP_URL}/api/auth/callback`,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
    });
    const token = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(JSON.stringify(token));

    const meRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const me = await meRes.json();
    if (!meRes.ok) throw new Error(JSON.stringify(me));

    const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();
    await rpc('li_save_auth', {
      p_token: token.access_token,
      p_person_urn: `urn:li:person:${me.sub}`,
      p_expires_at: expiresAt,
    });
    res.status(200).send(`Connected as ${me.name}. Token valid until ${expiresAt.slice(0, 10)}. You can close this tab.`);
  } catch (e) {
    console.error("LinkedIn connect failed:", e.message);
    res.status(500).send(`Connection failed: ${e.message}`);
  }
}
