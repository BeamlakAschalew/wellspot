<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->string('name_am')->nullable()->after('name');
            $table->text('description_am')->nullable()->after('description');
        });

        Schema::table('providers', function (Blueprint $table) {
            $table->string('name_am')->nullable()->after('name');
            $table->string('headline_am')->nullable()->after('headline');
            $table->text('description_am')->nullable()->after('description');
            $table->json('amenities_am')->nullable()->after('amenities');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->string('name_am')->nullable()->after('name');
            $table->text('description_am')->nullable()->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['name_am', 'description_am']);
        });

        Schema::table('providers', function (Blueprint $table) {
            $table->dropColumn(['name_am', 'headline_am', 'description_am', 'amenities_am']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['name_am', 'description_am']);
        });
    }
};
