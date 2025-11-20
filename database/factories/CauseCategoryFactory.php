<?php

namespace Database\Factories;

use App\Models\CauseCategory;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CauseCategory>
 */
class CauseCategoryFactory extends Factory
{
    protected $model = CauseCategory::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'name' => fake()->unique()->randomElement([
                'Electrical Failure',
                'Mechanical Wear',
                'Operator Error',
                'Material Defect',
                'Preventive Maintenance',
                'External Factor',
                'Lubrication Issue',
                'Overheating',
                'Calibration Needed',
            ]),
            'description' => fake()->optional()->sentence(),
        ];
    }
}
