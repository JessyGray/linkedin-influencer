---
name: linkedin-influencer
description: Grow a person's LinkedIn end to end. Audits their profile, studies competitors in their field, rewrites the profile, plans posts with the right days and times, and queues them for automatic publishing. Use when someone wants to grow on LinkedIn, fix their profile, get a content plan, or post on autopilot.
---

# LinkedIn Influencer

Made by Jessy Gray. Five steps, one folder of notes, no invented facts.

## Ground rules

1. **Truth first.** Every claim in a profile or post must trace back to `facts.md`. If a fact is missing, write `[ASK: question]` and skip that line. Never invent jobs, clients, numbers, dates, titles or results.
2. **No scraping.** Do not log in to LinkedIn to bulk-read other people's profiles. Use what the person gives you (profile PDF, pasted text, screenshots) and public web search.
3. **No fake engagement.** Do not automate likes, comments, connection requests or DMs. Only posts are published automatically.
4. **Spend few tokens.**
   - Load only the reference file for the current step.
   - Before researching, check the workspace. If the step's output file exists and is under 30 days old, reuse it.
   - Write long results to files. In chat, reply with at most 10 lines: what changed, what is next, open `[ASK]` items.
   - Ask all missing questions in one message, never one by one.

## Workspace

Keep everything in a `linkedin/` folder (create it on first run). Each step reads the files before it and writes one file.

| File | Written by | What it holds |
| --- | --- | --- |
| `facts.md` | setup | Verified facts only. The single source of truth. |
| `audit.md` | audit | Score out of 100 and the fixes, ranked. |
| `market.md` | compete | Competitor patterns and gaps to own. |
| `profile.md` | optimize | Paste-ready headline, About, experience, skills, banner text. |
| `schedule.json` | plan | Posts with exact publish times. |
| `log.md` | publish, review | What went out, results, what to change. |

Templates for `facts.md` and `schedule.json` are in `templates/`.

## Steps

Run the step the person asks for. If they say "do everything", run them in order and stop only for `[ASK]` items you cannot work around.

| # | Command | Read first | Output |
| --- | --- | --- | --- |
| 0 | `setup` | `templates/facts.md` | `facts.md` |
| 1 | `audit` | `references/01-audit.md` | `audit.md` |
| 2 | `compete` | `references/02-competitors.md` | `market.md` |
| 3 | `optimize` | `references/03-optimize.md` | `profile.md` |
| 4 | `plan` | `references/04-content.md`, `references/05-schedule.md` | `schedule.json` |
| 5 | `publish` | `references/06-publish.md` | queued posts, `log.md` |
| 6 | `review` | `references/05-schedule.md` (section "Learn") | updated `log.md`, next `plan` |

### 0 · setup
Get the person's profile: a LinkedIn PDF export (Profile → More → Save to PDF), pasted text, or screenshots. Also ask, in one message: target role or audience, country and time zone of the audience, languages to post in, and topics they never want to post about. Fill `facts.md`. Mark anything you are unsure of as `(unverified)` and ask about it.

### 1 · audit
Score the profile with the rubric. List the 5 fixes that gain the most points.

### 2 · compete
Find 5 people in the same field and market. Record what works for them and the gaps the person can own. Use at most 8 web searches.

### 3 · optimize
Write paste-ready copy for every section that lost points. LinkedIn's API cannot edit profiles, so the person pastes it in. If a browser tool is connected and the person is logged in to their own account, offer to apply it for them, one section at a time.

### 4 · plan
Plan 4 weeks of posts from content pillars that match `facts.md` and the gaps in `market.md`. Pick days and times for the audience's time zone. Run the self-check from `04-content.md` on every post. Write `schedule.json`.

### 5 · publish
Send `schedule.json` to the publisher. No approval step: posts that pass the self-check are queued as they are. If no publisher is set up, give the person the posts with dates so they can use LinkedIn's built-in scheduler.

### 6 · review
Every 4 weeks, ask for the post analytics (a screenshot or numbers), update `log.md`, keep what worked and plan the next 4 weeks.
