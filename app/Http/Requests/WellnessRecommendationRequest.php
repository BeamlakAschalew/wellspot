<?php

namespace App\Http\Requests;

use App\Ai\Agents\WellnessIntakeAgent;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WellnessRecommendationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'feeling' => ['required', 'string', 'min:3', 'max:500'],
            'answers' => ['required', 'array', 'min:1', 'max:5'],
            'answers.*.question_key' => ['required', 'string', 'max:80'],
            'answers.*.question' => ['nullable', 'string', 'max:300'],
            'answers.*.value' => ['required', 'string', 'max:120'],
            'answers.*.label' => ['required', 'string', 'max:200'],
            'answers.*.category_slugs' => ['nullable', 'array', 'max:3'],
            'answers.*.category_slugs.*' => ['required', 'string', Rule::in(WellnessIntakeAgent::CATEGORIES)],
            'answers.*.keywords' => ['nullable', 'array', 'max:8'],
            'answers.*.keywords.*' => ['required', 'string', 'max:60'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90', 'required_with:longitude'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180', 'required_with:latitude'],
            'radius' => ['nullable', 'numeric', 'min:1', 'max:50'],
        ];
    }
}
