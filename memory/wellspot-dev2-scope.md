---
name: wellspot-dev2-scope
description: WellSpot hackathon — the user is Backend Dev 2 (AI & Geo), owned files and integration boundaries
metadata:
  type: project
---

WellSpot is a hackathon wellness-marketplace (Laravel 13 + Inertia/React, SQLite dev). The user is **Backend Dev 2 — AI & Geo Intelligence**. Their owned scope (all DONE as of 2026-06-06): `config/ai.php`, AI agents in `app/Ai/`, `WellnessQuizController`, `SearchController`, `WellnessTipController`, `app/Services/ProviderGeoSearch.php`, and `routes/api.php` (quiz/submit, smart-search, providers/nearby, wellness-tip, providers/{provider}/generate-description). Also registered `api:` in `bootstrap/app.php`.

**Integration boundary (user's choice):** "reference-only" — Dev 2 code references `App\Models\Provider`, `App\Models\Category`, `App\Models\WellnessQuizResult` (owned by Backend Dev 1) but does NOT create those models/migrations. So endpoint happy-path tests can't run until Dev 1's foundation is merged; only validation/agent/geo tests run now. See [[laravel-ai-real-api]].

Key decisions: geo "near me" uses a DB-agnostic bounding-box + PHP Haversine (raw trig SQL fails on SQLite). DeepSeek is the AI provider with optional Anthropic failover via the `FailsOverToAnthropic` trait. The real `DEEPSEEK_API_KEY` lives in `.env` (gitignored); was shared in chat so should be rotated post-hackathon. Pre-existing full-suite failures are `ViteManifestNotFoundException` (needs `npm run build`), unrelated to Dev 2.
