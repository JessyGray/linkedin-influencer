# Custom GPT setup

Takes about 5 minutes. Needs ChatGPT Plus or higher to create a GPT.

1. Open [chatgpt.com/gpts/editor](https://chatgpt.com/gpts/editor) and choose **Configure**.
2. **Name:** LinkedIn Influencer. **Description:** Audits your LinkedIn, studies your competitors, rewrites your profile and posts for you on schedule.
3. **Instructions:** paste everything from [`instructions.md`](instructions.md).
4. **Knowledge:** upload these 7 files:
   - `skill/linkedin-influencer/references/01-audit.md` to `06-publish.md`
   - `skill/linkedin-influencer/templates/facts.md`
5. **Capabilities:** turn on Web Search. Code Interpreter is optional.
6. **Conversation starters:**
   - Audit my LinkedIn profile (I'll upload the PDF)
   - Who are the top people in my field?
   - Plan my next 4 weeks of posts
   - Do everything
7. **Actions** (optional, for automatic posting): deploy the [publisher](../publisher) first, then:
   - **Create new action** → paste [`openapi.yaml`](openapi.yaml) and replace `YOUR-PUBLISHER` with your Vercel URL.
   - **Authentication** → API Key → Auth type **Bearer** → paste your `ADMIN_KEY`.
   - **Privacy policy** → `https://YOUR-PUBLISHER.vercel.app/privacy.html`

Without the action the GPT still does everything except posting. It hands you the posts with dates for LinkedIn's built-in scheduler.

Other assistants (Gemini Gems, Claude Projects, Copilot): paste `instructions.md` as the system prompt and upload the same files.
