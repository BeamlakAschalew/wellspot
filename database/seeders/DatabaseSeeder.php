<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Category;
use App\Models\Provider;
use App\Models\ProviderSubscription;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = $this->seedUsers();
        $categories = $this->seedCategories();
        $providers = $this->seedProviders($users, $categories);
        $services = $this->seedServices($providers, $categories);
        $bookings = $this->seedBookings($users, $providers, $services);

        $this->seedReviews($bookings);
        $this->seedProviderSubscriptions($providers);
    }

    /**
     * @return array<string, User>
     */
    private function seedUsers(): array
    {
        $users = [
            'demo_customer' => ['Test User', 'test@example.com'],
            'provider_admin' => ['WellSpot Provider', 'provider@example.com'],
            'aster' => ['Aster Tesfaye', 'aster.tesfaye@example.com'],
            'dawit' => ['Dawit Bekele', 'dawit.bekele@example.com'],
            'selam' => ['Selam Gebru', 'selam.gebru@example.com'],
            'hana' => ['Hana Tadesse', 'hana.tadesse@example.com'],
            'michael' => ['Michael Alemu', 'michael.alemu@example.com'],
            'meron' => ['Meron Solomon', 'meron.solomon@example.com'],
            'samuel' => ['Samuel Kidane', 'samuel.kidane@example.com'],
        ];

        return collect($users)
            ->mapWithKeys(fn (array $user, string $key): array => [
                $key => User::query()->updateOrCreate(
                    ['email' => $user[1]],
                    [
                        'name' => $user[0],
                        'password' => Hash::make('password'),
                    ],
                ),
            ])
            ->all();
    }

    /**
     * @return array<string, Category>
     */
    private function seedCategories(): array
    {
        $categories = [
            [
                'name' => 'Spa & Massage',
                'slug' => 'spa-massage',
                'icon' => 'sparkles',
                'color' => 'emerald',
                'description' => 'Therapeutic massage, recovery bodywork, steam, and spa treatments.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Fitness Studio',
                'slug' => 'fitness-studio',
                'icon' => 'dumbbell',
                'color' => 'sky',
                'description' => 'Personal training, strength coaching, conditioning, and mobility sessions.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Yoga & Mindfulness',
                'slug' => 'yoga-mindfulness',
                'icon' => 'leaf',
                'color' => 'lime',
                'description' => 'Yoga, breathwork, meditation, nervous system regulation, and mindful movement.',
                'sort_order' => 3,
            ],
            [
                'name' => 'Nutrition Counseling',
                'slug' => 'nutrition-counseling',
                'icon' => 'apple',
                'color' => 'amber',
                'description' => 'Meal planning, sports nutrition, family nutrition, and metabolic wellness support.',
                'sort_order' => 4,
            ],
            [
                'name' => 'Mental Health',
                'slug' => 'mental-health',
                'icon' => 'heart-pulse',
                'color' => 'rose',
                'description' => 'Counseling, stress support, workplace wellbeing, and private therapy sessions.',
                'sort_order' => 5,
            ],
            [
                'name' => 'Retreat Center',
                'slug' => 'retreat-center',
                'icon' => 'mountain',
                'color' => 'violet',
                'description' => 'Guided day retreats, nature resets, group circles, and restorative experiences.',
                'sort_order' => 6,
            ],
            [
                'name' => 'Beauty & Skin Care',
                'slug' => 'beauty-skin-care',
                'icon' => 'wand-sparkles',
                'color' => 'pink',
                'description' => 'Facials, skin consultations, grooming rituals, and gentle beauty care.',
                'sort_order' => 7,
            ],
            [
                'name' => 'Physical Therapy',
                'slug' => 'physical-therapy',
                'icon' => 'activity',
                'color' => 'cyan',
                'description' => 'Rehabilitation, posture correction, pain management, and injury recovery support.',
                'sort_order' => 8,
            ],
        ];

        return collect($categories)
            ->mapWithKeys(fn (array $category): array => [
                $category['slug'] => Category::query()->updateOrCreate(
                    ['slug' => $category['slug']],
                    $category,
                ),
            ])
            ->all();
    }

    /**
     * @param  array<string, User>  $users
     * @param  array<string, Category>  $categories
     * @return array<string, Provider>
     */
    private function seedProviders(array $users, array $categories): array
    {
        $providers = [
            [
                'owner' => 'provider_admin',
                'category' => 'spa-massage',
                'name' => 'Bole Recovery Spa',
                'headline' => 'Deep recovery massage and quiet spa care near Bole Medhanialem.',
                'description' => 'A warm, polished recovery studio for office workers, travelers, and athletes who need reliable bodywork without long back-and-forth scheduling.',
                'phone' => '+251911223344',
                'email' => 'hello@bolerecovery.wellspot.test',
                'address' => 'Bole Medhanialem, Cameroon Street, Addis Ababa',
                'neighborhood' => 'Bole',
                'latitude' => 9.0108441,
                'longitude' => 38.7826834,
                'amenities' => ['Private rooms', 'Steam room', 'Parking', 'Card payments', 'Amharic support'],
                'opening_hours' => ['mon_fri' => '08:00-21:00', 'sat' => '09:00-20:00', 'sun' => '10:00-18:00'],
                'status' => 'published',
                'is_featured' => true,
                'published_at' => now()->subMonths(5),
            ],
            [
                'owner' => 'hana',
                'category' => 'yoga-mindfulness',
                'name' => 'Kazanchis Mindful Studio',
                'headline' => 'Breathwork, gentle yoga, and lunch-hour decompression for busy schedules.',
                'description' => 'Small-group classes and private mindfulness sessions designed for professionals who want consistency, calm, and practical tools they can use at work.',
                'phone' => '+251912884420',
                'email' => 'studio@kazanchismindful.wellspot.test',
                'address' => 'Kazanchis Business District, Addis Ababa',
                'neighborhood' => 'Kazanchis',
                'latitude' => 9.0181342,
                'longitude' => 38.7675312,
                'amenities' => ['Mats included', 'Tea lounge', 'Small groups', 'Online follow-up notes'],
                'opening_hours' => ['mon_fri' => '06:30-20:30', 'sat' => '08:00-16:00', 'sun' => 'Closed'],
                'status' => 'published',
                'is_featured' => true,
                'published_at' => now()->subMonths(4),
            ],
            [
                'owner' => 'dawit',
                'category' => 'fitness-studio',
                'name' => 'Saris Strength Lab',
                'headline' => 'Evidence-led personal training, strength blocks, and mobility resets.',
                'description' => 'A compact coaching gym with structured assessments, progressive plans, and practical strength training for beginners and returning athletes.',
                'phone' => '+251913442018',
                'email' => 'coach@sarisstrength.wellspot.test',
                'address' => 'Saris Adey Abeba Road, Addis Ababa',
                'neighborhood' => 'Saris',
                'latitude' => 8.9561073,
                'longitude' => 38.7467168,
                'amenities' => ['Locker area', 'Body composition scan', 'Coach check-ins', 'Parking'],
                'opening_hours' => ['mon_fri' => '06:00-21:00', 'sat' => '07:00-18:00', 'sun' => '09:00-13:00'],
                'status' => 'published',
                'is_featured' => false,
                'published_at' => now()->subMonths(3),
            ],
            [
                'owner' => 'selam',
                'category' => 'nutrition-counseling',
                'name' => 'CMC Nutrition Room',
                'headline' => 'Realistic meal plans for families, professionals, and training goals.',
                'description' => 'A nutrition counseling office focused on Ethiopian food habits, budget-aware planning, habit tracking, and long-term metabolic health.',
                'phone' => '+251914781230',
                'email' => 'care@cmcnutrition.wellspot.test',
                'address' => 'CMC Michael Road, Addis Ababa',
                'neighborhood' => 'CMC',
                'latitude' => 9.0369698,
                'longitude' => 38.8298146,
                'amenities' => ['Digital meal plans', 'Family consultations', 'Lab review', 'Telehealth'],
                'opening_hours' => ['mon_fri' => '09:00-18:00', 'sat' => '09:00-14:00', 'sun' => 'Closed'],
                'status' => 'published',
                'is_featured' => false,
                'published_at' => now()->subMonths(2),
            ],
            [
                'owner' => 'michael',
                'category' => 'mental-health',
                'name' => 'Piassa Counseling Corner',
                'headline' => 'Private counseling for stress, transitions, grief, and workplace burnout.',
                'description' => 'A discreet counseling practice with individual sessions, short-term support plans, and referrals for clients who need specialized care.',
                'phone' => '+251911740088',
                'email' => 'appointments@piassacounseling.wellspot.test',
                'address' => 'Adwa Street, Piassa, Addis Ababa',
                'neighborhood' => 'Piassa',
                'latitude' => 9.0346457,
                'longitude' => 38.7503913,
                'amenities' => ['Private entrance', 'Evening sessions', 'Confidential intake', 'Amharic and English'],
                'opening_hours' => ['mon_fri' => '10:00-19:00', 'sat' => '10:00-15:00', 'sun' => 'Closed'],
                'status' => 'published',
                'is_featured' => true,
                'published_at' => now()->subWeeks(7),
            ],
            [
                'owner' => 'meron',
                'category' => 'retreat-center',
                'name' => 'Entoto Reset House',
                'headline' => 'Guided day retreats, forest walks, and reflective group resets above the city.',
                'description' => 'A calm retreat space for small teams, couples, and individuals who need nature, facilitation, and a structured day away from noise.',
                'phone' => '+251915330221',
                'email' => 'retreats@entotoreset.wellspot.test',
                'address' => 'Entoto Park Access Road, Addis Ababa',
                'neighborhood' => 'Entoto',
                'latitude' => 9.0844283,
                'longitude' => 38.7648315,
                'amenities' => ['Forest walk', 'Healthy lunch', 'Group facilitation', 'Transport add-on'],
                'opening_hours' => ['mon_fri' => '09:00-17:00', 'sat' => '08:30-18:00', 'sun' => '08:30-18:00'],
                'status' => 'published',
                'is_featured' => false,
                'published_at' => now()->subWeeks(6),
            ],
            [
                'owner' => 'samuel',
                'category' => 'physical-therapy',
                'name' => 'Megenagna Physio Clinic',
                'headline' => 'Assessment-led physical therapy for back pain, posture, and sports injuries.',
                'description' => 'A practical rehab clinic combining movement assessment, hands-on care, and home exercise plans for people who want clear next steps.',
                'phone' => '+251916902144',
                'email' => 'hello@megenagnaphysio.wellspot.test',
                'address' => 'Megenagna Roundabout, Addis Ababa',
                'neighborhood' => 'Megenagna',
                'latitude' => 9.0240192,
                'longitude' => 38.8002195,
                'amenities' => ['Exercise plan', 'Progress tracking', 'Rehab equipment', 'Elevator access'],
                'opening_hours' => ['mon_fri' => '08:00-19:00', 'sat' => '09:00-15:00', 'sun' => 'Closed'],
                'status' => 'published',
                'is_featured' => false,
                'published_at' => now()->subWeeks(5),
            ],
            [
                'owner' => 'aster',
                'category' => 'beauty-skin-care',
                'name' => 'Summit Skin Rituals',
                'headline' => 'Gentle facials, skin barrier support, and simple at-home routines.',
                'description' => 'A neighborhood skin care studio offering realistic beauty care, calm consultations, and services that fit sensitive skin and busy lives.',
                'phone' => '+251917449900',
                'email' => 'care@summitskin.wellspot.test',
                'address' => 'Summit Condominium Area, Addis Ababa',
                'neighborhood' => 'Summit',
                'latitude' => 9.0314138,
                'longitude' => 38.8597852,
                'amenities' => ['Patch testing', 'Gentle products', 'Skin routine card', 'Private room'],
                'opening_hours' => ['mon_fri' => '09:00-20:00', 'sat' => '09:00-18:00', 'sun' => '11:00-16:00'],
                'status' => 'published',
                'is_featured' => false,
                'published_at' => now()->subWeeks(3),
            ],
            [
                'owner' => 'provider_admin',
                'category' => 'fitness-studio',
                'name' => 'Old Airport Mobility Club',
                'headline' => 'Mobility classes and low-impact conditioning for stiff backs and shoulders.',
                'description' => 'A draft provider profile included to demonstrate onboarding and dashboard states before public publishing.',
                'phone' => '+251918118800',
                'email' => 'team@oldairportmobility.wellspot.test',
                'address' => 'Old Airport, Addis Ababa',
                'neighborhood' => 'Old Airport',
                'latitude' => 8.9981324,
                'longitude' => 38.7284972,
                'amenities' => ['Mobility equipment', 'Small groups'],
                'opening_hours' => ['mon_fri' => '07:00-19:00', 'sat' => '09:00-13:00', 'sun' => 'Closed'],
                'status' => 'draft',
                'is_featured' => false,
                'published_at' => null,
            ],
        ];

        return collect($providers)
            ->mapWithKeys(function (array $provider) use ($users, $categories): array {
                $slug = Str::slug($provider['name']);

                return [
                    $slug => Provider::query()->updateOrCreate(
                        ['slug' => $slug],
                        [
                            'user_id' => $users[$provider['owner']]->id,
                            'category_id' => $categories[$provider['category']]->id,
                            'name' => $provider['name'],
                            'headline' => $provider['headline'],
                            'description' => $provider['description'],
                            'phone' => $provider['phone'],
                            'email' => $provider['email'],
                            'address' => $provider['address'],
                            'neighborhood' => $provider['neighborhood'],
                            'latitude' => $provider['latitude'],
                            'longitude' => $provider['longitude'],
                            'amenities' => $provider['amenities'],
                            'opening_hours' => $provider['opening_hours'],
                            'status' => $provider['status'],
                            'is_featured' => $provider['is_featured'],
                            'published_at' => $provider['published_at'],
                        ],
                    ),
                ];
            })
            ->all();
    }

    /**
     * @param  array<string, Provider>  $providers
     * @param  array<string, Category>  $categories
     * @return array<string, Service>
     */
    private function seedServices(array $providers, array $categories): array
    {
        $serviceCatalog = [
            'bole-recovery-spa' => [
                ['Deep Tissue Recovery Massage', 'Focused pressure work for neck, shoulders, back, and hips after travel, gym sessions, or long office days.', 60, 1500],
                ['Aromatherapy Relaxation Massage', 'A calming full-body massage with light aromatherapy and quiet recovery time.', 75, 1800],
                ['Couples Steam and Massage Ritual', 'A shared steam session followed by synchronized relaxation massage in private rooms.', 110, 3600],
                ['Sports Recovery Add-on Stretch', 'Assisted stretching and targeted mobility work after a main massage session.', 30, 650],
            ],
            'kazanchis-mindful-studio' => [
                ['Morning Flow Yoga Class', 'An energizing small-group class with mobility, breathwork, and grounded movement.', 50, 550],
                ['Private Breathwork Reset', 'One-on-one guided breathing for stress regulation, focus, and calmer transitions.', 45, 950],
                ['Corporate Lunch Decompression', 'A practical midday session for teams who need calm without leaving the office rhythm.', 60, 2400],
            ],
            'saris-strength-lab' => [
                ['Strength Assessment and Plan', 'Movement screening, goal mapping, and a first four-week training structure.', 75, 1400],
                ['One-on-One Personal Training', 'A coached strength session with form correction and progressive programming.', 60, 1200],
                ['Small Group Conditioning', 'A four-person conditioning class focused on strength, engine work, and safe intensity.', 45, 450],
                ['Mobility Reset Session', 'Joint-friendly mobility drills for stiff hips, backs, and shoulders.', 40, 700],
            ],
            'cmc-nutrition-room' => [
                ['Initial Nutrition Consultation', 'A detailed intake covering routines, food preferences, goals, labs, and practical constraints.', 90, 1600],
                ['Family Meal Planning Session', 'Weekly meal planning for families using local ingredients and realistic shopping rhythms.', 75, 1400],
                ['Sports Nutrition Check-in', 'Fuel timing, recovery nutrition, hydration, and protein planning for active clients.', 45, 900],
            ],
            'piassa-counseling-corner' => [
                ['Individual Counseling Session', 'A confidential session for stress, grief, transitions, anxiety, or work-life strain.', 50, 1700],
                ['Burnout Recovery Planning', 'A structured planning session for workload boundaries, nervous system care, and next steps.', 75, 2100],
                ['Couples Communication Session', 'Guided communication support for couples navigating conflict or major transitions.', 60, 2200],
            ],
            'entoto-reset-house' => [
                ['Guided Forest Day Retreat', 'A half-day reset with guided walking, reflection prompts, tea, and facilitated closing.', 240, 4200],
                ['Team Reflection Circle', 'A guided group session for small teams focused on recovery, alignment, and healthier rhythms.', 180, 6500],
                ['Solo Reset with Lunch', 'A self-paced quiet retreat day with a healthy lunch and optional facilitator check-in.', 300, 3800],
            ],
            'megenagna-physio-clinic' => [
                ['Physio Assessment', 'Posture, pain history, movement screening, and a clear treatment plan.', 60, 1300],
                ['Follow-up Rehab Session', 'Hands-on therapy, corrective exercises, and plan adjustments based on progress.', 45, 900],
                ['Sports Injury Recovery Plan', 'A structured rehabilitation roadmap for runners, football players, and gym injuries.', 75, 1800],
            ],
            'summit-skin-rituals' => [
                ['Skin Consultation and Routine Plan', 'A calm intake and practical routine card for skin goals, sensitivity, and budget.', 45, 800],
                ['Hydration Barrier Facial', 'A gentle facial focused on skin barrier repair, hydration, and low-irritation products.', 70, 1500],
                ['Event Prep Glow Treatment', 'A polishing and hydration service for weddings, graduations, and photo days.', 60, 1700],
            ],
            'old-airport-mobility-club' => [
                ['Desk Shoulder Mobility Class', 'A draft service for shoulder, neck, and upper-back mobility practice.', 40, 500, 'inactive'],
                ['Low Impact Strength Intro', 'A draft low-impact class for people returning to movement.', 50, 650, 'inactive'],
            ],
        ];

        return collect($serviceCatalog)
            ->flatMap(function (array $services, string $providerSlug) use ($providers, $categories): array {
                $provider = $providers[$providerSlug];

                return collect($services)
                    ->mapWithKeys(function (array $service, int $index) use ($provider, $categories): array {
                        [$name, $description, $duration, $price] = $service;
                        $slug = Str::slug($name);

                        return [
                            $provider->slug.'.'.$slug => Service::query()->updateOrCreate(
                                [
                                    'provider_id' => $provider->id,
                                    'slug' => $slug,
                                ],
                                [
                                    'category_id' => $categories[$provider->category->slug]->id,
                                    'name' => $name,
                                    'description' => $description,
                                    'duration_minutes' => $duration,
                                    'price_amount' => $price,
                                    'currency' => 'ETB',
                                    'status' => $service[4] ?? 'active',
                                    'sort_order' => $index + 1,
                                ],
                            ),
                        ];
                    })
                    ->all();
            })
            ->all();
    }

    /**
     * @param  array<string, User>  $users
     * @param  array<string, Provider>  $providers
     * @param  array<string, Service>  $services
     * @return array<string, Booking>
     */
    private function seedBookings(array $users, array $providers, array $services): array
    {
        $bookings = [
            [
                'key' => 'aster_bole_completed',
                'user' => 'aster',
                'provider' => 'bole-recovery-spa',
                'service' => 'bole-recovery-spa.deep-tissue-recovery-massage',
                'starts_at' => now()->subDays(24)->setTime(10, 0),
                'status' => 'completed',
                'customer_name' => 'Aster Tesfaye',
                'customer_phone' => '+251911000111',
                'notes' => 'Requested extra focus on shoulders after a long flight.',
            ],
            [
                'key' => 'guest_bole_confirmed',
                'user' => null,
                'provider' => 'bole-recovery-spa',
                'service' => 'bole-recovery-spa.aromatherapy-relaxation-massage',
                'starts_at' => now()->addDays(2)->setTime(16, 30),
                'status' => 'confirmed',
                'customer_name' => 'Rahel Worku',
                'customer_phone' => '+251922340010',
                'notes' => 'Prefers a quiet room and light pressure.',
            ],
            [
                'key' => 'dawit_yoga_completed',
                'user' => 'dawit',
                'provider' => 'kazanchis-mindful-studio',
                'service' => 'kazanchis-mindful-studio.private-breathwork-reset',
                'starts_at' => now()->subDays(15)->setTime(7, 30),
                'status' => 'completed',
                'customer_name' => 'Dawit Bekele',
                'customer_phone' => '+251911223301',
                'notes' => 'Wanted tools for sleep and focus before work.',
            ],
            [
                'key' => 'selam_saris_pending',
                'user' => 'selam',
                'provider' => 'saris-strength-lab',
                'service' => 'saris-strength-lab.strength-assessment-and-plan',
                'starts_at' => now()->addDays(4)->setTime(9, 0),
                'status' => 'pending',
                'customer_name' => 'Selam Gebru',
                'customer_phone' => '+251933112244',
                'notes' => 'New to strength training and asked for beginner-friendly coaching.',
            ],
            [
                'key' => 'guest_cmc_completed',
                'user' => null,
                'provider' => 'cmc-nutrition-room',
                'service' => 'cmc-nutrition-room.initial-nutrition-consultation',
                'starts_at' => now()->subDays(10)->setTime(14, 0),
                'status' => 'completed',
                'customer_name' => 'Kidist Yilma',
                'customer_phone' => '+251944000771',
                'notes' => 'Brought recent lab results and wanted a breakfast plan.',
            ],
            [
                'key' => 'hana_piassa_completed',
                'user' => 'hana',
                'provider' => 'piassa-counseling-corner',
                'service' => 'piassa-counseling-corner.individual-counseling-session',
                'starts_at' => now()->subDays(7)->setTime(18, 0),
                'status' => 'completed',
                'customer_name' => 'Hana Tadesse',
                'customer_phone' => '+251911550302',
                'notes' => 'Asked for an evening appointment because of work.',
            ],
            [
                'key' => 'meron_entoto_confirmed',
                'user' => 'meron',
                'provider' => 'entoto-reset-house',
                'service' => 'entoto-reset-house.guided-forest-day-retreat',
                'starts_at' => now()->addDays(9)->setTime(8, 30),
                'status' => 'confirmed',
                'customer_name' => 'Meron Solomon',
                'customer_phone' => '+251912001245',
                'notes' => 'Celebrating a birthday with a quiet reset day.',
            ],
            [
                'key' => 'michael_physio_completed',
                'user' => 'michael',
                'provider' => 'megenagna-physio-clinic',
                'service' => 'megenagna-physio-clinic.physio-assessment',
                'starts_at' => now()->subDays(4)->setTime(11, 15),
                'status' => 'completed',
                'customer_name' => 'Michael Alemu',
                'customer_phone' => '+251911340781',
                'notes' => 'Lower back pain after several weeks of desk work.',
            ],
            [
                'key' => 'samuel_skin_cancelled',
                'user' => 'samuel',
                'provider' => 'summit-skin-rituals',
                'service' => 'summit-skin-rituals.hydration-barrier-facial',
                'starts_at' => now()->subDays(2)->setTime(15, 45),
                'status' => 'cancelled',
                'customer_name' => 'Samuel Kidane',
                'customer_phone' => '+251918887766',
                'notes' => 'Cancelled because of schedule conflict.',
            ],
            [
                'key' => 'guest_saris_completed',
                'user' => null,
                'provider' => 'saris-strength-lab',
                'service' => 'saris-strength-lab.one-on-one-personal-training',
                'starts_at' => now()->subDays(30)->setTime(6, 30),
                'status' => 'completed',
                'customer_name' => 'Liya Abebe',
                'customer_phone' => '+251922778899',
                'notes' => 'Wanted form coaching for squats and deadlifts.',
            ],
            [
                'key' => 'aster_piassa_pending',
                'user' => 'aster',
                'provider' => 'piassa-counseling-corner',
                'service' => 'piassa-counseling-corner.burnout-recovery-planning',
                'starts_at' => now()->addDays(6)->setTime(17, 30),
                'status' => 'pending',
                'customer_name' => 'Aster Tesfaye',
                'customer_phone' => '+251911000111',
                'notes' => 'Asked whether a remote follow-up is possible.',
            ],
            [
                'key' => 'guest_entoto_completed',
                'user' => null,
                'provider' => 'entoto-reset-house',
                'service' => 'entoto-reset-house.solo-reset-with-lunch',
                'starts_at' => now()->subDays(18)->setTime(9, 0),
                'status' => 'completed',
                'customer_name' => 'Marta Girma',
                'customer_phone' => '+251933440099',
                'notes' => 'Booked a solo reset after a busy month.',
            ],
        ];

        return collect($bookings)
            ->mapWithKeys(function (array $booking) use ($users, $providers, $services): array {
                $service = $services[$booking['service']];

                return [
                    $booking['key'] => Booking::query()->updateOrCreate(
                        [
                            'provider_id' => $providers[$booking['provider']]->id,
                            'service_id' => $service->id,
                            'customer_phone' => $booking['customer_phone'],
                        ],
                        [
                            'user_id' => $booking['user'] ? $users[$booking['user']]->id : null,
                            'starts_at' => Carbon::parse($booking['starts_at']),
                            'status' => $booking['status'],
                            'customer_name' => $booking['customer_name'],
                            'notes' => $booking['notes'],
                            'total_amount' => $service->price_amount,
                            'currency' => $service->currency,
                        ],
                    ),
                ];
            })
            ->all();
    }

    /**
     * @param  array<string, Booking>  $bookings
     */
    private function seedReviews(array $bookings): void
    {
        $reviews = [
            [
                'booking' => 'aster_bole_completed',
                'rating' => 5,
                'title' => 'Exactly the reset I needed',
                'comment' => 'The room was calm, the therapist listened carefully, and my shoulders felt lighter for the first time in weeks.',
                'is_published' => true,
            ],
            [
                'booking' => 'dawit_yoga_completed',
                'rating' => 5,
                'title' => 'Practical and grounding',
                'comment' => 'The breathwork felt simple enough to use before meetings, which is what made it stick for me.',
                'is_published' => true,
            ],
            [
                'booking' => 'guest_cmc_completed',
                'rating' => 4,
                'title' => 'Realistic meal planning',
                'comment' => 'No extreme rules, just meals my family can actually cook and repeat during the week.',
                'is_published' => true,
            ],
            [
                'booking' => 'hana_piassa_completed',
                'rating' => 5,
                'title' => 'Respectful and private',
                'comment' => 'The appointment felt confidential and calm from arrival to checkout.',
                'is_published' => true,
            ],
            [
                'booking' => 'michael_physio_completed',
                'rating' => 4,
                'title' => 'Clear next steps',
                'comment' => 'I left with a simple plan and exercises I understood instead of vague advice.',
                'is_published' => true,
            ],
            [
                'booking' => 'guest_saris_completed',
                'rating' => 5,
                'title' => 'Strong coaching',
                'comment' => 'The coach corrected my form without making the session intimidating.',
                'is_published' => true,
            ],
            [
                'booking' => 'guest_entoto_completed',
                'rating' => 5,
                'title' => 'A peaceful day above the city',
                'comment' => 'The lunch, forest walk, and quiet structure made the day feel very intentional.',
                'is_published' => true,
            ],
            [
                'booking' => 'samuel_skin_cancelled',
                'rating' => 3,
                'title' => 'Had to reschedule',
                'comment' => 'The team was polite when I cancelled, but I have not tried the service yet.',
                'is_published' => false,
            ],
        ];

        collect($reviews)->each(function (array $review) use ($bookings): void {
            $booking = $bookings[$review['booking']];

            Review::query()->updateOrCreate(
                ['booking_id' => $booking->id],
                [
                    'user_id' => $booking->user_id,
                    'provider_id' => $booking->provider_id,
                    'rating' => $review['rating'],
                    'title' => $review['title'],
                    'comment' => $review['comment'],
                    'is_published' => $review['is_published'],
                ],
            );
        });
    }

    /**
     * @param  array<string, Provider>  $providers
     */
    private function seedProviderSubscriptions(array $providers): void
    {
        $subscriptions = [
            ['bole-recovery-spa', 'monthly', 8000, 'active', now()->subMonth(), now()->addMonth(), 'wellspot-seed-bole-active'],
            ['kazanchis-mindful-studio', 'monthly', 6000, 'active', now()->subWeeks(3), now()->addWeeks(5), 'wellspot-seed-kazanchis-active'],
            ['saris-strength-lab', 'monthly', 8000, 'active', now()->subWeeks(2), now()->addWeeks(6), 'wellspot-seed-saris-active'],
            ['cmc-nutrition-room', 'monthly', 6000, 'pending', null, null, 'wellspot-seed-cmc-pending'],
            ['piassa-counseling-corner', 'monthly', 6000, 'active', now()->subDays(10), now()->addDays(20), 'wellspot-seed-piassa-active'],
            ['entoto-reset-house', 'monthly', 6000, 'active', now()->subDays(8), now()->addDays(22), 'wellspot-seed-entoto-active'],
            ['megenagna-physio-clinic', 'monthly', 6000, 'active', now()->subDays(5), now()->addDays(25), 'wellspot-seed-physio-active'],
            ['summit-skin-rituals', 'monthly', 6000, 'pending', null, null, 'wellspot-seed-summit-pending'],
            ['old-airport-mobility-club', 'monthly', 4000, 'pending', null, null, 'wellspot-seed-old-airport-pending'],
        ];

        collect($subscriptions)->each(function (array $subscription) use ($providers): void {
            [$providerSlug, $plan, $amount, $status, $startedAt, $expiresAt, $transactionReference] = $subscription;

            ProviderSubscription::query()->updateOrCreate(
                ['chapa_tx_ref' => $transactionReference],
                [
                    'provider_id' => $providers[$providerSlug]->id,
                    'plan' => $plan,
                    'amount' => $amount,
                    'currency' => 'ETB',
                    'chapa_ref_id' => $status === 'active' ? Str::upper(Str::after($transactionReference, 'wellspot-seed-')).'-REF' : null,
                    'chapa_checkout_url' => $status === 'pending' ? 'https://checkout.chapa.co/test/'.$transactionReference : null,
                    'status' => $status,
                    'started_at' => $startedAt,
                    'expires_at' => $expiresAt,
                ],
            );
        });
    }
}
