<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sensor;
use App\Models\PurchaseOrder;
use App\Services\SensorReadingProcessor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class WebhookController extends Controller
{
    protected SensorReadingProcessor $readingProcessor;

    public function __construct(SensorReadingProcessor $readingProcessor)
    {
        $this->readingProcessor = $readingProcessor;
    }

    /**
     * Receive sensor reading via webhook (REST).
     */
    public function sensorReading(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'sensor_id' => 'required|string',
            'reading_value' => 'required|numeric',
            'reading_time' => 'nullable|date',
            'metadata' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            Log::warning('Invalid sensor reading webhook received', [
                'errors' => $validator->errors(),
                'payload' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Find sensor by external sensor_id
            $sensor = Sensor::where('sensor_id', $request->sensor_id)
                ->where('is_active', true)
                ->first();

            if (!$sensor) {
                Log::warning('Sensor not found for webhook', [
                    'sensor_id' => $request->sensor_id,
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Sensor not found or inactive',
                ], 404);
            }

            $readingTime = $request->reading_time
                ? \Carbon\Carbon::parse($request->reading_time)
                : now();

            // Process the reading
            $reading = $this->readingProcessor->process(
                $sensor,
                $request->reading_value,
                $readingTime,
                $request->metadata
            );

            Log::info('Sensor reading processed via webhook', [
                'sensor_id' => $sensor->id,
                'reading_id' => $reading->id,
                'value' => $request->reading_value,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Reading processed successfully',
                'reading_id' => $reading->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to process sensor reading webhook', [
                'error' => $e->getMessage(),
                'sensor_id' => $request->sensor_id,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process reading',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Receive batch sensor readings via webhook.
     */
    public function sensorReadingBatch(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'readings' => 'required|array|min:1|max:100',
            'readings.*.sensor_id' => 'required|string',
            'readings.*.reading_value' => 'required|numeric',
            'readings.*.reading_time' => 'nullable|date',
            'readings.*.metadata' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $results = [
            'total' => count($request->readings),
            'succeeded' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        foreach ($request->readings as $index => $readingData) {
            try {
                $sensor = Sensor::where('sensor_id', $readingData['sensor_id'])
                    ->where('is_active', true)
                    ->first();

                if (!$sensor) {
                    $results['failed']++;
                    $results['errors'][] = [
                        'index' => $index,
                        'sensor_id' => $readingData['sensor_id'],
                        'error' => 'Sensor not found or inactive',
                    ];
                    continue;
                }

                $readingTime = isset($readingData['reading_time'])
                    ? \Carbon\Carbon::parse($readingData['reading_time'])
                    : now();

                $this->readingProcessor->process(
                    $sensor,
                    $readingData['reading_value'],
                    $readingTime,
                    $readingData['metadata'] ?? null
                );

                $results['succeeded']++;
            } catch (\Exception $e) {
                $results['failed']++;
                $results['errors'][] = [
                    'index' => $index,
                    'sensor_id' => $readingData['sensor_id'],
                    'error' => $e->getMessage(),
                ];
            }
        }

        Log::info('Batch sensor readings processed', $results);

        return response()->json([
            'success' => $results['failed'] === 0,
            'message' => "Processed {$results['succeeded']}/{$results['total']} readings",
            'results' => $results,
        ]);
    }

    /**
     * Receive ERP purchase order update webhook.
     */
    public function erpPurchaseOrderUpdate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'po_number' => 'required|string',
            'status' => 'required|in:received,shipped,delivered,cancelled',
            'tracking_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Find PO by reference number
            $purchaseOrder = PurchaseOrder::where('reference_number', $request->po_number)
                ->orWhere('po_number', $request->po_number)
                ->first();

            if (!$purchaseOrder) {
                return response()->json([
                    'success' => false,
                    'message' => 'Purchase order not found',
                ], 404);
            }

            $purchaseOrder->update([
                'status' => $request->status,
                'tracking_number' => $request->tracking_number ?? $purchaseOrder->tracking_number,
                'notes' => $request->notes ?? $purchaseOrder->notes,
            ]);

            Log::info('Purchase order updated via ERP webhook', [
                'po_id' => $purchaseOrder->id,
                'po_number' => $request->po_number,
                'status' => $request->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Purchase order updated successfully',
                'purchase_order_id' => $purchaseOrder->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to process ERP purchase order webhook', [
                'error' => $e->getMessage(),
                'po_number' => $request->po_number,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update purchase order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
