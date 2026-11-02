import { publicPinnedPost, publicPostPage } from "@/lib/posts";

// What the bee knows about HIVE. Keep this in step with the site and docs when they change.
export const KNOWLEDGE = `
ABOUT HIVE (usehive.tech)
- HIVE turns an existing app into an MCP server so AI agents (Claude, ChatGPT, Cursor) can operate it through tools instead of clicking the UI, and keeps that layer in sync as the app changes.
- Founder contact: pavan@usehive.tech.
- Pages: Home (/), Docs (/docs), Deploy on Vercel (/docs/vercel), CLI reference (/docs/commands), Configuration (/docs/configuration), Audit (/audit), Manifesto (/manifesto), Blog (/blog). npm: @usehive/cli.

HIVE CLI (npm @usehive/cli, current version 0.2.0)
- Supports one TypeScript Next.js App Router app at a time. Needs Node.js 22.12+. Run from the app's root.
- Quick start: npx @usehive/cli scan --dry-run (preview), npx @usehive/cli scan --install (review and generate). Read tools start selected; write and destructive tools start unselected. Generated server lives in .hive/.
- Run locally: cp .hive/mcp/.env.example .hive/mcp/.env, set HIVE_APP_BASE_URL, then npm run hive:mcp. Endpoint http://127.0.0.1:3333/mcp. Or npx @usehive/cli dev (dev --stdio for stdio).
- sync: re-scans after app changes. Unchanged approved tools stay approved, changed tools need re-approval, removed routes are dropped, new operations are offered but never auto-approved. Each change is labelled BREAKING or safe change. sync --check exits 1 on drift (for CI); sync --accept-changed re-approves changed tools.
- tools: list tools; tools disable/enable <name>; tools mode all|read-only|off. Policy in .hive/policy.json, applied live without restart.
- logs: every tool call goes to .hive/logs/actions.jsonl (secrets redacted). Filters: --tool, --errors, --since 2h, -f to follow. HIVE_LOG=off or HIVE_LOG_ARGS=off.
- Env vars: HIVE_APP_BASE_URL, HIVE_MCP_PORT (3333), HIVE_HTTP_TIMEOUT_MS, HIVE_APP_BEARER_TOKEN, HIVE_APP_COOKIE, HIVE_FORWARD_AUTH, HIVE_MCP_TOKEN, HIVE_ALLOWED_HOSTS, HIVE_ALLOWED_ORIGINS.
- doctor checks the setup; doctor --network also checks the app and server answer. inspect shows the manifest.
- Remote testing: via a tunnel with HIVE_ALLOWED_HOSTS and a 24+ character HIVE_MCP_TOKEN.
- Deploy on Vercel: npx @usehive/cli deploy --app-url https://myapp.com hosts the server on the user's own Vercel account (no HIVE account). It checks the live app, deploys, verifies, then prints a secret link https://<app>-mcp.vercel.app/mcp/<secret>. Claude: add as custom connector, No sign-in. ChatGPT: custom MCP server, No authentication. deploy --rotate-key makes a new link; deploy --project <name> renames the project. Redeploy after sync or tool changes. Free Hobby plan is fine for personal use.
- Not supported yet: other frameworks, Pages Router, GraphQL, hosts other than Vercel, per-user OAuth.

AGENT RELIABILITY AUDIT (/audit)
- HIVE tests a team's AI agent with 50+ real prompts and edge cases, repairs what it can (prompt, tool-description and guardrail fixes, only with permission), and delivers a report of every prompt, failure and fix.
- Failure types tested: prompt injection, wrong or unsafe tool calls, made-up answers, forgetting earlier context, messy input (typos, mixed languages, emoji), and drift after model or API changes.
- Needs only scoped test access: a staging link, test account, API endpoint or MCP config. Never production admin rights. Happy to sign an NDA. Prompts and outputs are not reused and test material is deleted afterwards. The team owns the report.
- Price: ₹4,999 per audit, flat; scope and delivery date agreed before starting. Book a 15-minute call: https://calendly.com/use-hive/15-min.

MANIFESTO (/manifesto)
- Thesis: agents are being taught to pretend to be human (vision, clicking), but the real bottleneck is that software was never built for them. Like the ATM gave machines a native interface to the bank, apps need an interface made for agents: intent in, result out.
- Agents today are where software was before APIs; once any app can expose a dependable agent layer, builders will stack on it the way they did on Stripe, Twilio and Plaid.
- Plan: 1) give every app an agent-usable layer without hand-rolling MCP servers; 2) make it production-grade so human-facing changes never break agents; 3) build what the agent economy needs: agent payments, shopping, paywalls, structured and controlled AI.
`.trim();

let blogCache: { text: string; at: number } | null = null;

/** Titles and summaries of published blog posts, refreshed every 10 minutes. */
export async function blogKnowledge(): Promise<string> {
  if (blogCache && Date.now() - blogCache.at < 10 * 60 * 1000) return blogCache.text;
  try {
    const [pinned, page] = await Promise.all([publicPinnedPost(), publicPostPage(0, 20)]);
    const posts = [...(pinned ? [pinned] : []), ...page.posts];
    const text = posts.length
      ? "BLOG (/blog)\n" + posts.map(post => `- "${post.title}" (/blog/${post.slug}, ${post.reading_minutes} min): ${post.summary}`).join("\n")
      : "BLOG (/blog): no published posts yet.";
    blogCache = { text, at: Date.now() };
    return text;
  } catch (error) {
    console.error("Bee: could not load blog posts:", error);
    return "";
  }
}
