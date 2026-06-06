<?php

namespace App\Ai\Concerns;

/**
 * Gives an agent an automatic provider failover chain.
 *
 * DeepSeek (the configured default) is always primary. Anthropic is appended
 * only when its API key is present, so a missing fallback key can never break
 * an otherwise-working DeepSeek setup.
 */
trait FailsOverToAnthropic
{
    /**
     * Resolve the ordered list of providers this agent may use.
     *
     * @return list<string>
     */
    public function provider(): array
    {
        $providers = [config('ai.default', 'deepseek')];

        if (filled(config('ai.providers.anthropic.key'))) {
            $providers[] = 'anthropic';
        }

        return array_values(array_unique($providers));
    }
}
