# 05 · Schedule

## Cadence

- Default: 3 posts a week. Never more than 1 a day, at least 24 hours apart.
- Beginners: 2 a week is fine. Steady beats frequent.
- Plan 4 weeks at a time.

## Days and times (starting point)

Times are in the **audience's** time zone, not the writer's.

| Audience work week | Best days | Best windows |
| --- | --- | --- |
| Mon to Fri (US, EU, most of the world) | Tue, Wed, Thu | 07:30 to 09:30, 12:00 to 13:00 |
| Sun to Thu (Israel) | Sun, Tue, Wed | 07:30 to 09:30 |
| Mon to Fri, Friday prayer (parts of the Gulf) | Mon, Tue, Wed | 08:00 to 10:00 |

These are common patterns from industry studies, not rules. After 4 weeks the person's own numbers win (see "Learn").

Avoid: public holidays in the audience's country, weekends, and late evening.

Pick a slightly odd minute (07:40, 08:10) so posts do not land at the same moment as scheduled posts from everyone else.

## `schedule.json`

```json
{
  "timezone": "Asia/Jerusalem",
  "posts": [
    {
      "at": "2026-11-10T07:40:00+02:00",
      "pillar": "what I built",
      "format": "build log",
      "text": "Full post text…",
      "manual": false
    }
  ]
}
```

- `at`: ISO 8601 with the offset for that date (watch daylight saving changes).
- `manual: true`: the publisher skips it (images, polls, documents). The person posts these by hand.

## Learn (step 6, every 4 weeks)

Ask for impressions, reactions, comments and new followers per post. Then:

1. Rank posts by comments, then reactions per 1,000 impressions.
2. Note which pillar, format, day and hour the top 3 share.
3. Move one slot toward the best hour. Drop the weakest pillar or format if it was last twice.
4. Write the changes in `log.md` and plan the next 4 weeks.

Change one or two things at a time so you can tell what worked.
