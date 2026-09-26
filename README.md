# HIVE site setup

This is a Next.js site for Vercel. The landing page, blog layout, looping demo video, and admin preview work locally. Supabase is required for live posts and admin actions.

## Connect Supabase

1. Create a Supabase project and run `supabase/schema.sql` in its SQL editor.
2. Copy `.env.example` to `.env.local` and fill in the project URL, anon key, and service role key. Keep the service role key server-side only.
3. Set `ADMIN_PIN` to a six-digit code of your choice. Set `ADMIN_SESSION_SECRET` to a random string of at least 32 characters. Do not commit either value.
4. Run `npm install` and `npm run dev`. Open `/admin` and enter the code.

On Vercel, add the same variables in Project Settings → Environment Variables before deployment. The project uses Next.js build scripts, so Vercel can detect it automatically. Restrict access to `/admin` further with Vercel protection or rate limiting before a public launch; a six-digit PIN has limited entropy.

## Content and links to confirm

- LinkedIn and X are connected. Add the Discord invite URL in `components/site-chrome.tsx` when available.
- The original Arial/Helvetica typography is restored while the final font is undecided. The font picker is hidden.
- The hero copies the published command `npx @usehive/cli scan --install` and offers an agent prompt.

The uploaded background, logo, and demo video are in `public/`.

## Blog and motion

The blog reads published posts only. No connection or no posts means no cards. One pinned post spans the content width; remaining posts appear in a three-column grid, six at a time. Load more is shown only when an additional database record exists. Add a cover image URL in the admin editor. For existing databases, rerun the idempotent schema to add `cover_url`.

The demo pauses until it expands fully at the viewport center, holds there for about two viewport scrolls, and pauses again when leaving. Its sound button starts muted. Reduced-motion settings are respected. The footer wordmark follows scroll using GSAP.

The optional font experiments remain self-hosted, with licenses in `public/fonts/licenses/`. Typography references: [Vercel Geist](https://vercel.com/font) and [Google Fonts](https://fonts.google.com/).

The intro uses React Bits TextType for the mission tagline. The hero and footer use BlurText; narrative and journal text use ScrollReveal. CircularText surrounds the footer logo. The glowing pointer is a local SVG cursor, enabled for mouse/trackpad devices.

Copying the CLI command opens the beta email form with the 500k-token launch offer. The form writes to the same SheetDB/Google Sheet used by the `main` site, then mirrors the signup to Supabase for the V2 admin beta list when configured. Set `GOOGLE_SHEET_WEBHOOK_URL` in Vercel to the same value as `main` if its sheet destination changes. A failed sheet write reports an error instead of claiming success. Verify one real signup appears in the sheet before moving the production domain.

Replace `public/concept-build.jpg` and `public/concept-sync.jpg` with final card images. Current placeholders reuse the supplied demo still and sky image. The footer uses the sky with a dark gradient transition, and page overscroll is disabled.
