<?php

namespace App\Http\Controllers;

use App\Models\CauseCategory;
use App\Models\Company;
use App\Models\Location;
use App\Models\Machine;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class TrialController extends Controller
{
    /**
     * Show the trial signup form.
     */
    public function create(): Response
    {
        return Inertia::render('trial/signup');
    }

    /**
     * Process the trial signup.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'industry' => 'nullable|string|max:100',
            'company_size' => 'nullable|string|in:1-10,11-50,51-200,200+',
        ]);

        DB::transaction(function () use ($validated) {
            // Create company
            $company = Company::create([
                'name' => $validated['company_name'],
                'plan' => 'trial',
                'is_trial' => true,
                'trial_ends_at' => now()->addDays(14),
                'is_demo' => false,
                'industry' => $validated['industry'] ?? null,
                'company_size' => $validated['company_size'] ?? null,
                'feature_flags' => $this->getTrialFeatureFlags(),
            ]);

            // Create manager user
            $user = User::create([
                'company_id' => $company->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'manager',
                'email_verified_at' => now(),
            ]);

            // Seed demo data for the trial
            $this->seedTrialData($company);

            // Log in the new user
            Auth::login($user);
        });

        return redirect()->route('dashboard')
            ->with('success', __('trial.welcome_message'));
    }

    /**
     * Show the trial expired page.
     */
    public function expired(): Response
    {
        $company = Auth::user()->company;

        return Inertia::render('trial/expired', [
            'company' => [
                'name' => $company->name,
                'trial_ends_at' => $company->trial_ends_at?->toISOString(),
            ],
        ]);
    }

    /**
     * Get default feature flags for trial accounts.
     * Trial accounts get access to most features.
     */
    protected function getTrialFeatureFlags(): array
    {
        return [
            'inventory' => true,
            'oee' => true,
            'costs' => true,
            'integrations' => false, // Not for trials
            'iot' => false, // Not for trials
            'analytics' => true,
            'planning' => true,
            'vendor_portal' => false, // Not for trials
        ];
    }

    /**
     * Seed sample data for a trial company.
     */
    protected function seedTrialData(Company $company): void
    {
        // Create sample locations
        $locations = [
            ['name' => 'Productiehal A', 'description' => 'Hoofdproductiehal'],
            ['name' => 'Productiehal B', 'description' => 'Secundaire productiehal'],
            ['name' => 'Magazijn', 'description' => 'Centraal magazijn'],
            ['name' => 'Werkplaats', 'description' => 'Onderhoudswerkplaats'],
        ];

        $createdLocations = [];
        foreach ($locations as $loc) {
            $createdLocations[$loc['name']] = Location::create([
                'company_id' => $company->id,
                'name' => $loc['name'],
                'description' => $loc['description'],
            ]);
        }

        // Create sample machines
        $machines = [
            [
                'name' => 'CNC Freesmachine 1',
                'description' => '5-assige CNC freesmachine voor precisiewerk',
                'location' => 'Productiehal A',
                'manufacturer' => 'Haas',
                'model' => 'VF-2SS',
                'serial_number' => 'HAS-2024-001',
                'status' => 'operational',
            ],
            [
                'name' => 'Lasersnijder',
                'description' => 'CO2 lasersnijmachine voor plaatmateriaal',
                'location' => 'Productiehal A',
                'manufacturer' => 'Trumpf',
                'model' => 'TruLaser 3030',
                'serial_number' => 'TRF-2023-042',
                'status' => 'operational',
            ],
            [
                'name' => 'Verpakkingslijn 1',
                'description' => 'Automatische verpakkingslijn',
                'location' => 'Productiehal B',
                'manufacturer' => 'Bosch Packaging',
                'model' => 'Pack 401',
                'serial_number' => 'BSH-2022-189',
                'status' => 'operational',
            ],
            [
                'name' => 'Hydraulische Pers',
                'description' => '200 ton hydraulische pers',
                'location' => 'Productiehal B',
                'manufacturer' => 'Schuler',
                'model' => 'HPX-200',
                'serial_number' => 'SCH-2021-067',
                'status' => 'operational',
            ],
            [
                'name' => 'Compressor',
                'description' => 'Centrale persluchtcompressor',
                'location' => 'Werkplaats',
                'manufacturer' => 'Atlas Copco',
                'model' => 'GA 55',
                'serial_number' => 'AC-2020-234',
                'status' => 'operational',
            ],
            [
                'name' => 'Heftruck 1',
                'description' => 'Elektrische heftruck 2.5 ton',
                'location' => 'Magazijn',
                'manufacturer' => 'Toyota',
                'model' => '8FBMT25',
                'serial_number' => 'TOY-2023-089',
                'status' => 'operational',
            ],
        ];

        foreach ($machines as $m) {
            $locationId = isset($createdLocations[$m['location']])
                ? $createdLocations[$m['location']]->id
                : null;

            Machine::create([
                'company_id' => $company->id,
                'location_id' => $locationId,
                'name' => $m['name'],
                'description' => $m['description'],
                'manufacturer' => $m['manufacturer'],
                'model' => $m['model'],
                'serial_number' => $m['serial_number'],
                'status' => $m['status'],
            ]);
        }

        // Create sample cause categories
        $categories = [
            ['name' => 'Mechanisch', 'description' => 'Mechanische problemen zoals slijtage, breuk, etc.'],
            ['name' => 'Elektrisch', 'description' => 'Elektrische storingen, kortsluiting, etc.'],
            ['name' => 'Software', 'description' => 'Software fouten, PLC problemen, etc.'],
            ['name' => 'Pneumatisch', 'description' => 'Perslucht gerelateerde problemen'],
            ['name' => 'Hydraulisch', 'description' => 'Hydraulische systeem problemen'],
            ['name' => 'Operator fout', 'description' => 'Fouten door verkeerde bediening'],
            ['name' => 'Materiaal', 'description' => 'Problemen met grondstoffen of materiaal'],
            ['name' => 'Onbekend', 'description' => 'Oorzaak nog niet vastgesteld'],
        ];

        foreach ($categories as $cat) {
            CauseCategory::create([
                'company_id' => $company->id,
                'name' => $cat['name'],
                'description' => $cat['description'],
            ]);
        }
    }
}
