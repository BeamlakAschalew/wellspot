# WellSpot Completed Tasks

Use this file as the iteration checkpoint. Completed items should not be scaffolded again unless the implementation needs a deliberate refactor.

## Provider-Side Dashboard Scaffold

- [x] Replaced the default Laravel installer dashboard placeholder with a provider-side shadcn/Inertia dashboard.
- [x] Added authenticated dashboard controller backed by real provider data.
- [x] Scaffolded provider domain migrations for categories, providers, services, bookings, and reviews.
- [x] Added Eloquent models, relationships, casts, fillable attributes, and factories for the provider-side domain.
- [x] Added service creation, update, and delete endpoints scoped to the signed-in provider.
- [x] Added provider profile update endpoint scoped to the signed-in provider.
- [x] Regenerated Wayfinder actions and routes for the new provider service endpoints.
- [x] Added shadcn-style provider profile form, service form, service edit dialogs, service catalog, booking queue, reviews, and operational metrics to the dashboard.
- [x] Removed client payment and provider subscription UI from the active scaffold; clients pay in person and provider SaaS billing is a later milestone.
- [x] Updated app sidebar/logo language from the Laravel starter kit to WellSpot provider dashboard.
- [x] Added focused feature tests for provider dashboard, provider profile editing, and provider service management.

## Backend Dev 1 Completion Slice

- [x] Added guest-first booking creation without requiring client sign-up.
- [x] Added provider-owned booking status transitions for pending, confirmed, completed, and cancelled bookings.
- [x] Added guide-named provider listing routes/controller backed by the existing dashboard management UI.
- [x] Added guide-named service controller while preserving dashboard service routes.
- [x] Added guest review submission tied to booking contact verification.
- [x] Added provider SaaS subscription records and Chapa HTTP-client integration without a Composer SDK.
- [x] Added Chapa checkout initialization and callback verification routes for provider monthly billing only.
- [x] Added deterministic category, provider, and service seeders for Addis Ababa demo data.
- [x] Added focused feature tests for bookings, listing management, reviews, and Chapa subscription callbacks.

## Pending Next Iteration

- [ ] Public marketplace provider discovery pages.
- [ ] Wellness quiz and AI recommendation flow.
- [ ] Map and nearby search integration.
- [ ] Expand demo seed data to 25+ realistic Addis Ababa providers.
