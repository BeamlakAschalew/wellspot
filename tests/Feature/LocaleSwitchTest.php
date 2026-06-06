<?php

use Inertia\Testing\AssertableInertia as Assert;

test('users can switch the active locale', function () {
    $this->post(route('locale.update'), [
        'locale' => 'en',
    ])
        ->assertRedirect()
        ->assertSessionHas('locale', 'en');

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'en')
        );
});

test('unsupported locales are rejected', function () {
    $this->post(route('locale.update'), [
        'locale' => 'fr',
    ])->assertSessionHasErrors('locale');
});
