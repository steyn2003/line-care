<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExternalService;
use App\Models\WorkOrder;
use App\Models\WorkOrderCost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ExternalServiceController extends Controller
{
    /**
     * Display a listing of external services.
     */
    public function index(Request $request)
    {
        $companyId = $request->user()->company_id;

        $query = ExternalService::where('company_id', $companyId)
            ->with(['workOrder.machine'])
            ->orderBy('created_at', 'desc');

        // Filter by work order
        if ($request->has('work_order_id')) {
            $query->where('work_order_id', $request->work_order_id);
        }

        // Filter by vendor
        if ($request->has('vendor_name')) {
            $query->where('vendor_name', 'like', '%' . $request->vendor_name . '%');
        }

        $services = $query->paginate($request->get('per_page', 15));

        return response()->json($services);
    }

    /**
     * Store a newly created external service.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'work_order_id' => 'required|exists:work_orders,id',
            'vendor_name' => 'required|string|max:255',
            'description' => 'required|string',
            'cost' => 'required|numeric|min:0',
            'invoice_number' => 'nullable|string|max:255',
            'invoice_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $companyId = $request->user()->company_id;

        // Verify work order belongs to company
        $workOrder = WorkOrder::where('id', $request->work_order_id)
            ->where('company_id', $companyId)
            ->firstOrFail();

        try {
            DB::beginTransaction();

            $externalService = ExternalService::create([
                'company_id' => $companyId,
                'work_order_id' => $request->work_order_id,
                'vendor_name' => $request->vendor_name,
                'description' => $request->description,
                'cost' => $request->cost,
                'invoice_number' => $request->invoice_number,
                'invoice_date' => $request->invoice_date,
            ]);

            // Update work order cost
            $workOrderCost = $workOrder->cost ?? new WorkOrderCost(['work_order_id' => $workOrder->id]);

            // Sum all external service costs
            $totalExternalCost = $workOrder->externalServices()->sum('cost');
            $workOrderCost->external_service_cost = $totalExternalCost;
            $workOrderCost->calculateTotal();

            DB::commit();

            return response()->json($externalService->load('workOrder'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create external service: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified external service.
     */
    public function show(Request $request, $id)
    {
        $externalService = ExternalService::where('company_id', $request->user()->company_id)
            ->with(['workOrder.machine'])
            ->findOrFail($id);

        return response()->json($externalService);
    }

    /**
     * Update the specified external service.
     */
    public function update(Request $request, $id)
    {
        $externalService = ExternalService::where('company_id', $request->user()->company_id)
            ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'vendor_name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'cost' => 'sometimes|required|numeric|min:0',
            'invoice_number' => 'nullable|string|max:255',
            'invoice_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $externalService->update($request->only([
                'vendor_name',
                'description',
                'cost',
                'invoice_number',
                'invoice_date',
            ]));

            // Update work order cost
            $workOrder = $externalService->workOrder;
            $workOrderCost = $workOrder->cost;

            if ($workOrderCost) {
                $totalExternalCost = $workOrder->externalServices()->sum('cost');
                $workOrderCost->external_service_cost = $totalExternalCost;
                $workOrderCost->calculateTotal();
            }

            DB::commit();

            return response()->json($externalService->load('workOrder'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update external service: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified external service.
     */
    public function destroy(Request $request, $id)
    {
        $externalService = ExternalService::where('company_id', $request->user()->company_id)
            ->findOrFail($id);

        try {
            DB::beginTransaction();

            $workOrder = $externalService->workOrder;
            $externalService->delete();

            // Update work order cost
            $workOrderCost = $workOrder->cost;

            if ($workOrderCost) {
                $totalExternalCost = $workOrder->externalServices()->sum('cost');
                $workOrderCost->external_service_cost = $totalExternalCost;
                $workOrderCost->calculateTotal();
            }

            DB::commit();

            return response()->json(['message' => 'External service deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete external service: ' . $e->getMessage(),
            ], 500);
        }
    }
}
