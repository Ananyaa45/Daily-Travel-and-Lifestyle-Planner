# Saanjh — Daily Travel & Lifestyle Planner

Mobile-first lifestyle planner (WiSE @ TI Hackathon). Stack per SRS: **Next.js 14**, **Clerk** (auth), **Supabase** (data).

## Your scope (profile + preferences)

| Step | Route | SRS |
|------|--------|-----|
| Profile (photo + salutation name) | `/onboarding/profile` | FR-04, UC-01 |
| Preferences (dietary, lifestyle, interests, activities) | `/onboarding/preferences` | FR-09, FR-10 |
| Calendar / Wardrobe | other teammates | FR-11+ |

Flow per user-flow doc: **Profile Setup → Preferences → Calendar → Wardrobe → Home**.

---

## Local setup

Install dependencies and configure Clerk + Supabase before running the app:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

- **http://localhost:3000/sign-up**
- **http://localhost:3000/sign-in**

After signing in, complete onboarding via `/onboarding/profile` and `/onboarding/preferences`.

---

## Full integration (later)

1. **Clerk** — keys in `.env.local`, Google + Email OTP  
2. **Supabase** — run `supabase/migrations/001_users_onboarding.sql`  
3. Sign in → real API routes persist to `users` table  

## API (production path)

| Method | Path |
|--------|------|
| `GET/PATCH` | `/api/onboarding/profile` |
| `POST` | `/api/onboarding/profile-photo` |
| `GET/PATCH` | `/api/onboarding/preferences` |
| `GET` | `/api/onboarding/status` |

Both onboarding steps support `"skip": true` (FR-08).

## Design

Ethereal Cinematic handbook: aurora, glass cards, Playfair + Montserrat, coral primary, pill chips.
