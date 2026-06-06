<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'google_maps' => [
        'key' => env('GOOGLE_MAPS_API_KEY'),
        'map_id' => env('GOOGLE_MAPS_MAP_ID', 'DEMO_MAP_ID'),
        'region' => env('GOOGLE_MAPS_REGION', 'ET'),
        'language' => env('GOOGLE_MAPS_LANGUAGE', 'en'),
    ],

    'chapa' => [
        'secret_key' => env('CHAPA_SECRET_KEY'),
        'public_key' => env('CHAPA_PUBLIC_KEY'),
        'encryption_key' => env('CHAPA_ENCRYPTION_KEY', '123'),
        'base_url' => env('CHAPA_BASE_URL', 'https://api.chapa.co'),
        'service_monthly_amount' => (int) env('CHAPA_SERVICE_MONTHLY_AMOUNT', 2000),
        'currency' => env('CHAPA_CURRENCY', 'ETB'),
        'fallback_email' => env('CHAPA_FALLBACK_EMAIL', 'billing@wellspot.test'),
        'callback_url' => env('CHAPA_CALLBACK_URL'),
        'return_url' => env('CHAPA_RETURN_URL'),
        'webhook_secret' => env('CHAPA_WEBHOOK_SECRET'),
        'checkout_title' => env('CHAPA_CHECKOUT_TITLE', 'WellSpot'),
        'checkout_description' => env('CHAPA_CHECKOUT_DESCRIPTION', 'Provider plan'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
