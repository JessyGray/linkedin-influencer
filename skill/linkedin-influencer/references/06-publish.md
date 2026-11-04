# 06 · Publish

Posts go out without a manual approval step. The self-check in `04-content.md` is the gate. Use the first route that is available.

## Route A · Publisher API (recommended)

The person deployed the publisher from this repo and gave you `PUBLISHER_URL` and `PUBLISHER_KEY`.

Queue posts (send only items where `manual` is false):

```bash
curl -sS -X POST "$PUBLISHER_URL/api/queue" \
  -H "Authorization: Bearer $PUBLISHER_KEY" \
  -H "Content-Type: application/json" \
  --data @linkedin/schedule.json
```

Other calls:

| Call | Does |
| --- | --- |
| `GET /api/queue` | Lists upcoming and recent posts |
| `DELETE /api/queue?id=<id>` | Cancels a scheduled post |
| `GET /api/status` | Token expiry and queue counts |

If you have no shell but have a Supabase tool, insert rows straight into `li_posts (body, scheduled_at)`.

## Route B · LinkedIn's own scheduler

No publisher yet: give the person each post with its date and time, in order, and tell them to use the clock icon in LinkedIn's post editor. Suggest setting up Route A to remove this work.

## After queueing

Append to `log.md`:

```
## Queued <date>
| id | at | pillar | first line |
```

Then check `GET /api/status`. If the LinkedIn token expires in under 7 days, tell the person to reconnect at `$PUBLISHER_URL/api/auth/start?key=…`. LinkedIn tokens last 60 days.

## Never

- Publish a post that failed the self-check.
- Post more than once a day.
- Delete posts the person published themselves.
