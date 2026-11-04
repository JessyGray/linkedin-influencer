import { makeState } from '../../lib/state.js';
import { isAdmin } from '../../lib/auth.js';

export default function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).send('Unauthorized');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: `${process.env.APP_URL}/api/auth/callback`,
    state: makeState(),
    scope: 'openid profile w_member_social',
  });
  res.redirect(302, `https://www.linkedin.com/oauth/v2/authorization?${params}`);
}
