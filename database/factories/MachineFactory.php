<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Location;
use App\Models\Machine;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Machine>
 */
class MachineFactory extends Factory
{
    protected $model = Machine::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['CNC', 'PRESS', 'MILL', 'CONV', 'PKG']);
        $number = fake()->numberBetween(1, 99);

        return [
            'company_id' => Company::factory(),
            'location_id' => Location::factory(),
            'name' => fake()->randomElement([
                'CNC Mill',
                'Hydraulic Press',
                'Injection Molder',
                'Conveyor Belt',
                'Packaging Machine',
                'Forklift',
            ]) . ' ' . str_pad($number, 2, '0', STR_PAD_LEFT),
            'code' => $type . '-' . str_pad($number, 3, '0', STR_PAD_LEFT),
            'criticality' => fake()->randomElement(['low', 'medium', 'high']),
            'status' => 'active',
        ];
    }
}
