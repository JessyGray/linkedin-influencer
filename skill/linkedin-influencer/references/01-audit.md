# 01 · Audit

Score the profile out of 100. Be strict. A section that is missing scores 0.

| Section | Pts | Full marks when |
| --- | --- | --- |
| Photo | 5 | Face fills about 60% of the frame, plain background, recent, looks like the person on a video call. |
| Banner | 5 | Says what they do or for whom in under 8 words. Not a stock image or the default. |
| Headline | 15 | Role and who they help or what they build, plus one proof point. Keywords a recruiter or client would search. Not "Student" or "Looking for opportunities" alone. |
| About | 15 | The first 2 lines (about 200 characters, before "see more") make someone want to keep reading. Then: what they do, proof, how to reach them. First person, plain words. |
| Experience | 15 | Every current role has 2 to 4 bullets that start with a verb and say what changed. Dates are consistent with the rest of the profile. |
| Featured | 10 | 1 to 3 items that prove the headline: a project, a post that did well, a portfolio link. |
| Skills | 10 | The top 5 match the target role. No more than about 30 in total. |
| Recommendations | 5 | At least 2 from people who saw the work up close. |
| Basics | 5 | Custom URL, location, contact info, Open to Work set the way the person wants (recruiters-only or public). |
| Activity | 15 | Posted at least 4 times in the last 30 days and comments on others' posts. |

## Output: `audit.md`

```
# Audit · <name> · <date>
Score: <n>/100

| Section | Score | Why |
...

## Top 5 fixes (most points first)
1. <fix> (+<pts>)
...

## Red flags
- Claims that do not match facts.md, dates that conflict, buzzwords with no proof.
```

Red flags matter most. An inflated or inconsistent profile costs more trust than an empty one.
