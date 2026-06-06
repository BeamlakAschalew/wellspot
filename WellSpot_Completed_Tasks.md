# WellSpot Completed Tasks

Use this file as the iteration checkpoint. Completed items should not be scaffolded again unless the implementation needs a deliberate refactor.

## Provider-Side Dashboard Scaffold

- [x] Replaced the default Laravel installer dashboard placeholder with a provider-side shadcn/Inertia dashboard.
- [x] Added authenticated dashboard controller backed by real provider data.
- [x] Scaffolded provider domain migrations for categories, providers, services, bookings, reviews, and provider subscriptions.
- [x] Added Eloquent models, relationships, casts, fillable attributes, and factories for the provider-side domain.
- [x] Added service creation, update, and delete endpoints scoped to the signed-in provider.
- [x] Regenerated Wayfinder actions and routes for the new provider service endpoints.
- [x] Added shadcn-style service form, service catalog, booking queue, reviews, metrics, and subscription summary to the dashboard.
- [x] Updated app sidebar/logo language from the Laravel starter kit to WellSpot provider dashboard.
- [x] Added focused feature tests for provider dashboard and provider service management.

## Pending Next Iteration

- [ ] Provider profile editing flow.
- [ ] Booking status transitions.
- [ ] Public marketplace provider discovery pages.
- [ ] Wellness quiz and AI recommendation flow.
- [ ] Map and nearby search integration.
- [ ] Chapa subscription checkout integration.
- [ ] Seed 25+ realistic Addis Ababa providers for demo data.
