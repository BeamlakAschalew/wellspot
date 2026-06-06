<?php

use Inertia\Testing\AssertableInertia as Assert;

test('home renders the WellSpot landing page', function () {
    $response = $this->get(route('home'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
        );
});

test('quiz renders the AI wellness quiz page', function () {
    $response = $this->get(route('quiz'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('quiz')
        );
});
