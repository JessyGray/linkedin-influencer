import { createHmac, timingSafeEqual } from 'node:crypto';

// OAuth state = timestamp.signature, signed with ADMIN_KEY, valid for 10 minutes.
export function makeState() {
  const ts = Date.now().toString();
  return `${ts}.${sign(ts)}`;
}

export function checkState(state) {
  const [ts, sig] = String(state || '').split('.');
  if (!ts || !sig || Date.now() - Number(ts) > 10 * 60 * 1000) return false;
  const expected = Buffer.from(sign(ts));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

function sign(value) {
  return createHmac('sha256', process.env.ADMIN_KEY).update(value).digest('hex');
}
