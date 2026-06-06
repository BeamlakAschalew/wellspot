---
name: laravel-ai-real-api
description: laravel/ai v0.7 real API — corrects the WellSpot guide's inaccurate examples
metadata:
  type: reference
---

The WellSpot hackathon guide's `laravel/ai` examples are partly wrong. The real v0.7 API:

- **Structured output:** agent implements `Laravel\Ai\Contracts\HasStructuredOutput`; `schema(JsonSchema $schema): array`. Get the data with `$response->toArray()` (or ArrayAccess) — there is **no `->structured()`** method. The SDK passes a `new Illuminate\JsonSchema\JsonSchemaTypeFactory` to `schema()` (use that in tests).
- **Schema builder:** `$schema->integer()->min(0)->max(100)->required()`, `$schema->array()->items($schema->string()->enum([...]))->min(1)->max(3)->required()`, `->nullable()`, `->description()`. Note array items use `->items()`, NOT `array(items: ...)`.
- **One-off text:** there is **no `Ai::text()`**. Use an agent class (`Class::make()->prompt($p)`) — `(string) $response` for plain text.
- **Failover:** define `public function provider(): array` returning e.g. `['deepseek','anthropic']` (NOT a `failover()` method). `config('ai.default')` must be a string provider name.
- **DeepSeek** is a built-in driver (`config/ai.php` providers.deepseek, `DEEPSEEK_API_KEY`). Default text provider set via `'default' => env('AI_PROVIDER','deepseek')`.
- **Testing:** `Ai::fakeAgent(Class::class, [$assocArrayOrString])`; with a schema and no response it auto-generates valid fake structured data. (WellSpot tests avoid fakes per user preference and call the real API only in throwaway checks.)

Related: [[wellspot-dev2-scope]].
