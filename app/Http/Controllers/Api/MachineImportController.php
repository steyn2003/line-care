<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\Machine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MachineImportController extends Controller
{
    /**
     * Upload and preview CSV file.
     */
    public function upload(Request $request): JsonResponse
    {
        // Only managers can import machines
        if ($request->user()->role !== \App\Enums\Role::MANAGER) {
            return response()->json([
                'message' => 'Only managers can import machines.',
            ], 403);
        }

        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'], // 2MB max
        ]);

        try {
            $file = $request->file('file');
            $path = $file->store('imports', 'local');

            // Read first 5 rows for preview
            $handle = fopen(storage_path('app/' . $path), 'r');
            $headers = fgetcsv($handle);

            $preview = [];
            $rowCount = 0;
            while (($row = fgetcsv($handle)) !== false && $rowCount < 5) {
                $preview[] = array_combine($headers, $row);
                $rowCount++;
            }
            fclose($handle);

            // Detect columns
            $detectedColumns = [];
            foreach ($headers as $header) {
                $normalized = strtolower(trim($header));
                if (in_array($normalized, ['name', 'machine name', 'machine_name'])) {
                    $detectedColumns['name'] = $header;
                } elseif (in_array($normalized, ['code', 'id', 'machine code', 'machine_code'])) {
                    $detectedColumns['code'] = $header;
                } elseif (in_array($normalized, ['location', 'location name', 'location_name'])) {
                    $detectedColumns['location'] = $header;
                } elseif (in_array($normalized, ['criticality', 'priority'])) {
                    $detectedColumns['criticality'] = $header;
                }
            }

            return response()->json([
                'file_id' => basename($path),
                'headers' => $headers,
                'detected_columns' => $detectedColumns,
                'preview' => $preview,
                'message' => 'File uploaded successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to process CSV file',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Validate CSV with column mapping.
     */
    public function validate(Request $request): JsonResponse
    {
        if ($request->user()->role !== \App\Enums\Role::MANAGER) {
            return response()->json([
                'message' => 'Only managers can import machines.',
            ], 403);
        }

        $request->validate([
            'file_id' => ['required', 'string'],
            'column_mapping' => ['required', 'array'],
            'column_mapping.name' => ['required', 'string'],
            'column_mapping.code' => ['nullable', 'string'],
            'column_mapping.location' => ['nullable', 'string'],
            'column_mapping.criticality' => ['nullable', 'string'],
        ]);

        try {
            $path = 'imports/' . $request->file_id;

            if (!Storage::disk('local')->exists($path)) {
                return response()->json(['message' => 'File not found'], 404);
            }

            $handle = fopen(storage_path('app/' . $path), 'r');
            $headers = fgetcsv($handle);

            $mapping = $request->column_mapping;
            $validRows = [];
            $invalidRows = [];
            $rowNumber = 1;

            while (($row = fgetcsv($handle)) !== false) {
                $rowNumber++;
                $data = array_combine($headers, $row);

                $machineData = [
                    'name' => $data[$mapping['name']] ?? '',
                    'code' => isset($mapping['code']) ? ($data[$mapping['code']] ?? '') : '',
                    'location' => isset($mapping['location']) ? ($data[$mapping['location']] ?? '') : '',
                    'criticality' => isset($mapping['criticality']) ? ($data[$mapping['criticality']] ?? 'medium') : 'medium',
                ];

                // Validate
                $validator = Validator::make($machineData, [
                    'name' => ['required', 'string', 'max:255'],
                    'code' => ['nullable', 'string', 'max:255'],
                    'criticality' => ['in:low,medium,high'],
                ]);

                if ($validator->fails()) {
                    $invalidRows[] = [
                        'row' => $rowNumber,
                        'data' => $machineData,
                        'errors' => $validator->errors()->all(),
                    ];
                } else {
                    $validRows[] = [
                        'row' => $rowNumber,
                        'data' => $machineData,
                    ];
                }
            }
            fclose($handle);

            return response()->json([
                'valid_count' => count($validRows),
                'invalid_count' => count($invalidRows),
                'valid_rows' => array_slice($validRows, 0, 5), // Preview first 5
                'invalid_rows' => $invalidRows,
                'total_rows' => count($validRows) + count($invalidRows),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Validation failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Execute the import.
     */
    public function import(Request $request): JsonResponse
    {
        if ($request->user()->role !== \App\Enums\Role::MANAGER) {
            return response()->json([
                'message' => 'Only managers can import machines.',
            ], 403);
        }

        $request->validate([
            'file_id' => ['required', 'string'],
            'column_mapping' => ['required', 'array'],
            'column_mapping.name' => ['required', 'string'],
            'location_handling' => ['required', 'in:create,skip'], // create new locations or skip
        ]);

        try {
            $path = 'imports/' . $request->file_id;

            if (!Storage::disk('local')->exists($path)) {
                return response()->json(['message' => 'File not found'], 404);
            }

            $handle = fopen(storage_path('app/' . $path), 'r');
            $headers = fgetcsv($handle);

            $mapping = $request->column_mapping;
            $companyId = $request->user()->company_id;
            $locationHandling = $request->location_handling;

            $created = 0;
            $skipped = 0;
            $locationsCreated = [];
            $errors = [];

            DB::beginTransaction();

            while (($row = fgetcsv($handle)) !== false) {
                $data = array_combine($headers, $row);

                $machineName = trim($data[$mapping['name']] ?? '');
                if (empty($machineName)) {
                    $skipped++;
                    continue;
                }

                $machineCode = isset($mapping['code']) ? trim($data[$mapping['code']] ?? '') : null;
                $locationName = isset($mapping['location']) ? trim($data[$mapping['location']] ?? '') : null;
                $criticality = isset($mapping['criticality']) ? strtolower(trim($data[$mapping['criticality']] ?? 'medium')) : 'medium';

                // Normalize criticality
                if (!in_array($criticality, ['low', 'medium', 'high'])) {
                    $criticality = 'medium';
                }

                // Handle location
                $locationId = null;
                if ($locationName && $locationHandling === 'create') {
                    $location = Location::firstOrCreate(
                        ['name' => $locationName, 'company_id' => $companyId],
                        ['name' => $locationName, 'company_id' => $companyId]
                    );
                    $locationId = $location->id;

                    if ($location->wasRecentlyCreated) {
                        $locationsCreated[] = $locationName;
                    }
                }

                // Check for duplicate code
                if ($machineCode) {
                    $exists = Machine::where('company_id', $companyId)
                        ->where('code', $machineCode)
                        ->exists();

                    if ($exists) {
                        $errors[] = "Skipped: Machine with code '{$machineCode}' already exists";
                        $skipped++;
                        continue;
                    }
                }

                // Create machine
                Machine::create([
                    'name' => $machineName,
                    'code' => $machineCode,
                    'company_id' => $companyId,
                    'location_id' => $locationId,
                    'criticality' => $criticality,
                    'status' => 'active',
                ]);

                $created++;
            }

            DB::commit();
            fclose($handle);

            // Clean up file
            Storage::disk('local')->delete($path);

            return response()->json([
                'message' => 'Import completed successfully',
                'created_count' => $created,
                'skipped_count' => $skipped,
                'locations_created' => array_unique($locationsCreated),
                'errors' => $errors,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Import failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
