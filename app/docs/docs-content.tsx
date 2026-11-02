import Link from "next/link";
import { DocsCode } from "@/components/docs-code";
import { DocsShell } from "./docs-shell";
import styles from "./docs.module.css";

export const docPages = [
  { slug: "", title: "Get started", description: "Scan your app, review its capabilities, and run a local MCP server.", searchText: "requirements Node.js TypeScript Next.js App Router dry-run scan install global hive npm run hive:mcp generated server sync keep in sync deploy host Vercel Claude ChatGPT connector" },
  { slug: "configuration", title: "Configuration", description: "Point the generated server at your application, control its tools, and connect an MCP client.", searchText: "environment .env HIVE_APP_BASE_URL HIVE_MCP_PORT HIVE_HTTP_TIMEOUT_MS application auth bearer token cookie HIVE_FORWARD_AUTH HIVE_MCP_TOKEN permissions policy.json mode read-only off allow deny tools enable disable action log actions.jsonl HIVE_LOG HIVE_LOG_ARGS remote access tunnel HIVE_ALLOWED_HOSTS HIVE_ALLOWED_ORIGINS doctor network Streamable HTTP endpoint deploy host Vercel Claude ChatGPT custom connector secret link rotate-key app-url" },
  { slug: "vercel", title: "Deploy on Vercel", description: "Host the generated MCP server on your own Vercel account and use it from Claude or ChatGPT.", searchText: "vercel deploy host hosting hobby plan app-url live app checks secret link rotate-key project claude chatgpt custom connector no sign-in no authentication redeploy sync runtime logs api key cookie limits oauth" },
  { slug: "commands", title: "CLI reference", description: "The commands you need to inspect, generate, sync, control, run, and check.", searchText: "scan dry-run install read-only json select no-script generate sync check accept-changed tools enable disable mode logs errors since follow inspect dev stdio doctor network deploy app-url rotate-key project re-scan drift breaking safe change CI current scope" },
] as const;

type PageSlug = (typeof docPages)[number]["slug"];

function Rows({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return <div className={styles.commandList}>{rows.map(([name, purpose]) => <div className={styles.commandItem} key={name}><code>{name}</code><span>{purpose}</span></div>)}</div>;
}

function GetStarted() {
  return <>
    <section className={styles.section} id="requirements"><h2>Before you start</h2><p>Use Node.js 22.12 or newer. HIVE CLI currently scans an existing <strong>TypeScript Next.js App Router</strong> project. Run commands from that project&apos;s root.</p></section>
    <section className={styles.section} id="preview"><h2>Preview the scan</h2><p>See discovered capabilities without writing files.</p><DocsCode>{"npx @usehive/cli scan --dry-run"}</DocsCode></section>
    <section className={styles.section} id="install"><h2>Generate and install</h2><p>Run the interactive scan. Review the methods, routes, risk labels, and permission evidence before selecting tools. Read operations start selected; write and destructive operations start unselected.</p><DocsCode>{"npx @usehive/cli scan --install"}</DocsCode><p>The official package is <a href="https://www.npmjs.com/package/@usehive/cli" target="_blank" rel="noopener noreferrer">@usehive/cli on npm</a>. HIVE generates the selected MCP tools inside <code>.hive/</code> and installs the generated server&apos;s dependencies. You can also install the CLI globally with <code>npm install -g @usehive/cli</code> and run <code>hive scan</code>.</p></section>
    <section className={styles.section} id="run"><h2>Run it locally</h2><p>Start your application normally. Copy the generated environment template and set <code>HIVE_APP_BASE_URL</code> to your running app&apos;s origin. Add an existing app credential only if its API needs one.</p><DocsCode>{"cp .hive/mcp/.env.example .hive/mcp/.env\nnpm run hive:mcp"}</DocsCode><p>The Streamable HTTP endpoint is <code>http://127.0.0.1:3333/mcp</code>. If your project already had a <code>hive:mcp</code> script, HIVE leaves it unchanged; use <code>npx @usehive/cli dev</code> instead.</p></section>
    <section className={styles.section} id="sync"><h2>Keep it in sync</h2><p>When your app changes, run <code>sync</code>. Unchanged approved tools stay approved, changed tools ask for re-approval, and new operations are offered for review, never approved automatically.</p><DocsCode>{"npx @usehive/cli sync"}</DocsCode><p>See the <Link href="/docs/commands#rescan">CLI reference</Link> for the exact rules and for checking drift in CI.</p></section>
    <section className={styles.section} id="host"><h2>Use it from Claude or ChatGPT</h2><p>Chat apps connect to MCP servers over the internet, so a server on <code>127.0.0.1</code> isn&apos;t enough for them. Once your app is deployed, host the generated server on your own Vercel account and paste the link it prints into the chat app.</p><DocsCode>{"npx @usehive/cli deploy --app-url https://myapp.com"}</DocsCode><p>See <Link href="/docs/vercel">Deploy on Vercel</Link> for what it checks and how to connect Claude or ChatGPT.</p></section>
  </>;
}

const deploySteps = [
  ["1. Checks your live app", "Your app must already be deployed, because the hosted server calls its API over the internet. HIVE refuses localhost and private addresses, and flags an offline app, routes missing from the live version, and API keys the app rejects. Write routes are only probed with OPTIONS, never called."],
  ["2. Deploys", "Builds a Vercel Function from .hive/mcp through the Vercel CLI; vercel login opens your browser the first time. The project is named <app>-mcp, and --project overrides it."],
  ["3. Verifies", "Calls the live endpoint the way a chat app would (initialize, then tools/list) before printing the link."],
] as const;

const environment = [
  ["HIVE_APP_BASE_URL", "HTTP(S) origin of your application. Default http://localhost:3000."],
  ["HIVE_MCP_PORT", "Loopback port for the MCP server. Default 3333."],
  ["HIVE_APP_BEARER_TOKEN", "Existing bearer credential for your app's APIs."],
  ["HIVE_APP_COOKIE", "Existing session cookie for your app's APIs."],
  ["HIVE_FORWARD_AUTH", "Set to true to forward incoming Authorization or Cookie headers to the app."],
  ["HIVE_MCP_TOKEN", "Optional bearer credential protecting the MCP endpoint. Never forwarded to the app."],
  ["HIVE_HTTP_TIMEOUT_MS", "Timeout for calls to your app, 1–120000 ms. Default 15000."],
  ["HIVE_ALLOWED_HOSTS", "Extra accepted Host values, such as a tunnel hostname. Requires a 24+ character HIVE_MCP_TOKEN."],
  ["HIVE_ALLOWED_ORIGINS", "Extra accepted browser Origins (exact match)."],
  ["HIVE_LOG", "Set to off to disable the action log."],
  ["HIVE_LOG_ARGS", "Set to off to log calls without their arguments."],
] as const;

function Configuration() {
  return <>
    <section className={styles.section} id="environment"><h2>Environment</h2><p>Set values in <code>.hive/mcp/.env</code>, not in your application&apos;s public environment. The generated <code>.env.example</code> is the starting point.</p><DocsCode label=".hive/mcp/.env">{"HIVE_APP_BASE_URL=http://localhost:3000\nHIVE_MCP_PORT=3333"}</DocsCode><p><code>HIVE_APP_BASE_URL</code> points to the app whose existing APIs the tools call. The MCP server listens on loopback at port <code>3333</code> by default.</p><Rows rows={environment} /></section>
    <section className={styles.section} id="authentication"><h2>Application auth</h2><p>If your app&apos;s APIs require authentication, configure an existing bearer token with <code>HIVE_APP_BEARER_TOKEN</code> or an existing cookie with <code>HIVE_APP_COOKIE</code>. Set <code>HIVE_FORWARD_AUTH=true</code> only when you intend to forward incoming Authorization or Cookie headers to the app. <code>HIVE_MCP_TOKEN</code> optionally protects the MCP endpoint and is never forwarded to the app.</p><p>Keep credential values out of source control and shared logs.</p></section>
    <section className={styles.section} id="connect"><h2>Connect a client</h2><p>Run your app and the generated server, then configure a local MCP client with Streamable HTTP at:</p><DocsCode label="MCP endpoint">{"http://127.0.0.1:3333/mcp"}</DocsCode><p>Only capabilities approved during review appear as tools. To use them from Claude or ChatGPT, host the server with <code>deploy</code> below.</p></section>
    <section className={styles.section} id="deploy"><h2>Host on Vercel</h2><p>To use the server from Claude or ChatGPT, host it on your own Vercel account with <code>deploy</code>. Everything about hosting, from the checks it runs to connecting each chat app, is on <Link href="/docs/vercel">Deploy on Vercel</Link>.</p><DocsCode>{"npx @usehive/cli deploy --app-url https://myapp.com"}</DocsCode></section>
    <section className={styles.section} id="permissions"><h2>Permissions</h2><p><code>.hive/policy.json</code> controls which tools the server offers. It holds a server mode (<code>all</code>, <code>read-only</code>, or <code>off</code>) and per-tool allow and deny entries. Regeneration never touches it, so commit it with your app.</p><DocsCode>{"npx @usehive/cli tools\nnpx @usehive/cli tools disable create_contact\nnpx @usehive/cli tools mode read-only"}</DocsCode><p>The HTTP server re-reads the policy on every request, so changes apply without a restart: disabled tools disappear from the tool list and calls to them are refused. Long-running stdio clients keep their tool list until restarted, but are still refused at call time. If the policy file cannot be parsed, every tool is disabled until you fix it.</p></section>
    <section className={styles.section} id="logs"><h2>Action log</h2><p>Every tool call the server handles is appended to <code>.hive/logs/actions.jsonl</code>, which is git-ignored and rotated at 10 MB. Each entry records the time, tool, risk, outcome (<code>ok</code>, <code>app_error</code>, <code>failed</code>, or <code>denied</code>), your app&apos;s HTTP status, duration, transport, and User-Agent.</p><DocsCode>{"npx @usehive/cli logs --errors --since 2h"}</DocsCode><p>Arguments are logged with values under secret-looking keys, such as token, password, cookie, or API key, replaced by <code>[redacted]</code>, and long strings truncated. Set <code>HIVE_LOG_ARGS=off</code> to log calls without arguments, or <code>HIVE_LOG=off</code> to turn the log off.</p></section>
    <section className={styles.section} id="remote"><h2>Remote access</h2><p>The local server always binds to <code>127.0.0.1</code>. For private testing without deploying, you can reach it through a tunnel instead. To do that, set the tunnel hostname and a random token of at least 24 characters. The server refuses to start with a host and no such token.</p><DocsCode label=".hive/mcp/.env">{"HIVE_ALLOWED_HOSTS=your-tunnel.example.com\nHIVE_MCP_TOKEN=<output of: openssl rand -hex 24>"}</DocsCode><p>Clients must send <code>Authorization: Bearer &lt;token&gt;</code>. This is one shared token for private testing, not per-user OAuth.</p></section>
    <section className={styles.section} id="check"><h2>Check the setup</h2><DocsCode>{"npx @usehive/cli doctor\nnpx @usehive/cli doctor --network"}</DocsCode><p><code>doctor</code> checks the local project, generated files, dependencies, and manifest consistency. Add <code>--network</code> to also check that your app and the MCP server answer. It does not verify every application credential or API response.</p></section>
  </>;
}

const vercelCommands = [
  ["deploy --app-url <url>", "First deploy. Checks your live app, deploys, verifies, and prints the link."],
  ["deploy", "Redeploy with the same link, after changing tools, the policy, or running sync."],
  ["deploy --rotate-key", "Redeploy with a new secret link. The old link stops working."],
  ["deploy --project <name>", "Use a Vercel project name other than <app>-mcp."],
] as const;

const vercelLimits = [
  ["Hosting", "Vercel only, on your own account. Other hosting providers aren't supported yet."],
  ["Access", "One shared secret link per deployment. Per-user OAuth isn't supported yet."],
  ["Plan", "The free Hobby plan works for personal, non-commercial use. Commercial use needs Vercel Pro."],
  ["Logs", "Agent calls appear in the Vercel project's runtime logs, not .hive/logs."],
] as const;

function Vercel() {
  return <>
    <section className={styles.section} id="overview"><h2>How it works</h2><p>Chat apps like Claude and ChatGPT reach MCP servers over the internet, so a server on <code>127.0.0.1</code> isn&apos;t enough for them. <code>deploy</code> hosts the generated server as a Vercel Function on <strong>your own</strong> Vercel account and prints a private link to paste into the chat app. No HIVE account is needed.</p></section>
    <section className={styles.section} id="before"><h2>Before you deploy</h2><p>Generate the server first with <code>scan --install</code>, and deploy your app itself, because the hosted server calls your live app&apos;s API. If the API needs a credential, set <code>HIVE_APP_BEARER_TOKEN</code> (preferred) or <code>HIVE_APP_COOKIE</code> in <code>.hive/mcp/.env</code>. Cookies expire and break the live server, so use an API key when you can.</p></section>
    <section className={styles.section} id="deploy"><h2>Deploy</h2><DocsCode>{"npx @usehive/cli deploy --app-url https://myapp.com"}</DocsCode><p>The first time, <code>vercel login</code> opens your browser. HIVE then runs three steps:</p><Rows rows={deploySteps} /></section>
    <section className={styles.section} id="link"><h2>Your secret link</h2><p>The link looks like <code>{"https://<app>-mcp.vercel.app/mcp/<secret>"}</code>. Anyone with it can use the approved tools, so keep it private. If it leaks, run <code>deploy --rotate-key</code>: you get a new link and the old one stops working.</p></section>
    <section className={styles.section} id="claude"><h2>Connect Claude</h2><p>Add the link as a custom connector and choose <strong>No sign-in</strong>. On Team and Enterprise plans, an Owner adds it under Organization settings → Connectors.</p></section>
    <section className={styles.section} id="chatgpt"><h2>Connect ChatGPT</h2><p>Add a custom MCP server with the link and choose <strong>No authentication</strong>.</p></section>
    <section className={styles.section} id="update"><h2>Keep it up to date</h2><p>The deployment uses a snapshot of <code>.hive/mcp/.env</code> and <code>.hive/policy.json</code>. Run <code>deploy</code> again after changing tools, the policy, or running <code>sync</code>. The link stays the same.</p><Rows rows={vercelCommands} /></section>
    <section className={styles.section} id="limits"><h2>Limits</h2><Rows rows={vercelLimits} /></section>
  </>;
}

const commands = [
  ["scan --dry-run", "Preview discovery without writing files."],
  ["scan --install", "Review, generate approved tools, and install generated dependencies."],
  ["scan --read-only", "Approve only supported read operations explicitly."],
  ["scan --json", "Output machine-readable analysis without writing files."],
  ["scan --select <names>", "Select named capabilities from a previous scan for scripts or CI."],
  ["scan --no-script", "Generate without changing your app's package.json."],
  ["generate", "Re-scan, review everything, and regenerate selected tools."],
  ["sync", "Re-scan and bring the generated server up to date, keeping unchanged approvals."],
  ["sync --check", "Report drift and exit 1 if the server is out of date. Writes nothing; for CI."],
  ["sync --accept-changed", "Re-approve changed tools without prompting."],
  ["tools", "List generated tools with their risk and enabled status."],
  ["tools disable <name>", "Hide and refuse a tool without restarting. enable <name> reverses it."],
  ["tools mode <mode>", "Set the server mode: all, read-only, or off."],
  ["logs", "Show recent agent tool calls. Filter with --tool, --errors, --since 2h; follow with -f."],
  ["deploy --app-url <url>", "Host the server on your Vercel account and print a link for Claude or ChatGPT."],
  ["deploy --rotate-key", "Redeploy with a new secret link. The old link stops working."],
  ["deploy --project <name>", "Use a Vercel project name other than <app>-mcp."],
  ["inspect", "Show the generated manifest and candidates."],
  ["dev", "Run the generated local Streamable HTTP server."],
  ["dev --stdio", "Run the generated server with stdio transport."],
  ["doctor", "Check the local generated setup."],
  ["doctor --network", "Also check that your app and the MCP server answer."],
] as const;

const syncRules = [
  ["Unchanged tools", "Approved tools whose name, description, input schema, risk, and source file are unchanged stay approved."],
  ["Changed tools", "Need re-approval, interactively or with --accept-changed. Changed tools you don't re-approve are removed."],
  ["Removed routes", "Approved tools whose route is gone are removed."],
  ["New operations", "Are listed and offered for review, never approved automatically."],
] as const;

function Commands() {
  return <>
    <section className={styles.section} id="usage"><h2>Run a command</h2><p>Use <code>npx @usehive/cli</code> from the application root, followed by one of the commands below, or <code>hive</code> if you installed the CLI globally. Every command also accepts <code>-C /path/to/app</code> to target another application root.</p><DocsCode>{"npx @usehive/cli inspect"}</DocsCode></section>
    <section className={styles.section} id="reference"><h2>Command reference</h2><Rows rows={commands} /><p>Without a terminal, generation requires an explicit <code>--select</code> or <code>--read-only</code>. There is no automatic &ldquo;expose everything&rdquo; mode.</p></section>
    <section className={styles.section} id="rescan"><h2>When your app changes</h2><p>Run <code>sync</code> to bring the generated server up to date without reviewing everything again. It compares the tools the server serves with a fresh scan:</p><Rows rows={syncRules} /><DocsCode>{"npx @usehive/cli sync"}</DocsCode><p>In CI or a pre-commit hook, <code>sync --check</code> writes nothing and exits 1 when the server is out of date or was generated by another HIVE version. Without a terminal and without <code>--accept-changed</code>, <code>sync</code> writes nothing and exits 1. To review every selection again, run <code>generate</code>.</p><p>For each changed tool, <code>sync</code> says whether it&apos;s a <strong>BREAKING</strong> change, meaning a call an agent made before can now be rejected or misread, or a <strong>safe change</strong>.</p><DocsCode label="sync output">{"~ create_todo safe change — POST /api/todos\n    ✓ body.dueDate: new optional field\n~ add_application BREAKING — POST /api/applications\n    ✗ body.company: removed: agents that still send it are rejected\n    ✗ body.organization: new required field: older calls are rejected"}</DocsCode><p>Breaking: removed fields, new required fields, optional fields becoming required, type changes, removed enum values, tighter limits or formats, values no longer nullable, renames, and raised risk. Safe: new optional fields, added enum values, looser limits, required fields becoming optional, and description updates. If you host the server, run <code>deploy</code> again after syncing.</p></section>
    <section className={styles.section} id="scope"><h2>Current scope</h2><p>The published CLI supports one TypeScript Next.js App Router application root at a time. It runs the generated MCP server on your machine, or hosts it on your own Vercel account with a shared secret link. Other frameworks, the Pages Router, GraphQL, other hosting providers, and per-user OAuth are not part of this release.</p></section>
  </>;
}

export function DocsPage({ slug }: { slug: PageSlug }) {
  return <DocsShell pages={docPages} slug={slug}>
    {slug === "" ? <GetStarted /> : slug === "configuration" ? <Configuration /> : slug === "vercel" ? <Vercel /> : <Commands />}
  </DocsShell>;
}
