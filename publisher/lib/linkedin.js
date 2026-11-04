// LinkedIn "little text format" reserves these characters in post commentary.
function escapeCommentary(text) {
  return text.replace(/[\\|{}@\[\]()<>#*_~]/g, (c) => `\\${c}`);
}

// Restore hashtags: an escaped "\#word" would show as plain text, so keep real hashtags.
function withHashtags(text) {
  return escapeCommentary(text).replace(/\\#(\w+)/g, '{hashtag|\\#|$1}');
}

// LinkedIn versions are YYYYMM and each lives about a year; use one from 3 months ago.
function apiVersion() {
  if (process.env.LINKEDIN_VERSION) return process.env.LINKEDIN_VERSION;
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() - 3);
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export async function publishPost({ token, personUrn, body }) {
  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'LinkedIn-Version': apiVersion(),
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: personUrn,
      commentary: withHashtags(body),
      visibility: 'PUBLIC',
      distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    }),
  });
  if (res.status !== 201) {
    throw new Error(`LinkedIn ${res.status}: ${(await res.text()).slice(0, 500)}`);
  }
  return res.headers.get('x-restli-id');
}
