# Solar AI Frontend & Backend Structure

This note maps the current module layout so you can quickly find the pieces that serve the Solar Permit / Solar Sales AI Agent product (AHJ finder, plan review, lead generation bot, quoting assistant) and understand where logged-in user flows live.

---

## Frontend (`solar_ai_frontend`)

- `app/`
  - `page.tsx` is the marketing landing page that links to `/auth/login` and `/auth/signup`, highlights the AI proposal value props, and lists the pricing CTA.
  - `auth/` holds the user authentication flows (`login`, `signup`, `forgot-password`, `reset-password`, `onboarding`). Each route is under `app/auth/<flow>/page.tsx` and relies on NextAuth/token middleware.
  - `dashboard/`
    - `layout.tsx` wraps screens that require an authenticated user.
    - `page.tsx` shows the logged-in overview (lead stats, win rate, proposal ready state).
    - `leads/` contains `page.tsx` (lead table/search) and `new/page.tsx` (AI lead capture form). Logged-in users create leads from here and view details via `[id]/page.tsx`.
  - `api/` currently mirrors direct calls to backend endpoints (`/leads`, `/chat`) via `axios` in the React components. New AI agents (AHJ finder, plan review, quoting) should register their frontend handlers in this folder or under `lib/`.
  - `components/` and `components/ui/` expose shared UI primitives (Buttons, Cards, Table, Inputs). They are re-used in all logged-in screens plus shared landing sections.
  - `lib/` contains helpers and data logic:
    - `api.ts` exposes the `API_URL` environment variable.
    - `supabase.ts` is the Supabase client used for any realtime/auth flows (currently unused, so you may remove it or wire it into auth later).
    - `utils.ts` includes shared helper functions.
    - `validators/` keeps Zod schemas for auth, business rules, and solar settings (good for AHJ/plan validation rules).
  - `middleware.ts` gates logged-in routes:
    - Public paths under `/`, `/auth/*`, `/pricing`, `/contact`, etc. bypass the token check.
    - All other paths (notably `/dashboard` and `/api/*`) require a NextAuth token.
    - `/backoffice` routes currently need an `isAdmin` flag and redirect unauthorized users.
  - Static assets live in `public/`, Tailwind config in `tailwind.config.ts`, and postcss configs define the styling stack.

- `package.json` installs React 19, Next.js 16, Radix, Supabase, and helpers like `axios`, `react-hook-form`, `zod`. These are the foundations for the logged-in dashboard UI and AI automation forms.

**Logged-in user flow summary:**
1. User authenticates via `app/auth/login` (NextAuth token handled by `middleware.ts`).
2. Authenticated sessions land on `/dashboard`, which calls `${API_URL}/leads/` to render current leads.
3. Within `/dashboard/leads`, admins can add new leads via the AI-assisted form (`api/lead` POST) and view proposals. Additional agent pages (AHJ finder, plan review, quoting assistant) should be added alongside `leads` or as nested routes under `dashboard/agents/` for consistency.

---

## Backend (`solar_ai_backend`)

- `app/main.py` wires FastAPI with CORS and mounts:
  - `/auth/*` from `app/auth/router.py` (signup/login with SQLAlchemy + JWT tokens).
  - `/health`, `/leads`, and `/chat` routers for monitoring, lead management, and basic AI chat.

- `app/auth/`
  - `models.py`, `schemas.py`, `router.py`, and `utils.py` contain the SQLAlchemy user model, Pydantic validation, and authentication helpers.
  - `dependencies.py` exposes reusable dependencies like JWT verification (not yet wired into other routers).

- `app/routers/`
  - `leads.py` is the logged-in user surface for lead CRUD, system size math, AI summary generation, and PDF proposal export. It uses Supabase from `app/database.py` and calls `app.ai` as well as `app.pdf_generator`.
  - `chat.py` acts as a placeholder for AI chat, reusing `generate_ai_summary` so we can reuse prompts for AHJ/plan review agents.
  - `health.py` offers a `/health` endpoint for uptime checks.

- `app/ai.py` contains system-size logic and the `generate_ai_summary` helper (currently missing `prompt` definition; add one specific to solar quoting). It also instantiates `openai.OpenAI` via `.env` variables.
- `app/database.py` holds the Supabase client used by routers for the logged-in user’s leads table (replaceable with your PostgreSQL connection from `db.py`).
- `app/db.py` and `app/models/` are ready if you need SQLAlchemy sessions beyond Supabase.
- `app/pdf_generator.py` (not yet opened but assumed to create proposal PDFs) should remain alongside agents for easy reference.
- `app/proposals/` stores generated PDF proposals (ensure this folder is version-controlled or added to `.gitignore`).
- `app/utils.py` defines shared helpers (e.g., `detect_utility_from_address`).

**Logged-in user Surface:**
- Authentication occurs via `/auth/signup` and `/auth/login`.
- Once logged in, the frontend calls `/leads` to create leads, generate AI summaries, and download proposals.
- You can add new routers (e.g., `/agents/ahj`, `/agents/plan-review`, `/agents/quotes`) next to `leads.py` and attach them to FastAPI to keep the structure modular.

---

## Recommendations
1. **Document the module map** (done in this file) so teammates can locate the logged-in dashboards and backend routers quickly.
2. **Consider nesting new agent modules** under `app/dashboard/agents/` (frontend) and `app/routers/agents/` (backend) to group AHJ finder, plan review, lead-gen bot, and quoting assistant logic.
3. **Add README sections** to both frontend and backend outlining where to find logged-in flows, API clients, and AI helpers; point to this structure doc for developers.
4. **Verify `app/ai.py` references** (e.g., `prompt` variable) and ensure Supabase credentials are securely managed via `.env`.
5. **Sync frontend middleware public paths** with backend routes so new agent APIs are not inadvertently blocked.

If you want me to implement a nested agents folder or expand the middleware to guard specific routes, let me know the preferred names/patterns and I can create the necessary directories/files.