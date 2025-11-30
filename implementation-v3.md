# LineCare V3 - Implementation Plan

Building on V2 to add multi-tenancy controls, administration, audit logging, and external integrations.

## V3 Vision

Transform LineCare into an enterprise-ready SaaS platform that:
- **Controls feature access** per tenant with flexible plans
- **Provides superadmin oversight** for managing all companies
- **Maintains audit trails** for compliance and accountability
- **Enables data export** for reporting and analysis
- **Offers public API documentation** for external integrations
- **Supports webhooks** for real-time event notifications

---

## Current Status - V3 Progress
- [x] Phase 10 - Feature Flags & Plans per Tenant (COMPLETED)
- [x] Phase 11 - Superadmin Portal (COMPLETED)
- [ ] Phase 12 - Audit Logging System
- [ ] Phase 13 - Export, API Docs & Webhooks

---

## Phase 10: Feature Flags & Plans per Tenant

### 10.1 Core Feature Flag System

**Goals:**
- Per company: assign a plan (basic, pro, enterprise)
- Per feature: enable/disable (inventory, costs, oee, planning, analytics, api, webhooks, vendor_portal)
- Backend enforcement (routes/policies)
- Frontend gating (menus, buttons, pages)

**Database Changes:**

- [ ] **Migration: Add fields to `companies` table**
  - `plan` (string, default: 'basic') - basic, pro, enterprise
  - `feature_flags` (JSON, nullable) - override defaults per company
  ```json
  {
    "inventory": true,
    "oee": false,
    "costs": true,
    "planning": true,
    "analytics": true,
    "api": false,
    "webhooks": false,
    "vendor_portal": false
  }
  ```

**Configuration:**

- [ ] **config/features.php** - Default features per plan
  ```php
  return [
      'plans' => [
          'basic' => [
              'inventory' => false,
              'oee' => false,
              'costs' => false,
              'planning' => true,
              'analytics' => false,
              'api' => false,
              'webhooks' => false,
              'vendor_portal' => false,
          ],
          'pro' => [
              'inventory' => true,
              'oee' => true,
              'costs' => true,
              'planning' => true,
              'analytics' => true,
              'api' => false,
              'webhooks' => false,
              'vendor_portal' => false,
          ],
          'enterprise' => [
              'inventory' => true,
              'oee' => true,
              'costs' => true,
              'planning' => true,
              'analytics' => true,
              'api' => true,
              'webhooks' => true,
              'vendor_portal' => true,
          ],
      ],
  ];
  ```

### 10.2 Backend - Feature Service & Middleware

**Service: `App\Services\FeatureService`**

- [ ] Create FeatureService class
  - `enabledForCompany(Company $company, string $feature): bool`
  - `enabledForUser(User $user, string $feature): bool`
  - `getAllFeatures(Company $company): array`

**Logic:**
```php
// 1. Get defaults from config
$defaults = config('features.plans.' . $company->plan);

// 2. Override with company-specific flags
$flags = array_merge($defaults, $company->feature_flags ?? []);

// 3. Superadmin always gets all features
if ($user->is_superadmin) return true;

return $flags[$feature] ?? false;
```

**Middleware: `EnsureFeatureEnabled`**

- [ ] Create middleware `app/Http/Middleware/EnsureFeatureEnabled.php`
  - Alias: `feature:<name>`
  - Check: `FeatureService::enabledForUser($user, $feature)`
  - On failure: `abort(403)` or redirect to "Feature not available" page

**Route Usage:**
```php
Route::middleware(['auth', 'feature:inventory'])->group(function () {
    Route::resource('spare-parts', SparePartController::class);
});

Route::middleware(['auth', 'feature:oee'])->group(function () {
    Route::get('/oee/dashboard', [OeeController::class, 'dashboard']);
});
```

### 10.3 Frontend - Inertia Share & Component Gating

**Inertia Share:**

- [ ] Add features to shared props in `AppServiceProvider` or `HandleInertiaRequests`
  ```php
  Inertia::share('features', function () {
      $user = auth()->user();
      if (!$user) return [];
      
      return app(FeatureService::class)->getAllFeatures($user->company);
  });
  ```

**Frontend Usage:**

- [ ] Update sidebar navigation (`app-sidebar.tsx`)
  ```tsx
  const { features } = usePage().props;
  
  {features.inventory && (
    <SidebarMenuItem>
      <Link href="/spare-parts">Spare Parts</Link>
    </SidebarMenuItem>
  )}
  ```

- [ ] Create `FeatureGate` component
  ```tsx
  function FeatureGate({ feature, children, fallback = null }) {
    const { features } = usePage().props;
    return features[feature] ? children : fallback;
  }
  ```

- [ ] Page-level guards with redirect
  ```tsx
  useEffect(() => {
    if (!features.oee) {
      router.visit('/dashboard', {
        replace: true,
        onFinish: () => toast.error('Feature not available in your plan')
      });
    }
  }, []);
  ```

### 10.4 Stappenplan Phase 10

| # | Task | Status |
|---|------|--------|
| 1 | Migration: add `plan` + `feature_flags` to companies | [x] |
| 2 | Create `config/features.php` with plan defaults | [x] |
| 3 | Build `FeatureService` with logic | [x] |
| 4 | Create `EnsureFeatureEnabled` middleware | [x] |
| 5 | Register middleware alias in bootstrap/app.php | [x] |
| 6 | Apply middleware to feature-specific routes | [x] |
| 7 | Add Inertia share for features | [x] |
| 8 | Update sidebar with conditional rendering | [x] |
| 9 | Create `FeatureGate` React component | [x] |
| 10 | Add page-level guards to protected pages | [x] |
| 11 | Test all feature combinations | [x] |

---

## Phase 11: Superadmin Portal

### 11.1 Superadmin Foundation

**Goals:**
- Separate superadmin UI for managing all companies
- View company stats (users, machines, work orders)
- Manage plans and feature flags
- Impersonate users for debugging/support

**Database Changes:**

- [ ] **Migration: Add `is_superadmin` to `users` table**
  - `is_superadmin` (boolean, default: false)

- [ ] **Seeder: Upgrade admin user**
  ```php
  User::where('email', 'admin@example.com')
      ->update(['is_superadmin' => true]);
  ```

### 11.2 Superadmin Middleware

- [ ] Create middleware `app/Http/Middleware/EnsureSuperadmin.php`
  ```php
  public function handle($request, Closure $next)
  {
      if (!auth()->user()?->is_superadmin) {
          abort(403, 'Superadmin access required');
      }
      return $next($request);
  }
  ```

- [ ] Register middleware alias: `superadmin`

### 11.3 Impersonation System

**Session-based Impersonation:**

- [ ] Create `ImpersonationService`
  ```php
  class ImpersonationService
  {
      public function start(User $superadmin, User $targetUser): void
      {
          session([
              'impersonator_id' => $superadmin->id,
              'impersonated_user_id' => $targetUser->id,
          ]);
          auth()->login($targetUser);
      }
      
      public function stop(): void
      {
          $impersonatorId = session('impersonator_id');
          session()->forget(['impersonator_id', 'impersonated_user_id']);
          auth()->loginUsingId($impersonatorId);
      }
      
      public function isImpersonating(): bool
      {
          return session()->has('impersonator_id');
      }
  }
  ```

- [ ] Create `ImpersonationController`
  - `POST /admin/companies/{company}/impersonate` - Start impersonation
  - `POST /admin/stop-impersonating` - Stop impersonation

- [ ] Add impersonation banner component (shown when impersonating)
  ```tsx
  function ImpersonationBanner() {
    const { impersonating } = usePage().props;
    if (!impersonating) return null;
    
    return (
      <div className="bg-yellow-500 text-black p-2 text-center">
        Impersonating {impersonating.name} - 
        <button onClick={stopImpersonating}>Stop</button>
      </div>
    );
  }
  ```

### 11.4 Admin Routes & Controllers

**Routes:**

- [ ] Create admin route group
  ```php
  Route::middleware(['auth', 'superadmin'])
      ->prefix('admin')
      ->name('admin.')
      ->group(function () {
          // Dashboard
          Route::get('/', [AdminDashboardController::class, 'index'])
              ->name('dashboard');
          
          // Companies
          Route::get('/companies', [AdminCompanyController::class, 'index'])
              ->name('companies.index');
          Route::get('/companies/{company}', [AdminCompanyController::class, 'show'])
              ->name('companies.show');
          Route::put('/companies/{company}', [AdminCompanyController::class, 'update'])
              ->name('companies.update');
          Route::post('/companies/{company}/features', [AdminCompanyController::class, 'updateFeatures'])
              ->name('companies.features');
          
          // Impersonation
          Route::post('/companies/{company}/impersonate', [ImpersonationController::class, 'start'])
              ->name('impersonate.start');
          Route::post('/stop-impersonating', [ImpersonationController::class, 'stop'])
              ->name('impersonate.stop');
      });
  ```

**Controllers:**

- [ ] `AdminDashboardController`
  - `index()` - Overview stats (total companies, users, work orders)

- [ ] `AdminCompanyController`
  - `index()` - List all companies with stats
    ```php
    $companies = Company::withCount(['users', 'machines', 'workOrders'])
        ->paginate(20);
    ```
  - `show(Company $company)` - Company detail with feature flags
  - `update(Company $company)` - Update company info
  - `updateFeatures(Company $company)` - Update plan & feature flags

### 11.5 Superadmin UI

**Screens:**

- [ ] **Admin Dashboard** (`resources/js/pages/admin/dashboard.tsx`)
  - Total companies, users, machines, work orders
  - Recent activity
  - System health indicators

- [ ] **Companies List** (`resources/js/pages/admin/companies/index.tsx`)
  - Table columns: name, plan, #users, #machines, #work_orders, created_at
  - Search and filter by plan
  - Actions: View, Impersonate

- [ ] **Company Detail** (`resources/js/pages/admin/companies/show.tsx`)
  - Company info card
  - Plan selector dropdown (basic/pro/enterprise)
  - Feature flag toggles (switches)
  - Stats cards (users, machines, work orders, costs)
  - Recent activity
  - Impersonate button (with user selector)
  - Danger zone: disable/delete company

### 11.6 Stappenplan Phase 11

| # | Task | Status |
|---|------|--------|
| 1 | Migration: add `is_superadmin` to users | [ ] |
| 2 | Seed superadmin user | [ ] |
| 3 | Create `EnsureSuperadmin` middleware | [ ] |
| 4 | Build `ImpersonationService` | [ ] |
| 5 | Create `ImpersonationController` | [ ] |
| 6 | Create admin routes group | [ ] |
| 7 | Build `AdminDashboardController` | [ ] |
| 8 | Build `AdminCompanyController` | [ ] |
| 9 | Create admin dashboard page | [ ] |
| 10 | Create companies list page | [ ] |
| 11 | Create company detail page with feature toggles | [ ] |
| 12 | Add impersonation banner component | [ ] |
| 13 | Share impersonation state via Inertia | [ ] |
| 14 | Test impersonation flow end-to-end | [ ] |

---

## Phase 12: Audit Logging System

### 12.1 Audit Log Foundation

**Goals:**
- Track who did what, when, and what changed
- Focus on critical actions (status changes, assignments, inventory)
- Viewable per resource and globally
- Support compliance requirements

**New Model:**

- [ ] **AuditLog** model
  ```php
  // Migration fields
  Schema::create('audit_logs', function (Blueprint $table) {
      $table->id();
      $table->foreignId('company_id')->constrained()->cascadeOnDelete();
      $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
      $table->string('action'); // e.g., 'work_order.status_changed'
      $table->string('model_type'); // e.g., 'App\Models\WorkOrder'
      $table->unsignedBigInteger('model_id');
      $table->json('old_values')->nullable();
      $table->json('new_values')->nullable();
      $table->string('ip_address')->nullable();
      $table->timestamp('created_at');
      
      // Indexes
      $table->index('company_id');
      $table->index(['model_type', 'model_id']);
      $table->index('user_id');
      $table->index('action');
      $table->index('created_at');
  });
  ```

### 12.2 Audit Service

- [ ] **Create `App\Services\AuditService`**
  ```php
  class AuditService
  {
      public function log(
          string $action,
          Model $model,
          ?array $oldValues = null,
          ?array $newValues = null
      ): AuditLog {
          return AuditLog::create([
              'company_id' => $this->resolveCompanyId($model),
              'user_id' => auth()->id(),
              'action' => $action,
              'model_type' => get_class($model),
              'model_id' => $model->id,
              'old_values' => $oldValues,
              'new_values' => $newValues,
              'ip_address' => request()->ip(),
          ]);
      }
      
      public function logStatusChange(Model $model, string $oldStatus, string $newStatus): AuditLog
      {
          return $this->log(
              class_basename($model) . '.status_changed',
              $model,
              ['status' => $oldStatus],
              ['status' => $newStatus]
          );
      }
  }
  ```

### 12.3 Audit Integration Points

**Critical Actions to Audit:**

- [ ] **Work Orders**
  - `work_order.created` - New work order
  - `work_order.status_changed` - Status transitions
  - `work_order.assigned` - Assignment changes
  - `work_order.completed` - Completion with details
  - `work_order.deleted` - Soft delete

- [ ] **Preventive Tasks**
  - `preventive_task.created`
  - `preventive_task.updated`
  - `preventive_task.deleted`
  - `preventive_task.completed`

- [ ] **Inventory**
  - `inventory.adjusted` - Manual stock adjustments
  - `inventory.consumed` - Parts used on work order
  - `inventory.received` - PO received

- [ ] **Users**
  - `user.role_changed` - Role modifications
  - `user.activated` / `user.deactivated`
  - `user.created` / `user.deleted`

- [ ] **Companies (Superadmin)**
  - `company.plan_changed` - Plan upgrades/downgrades
  - `company.features_updated` - Feature flag changes

**Implementation Example:**
```php
// In WorkOrderController::updateStatus()
$oldStatus = $workOrder->status;
$workOrder->update(['status' => $request->status]);

app(AuditService::class)->logStatusChange($workOrder, $oldStatus, $request->status);
```

### 12.4 Audit Log API

**API Endpoints:**

- [ ] `GET /api/audit-logs` - List audit logs (manager + superadmin)
  - Query params: `model_type`, `model_id`, `user_id`, `action`, `date_from`, `date_to`
  - Pagination support
  - Manager: filtered to own company
  - Superadmin: all companies (with company filter)

- [ ] `GET /api/audit-logs/{modelType}/{id}` - Audit trail for specific resource
  - Example: `GET /api/audit-logs/work-order/123`
  - Returns chronological list of changes

**Controller:**
```php
class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with('user:id,name')
            ->when(!auth()->user()->is_superadmin, fn($q) => 
                $q->where('company_id', auth()->user()->company_id)
            )
            ->when($request->model_type, fn($q, $type) => 
                $q->where('model_type', 'like', "%$type%")
            )
            ->when($request->model_id, fn($q, $id) => 
                $q->where('model_id', $id)
            )
            ->when($request->user_id, fn($q, $id) => 
                $q->where('user_id', $id)
            )
            ->when($request->action, fn($q, $action) => 
                $q->where('action', $action)
            )
            ->when($request->date_from, fn($q, $date) => 
                $q->whereDate('created_at', '>=', $date)
            )
            ->when($request->date_to, fn($q, $date) => 
                $q->whereDate('created_at', '<=', $date)
            )
            ->latest()
            ->paginate(50);
            
        return response()->json($query);
    }
    
    public function forModel(string $modelType, int $id)
    {
        $fullType = $this->resolveModelType($modelType);
        
        $logs = AuditLog::with('user:id,name')
            ->where('model_type', $fullType)
            ->where('model_id', $id)
            ->latest()
            ->get();
            
        return response()->json($logs);
    }
}
```

### 12.5 Audit Log UI

**Screens:**

- [ ] **Audit Tab on Resource Detail** (`work-orders/show.tsx`)
  - Add "Audit Log" tab
  - Timeline view of changes
  - Show: timestamp, user, action, diff summary
  ```tsx
  <Tabs>
    <Tab label="Details">...</Tab>
    <Tab label="Audit Log">
      <AuditTimeline modelType="work-order" modelId={workOrder.id} />
    </Tab>
  </Tabs>
  ```

- [ ] **Global Audit Page** (`resources/js/pages/audit/index.tsx`)
  - Filter bar: user, model type, action, date range
  - Table: timestamp, user, action, resource, summary
  - Click row → navigate to resource (if exists)

- [ ] **AuditTimeline Component**
  ```tsx
  function AuditTimeline({ modelType, modelId }) {
    const [logs, setLogs] = useState([]);
    
    useEffect(() => {
      fetch(`/api/audit-logs/${modelType}/${modelId}`)
        .then(r => r.json())
        .then(setLogs);
    }, [modelType, modelId]);
    
    return (
      <div className="space-y-4">
        {logs.map(log => (
          <AuditEntry key={log.id} log={log} />
        ))}
      </div>
    );
  }
  ```

### 12.6 Stappenplan Phase 12

| # | Task | Status |
|---|------|--------|
| 1 | Migration: create `audit_logs` table | [ ] |
| 2 | Create `AuditLog` model | [ ] |
| 3 | Build `AuditService` with log methods | [ ] |
| 4 | Add audit calls to WorkOrderController | [ ] |
| 5 | Add audit calls to InventoryController | [ ] |
| 6 | Add audit calls to UserController | [ ] |
| 7 | Add audit calls to AdminCompanyController | [ ] |
| 8 | Create AuditLogController with endpoints | [ ] |
| 9 | Register API routes | [ ] |
| 10 | Create AuditTimeline component | [ ] |
| 11 | Add Audit tab to WorkOrder show page | [ ] |
| 12 | Create global Audit page | [ ] |
| 13 | Test audit logging end-to-end | [ ] |

---

## Phase 13: Export, API Docs & Webhooks

### 13.1 CSV/Excel Export

**Goals:**
- Export work orders, machines, costs, parts to CSV
- Use streaming for large datasets
- Apply same filters as list pages

**Export Service:**

- [ ] **Create `App\Services\ExportService`**
  ```php
  class ExportService
  {
      public function csv(string $filename, $query, array $columns): StreamedResponse
      {
          return response()->stream(function () use ($query, $columns) {
              $handle = fopen('php://output', 'w');
              
              // Headers
              fputcsv($handle, array_column($columns, 'label'));
              
              // Data (chunked for memory efficiency)
              $query->chunk(1000, function ($rows) use ($handle, $columns) {
                  foreach ($rows as $row) {
                      $data = [];
                      foreach ($columns as $col) {
                          $data[] = is_callable($col['value']) 
                              ? $col['value']($row) 
                              : $row->{$col['value']};
                      }
                      fputcsv($handle, $data);
                  }
              });
              
              fclose($handle);
          }, 200, [
              'Content-Type' => 'text/csv',
              'Content-Disposition' => "attachment; filename=\"$filename\"",
          ]);
      }
  }
  ```

**Export Endpoints:**

- [ ] `GET /exports/work-orders` - Export work orders
  - Same filters as `/api/work-orders`
  - Columns: ID, Title, Machine, Status, Priority, Assigned To, Created, Completed

- [ ] `GET /exports/machines` - Export machines
  - Columns: ID, Name, Location, Status, Last Maintenance, Total Work Orders

- [ ] `GET /exports/costs` - Export cost report
  - Columns: Work Order, Machine, Labor Cost, Parts Cost, Downtime Cost, Total

- [ ] `GET /exports/spare-parts` - Export spare parts
  - Columns: Part Number, Name, Category, Stock, Reorder Point, Unit Cost

**Frontend Integration:**

- [ ] Add export buttons to list pages
  ```tsx
  <Button asChild>
    <a href={`/exports/work-orders?${currentFilters}`}>
      <Download className="w-4 h-4 mr-2" />
      Export CSV
    </a>
  </Button>
  ```

### 13.2 Public API Documentation

**Goals:**
- OpenAPI/Swagger documentation
- Public docs page for developers
- Authentication guide

**OpenAPI Specification:**

- [ ] **Create `public/openapi.json`**
  ```json
  {
    "openapi": "3.0.3",
    "info": {
      "title": "LineCare API",
      "version": "1.0.0",
      "description": "CMMS API for maintenance management"
    },
    "servers": [
      { "url": "https://api.linecare.app/v1" }
    ],
    "security": [
      { "bearerAuth": [] }
    ],
    "paths": {
      "/machines": { ... },
      "/work-orders": { ... },
      "/spare-parts": { ... }
    },
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer"
        }
      }
    }
  }
  ```

**Documentation Routes:**

- [ ] `GET /api/docs` - Swagger UI page
- [ ] `GET /openapi.json` - Raw OpenAPI spec

**Implementation:**
```php
// routes/web.php
Route::get('/api/docs', function () {
    return view('api-docs');
});

Route::get('/openapi.json', function () {
    return response()->file(public_path('openapi.json'));
});
```

**Swagger UI View:**
```blade
<!-- resources/views/api-docs.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>LineCare API Docs</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.css">
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js"></script>
    <script>
        SwaggerUIBundle({
            url: "/openapi.json",
            dom_id: '#swagger-ui',
        });
    </script>
</body>
</html>
```

### 13.3 Webhooks System

**Goals:**
- Tenants can register webhook endpoints
- Receive notifications for key events
- Secure with HMAC signatures

**New Model:**

- [ ] **WebhookEndpoint** model
  ```php
  Schema::create('webhook_endpoints', function (Blueprint $table) {
      $table->id();
      $table->foreignId('company_id')->constrained()->cascadeOnDelete();
      $table->string('url');
      $table->string('secret'); // For HMAC signature
      $table->json('events'); // ['work_order.created', 'work_order.completed']
      $table->boolean('is_active')->default(true);
      $table->timestamp('last_triggered_at')->nullable();
      $table->timestamps();
  });
  ```

**Webhook Events:**

| Event | Trigger |
|-------|---------|
| `work_order.created` | New work order created |
| `work_order.completed` | Work order marked complete |
| `work_order.assigned` | Technician assigned |
| `part.low_stock` | Part falls below reorder point |
| `purchase_order.received` | PO received and stocked |
| `failure.predicted` | Predictive maintenance alert |

**Webhook Dispatcher:**

- [ ] **Create `App\Services\WebhookDispatcher`**
  ```php
  class WebhookDispatcher
  {
      public function dispatch(string $event, Company $company, array $payload): void
      {
          $endpoints = WebhookEndpoint::where('company_id', $company->id)
              ->where('is_active', true)
              ->whereJsonContains('events', $event)
              ->get();
              
          foreach ($endpoints as $endpoint) {
              DispatchWebhookJob::dispatch($endpoint, $event, $payload);
          }
      }
  }
  ```

- [ ] **Create `App\Jobs\DispatchWebhookJob`**
  ```php
  class DispatchWebhookJob implements ShouldQueue
  {
      use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
      
      public $tries = 3;
      public $backoff = [60, 300, 900]; // Exponential backoff
      
      public function handle(): void
      {
          $payload = [
              'event' => $this->event,
              'company_id' => $this->endpoint->company_id,
              'data' => $this->data,
              'timestamp' => now()->toISOString(),
          ];
          
          $signature = hash_hmac('sha256', json_encode($payload), $this->endpoint->secret);
          
          Http::withHeaders([
              'X-Webhook-Signature' => $signature,
              'Content-Type' => 'application/json',
          ])->post($this->endpoint->url, $payload);
          
          $this->endpoint->update(['last_triggered_at' => now()]);
      }
  }
  ```

**Webhook API:**

- [ ] `GET /api/webhooks` - List endpoints
- [ ] `POST /api/webhooks` - Create endpoint
- [ ] `PUT /api/webhooks/{id}` - Update endpoint
- [ ] `DELETE /api/webhooks/{id}` - Delete endpoint
- [ ] `POST /api/webhooks/{id}/test` - Send test webhook

**Webhook UI:**

- [ ] **Webhooks Settings Page** (`resources/js/pages/settings/webhooks/index.tsx`)
  - List of configured endpoints
  - Add webhook modal
  - Event multi-select
  - Test button
  - Last triggered timestamp

### 13.4 Stappenplan Phase 13

| # | Task | Status |
|---|------|--------|
| 1 | Create `ExportService` | [ ] |
| 2 | Add work orders export endpoint | [ ] |
| 3 | Add machines export endpoint | [ ] |
| 4 | Add costs export endpoint | [ ] |
| 5 | Add spare parts export endpoint | [ ] |
| 6 | Add export buttons to list pages | [ ] |
| 7 | Create `openapi.json` specification | [ ] |
| 8 | Create API docs view with Swagger UI | [ ] |
| 9 | Register docs routes | [ ] |
| 10 | Migration: create `webhook_endpoints` table | [ ] |
| 11 | Create `WebhookEndpoint` model | [ ] |
| 12 | Build `WebhookDispatcher` service | [ ] |
| 13 | Create `DispatchWebhookJob` | [ ] |
| 14 | Create WebhookController with CRUD | [ ] |
| 15 | Add webhook triggers to critical events | [ ] |
| 16 | Create webhooks settings UI | [ ] |
| 17 | Test webhook delivery end-to-end | [ ] |

---

## Implementation Priority Matrix

### High Priority (Core SaaS)
1. **Phase 10** - Feature Flags
   - Essential for multi-tier pricing
   - Foundation for other phases
   - Low complexity, high impact

2. **Phase 11** - Superadmin Portal
   - Required for company management
   - Enables support workflow
   - Builds on Phase 10

### Medium Priority
3. **Phase 12** - Audit Logging
   - Important for compliance
   - Supports debugging
   - Can be added incrementally

4. **Phase 13.1** - CSV Export
   - Quick win for users
   - Simple implementation

### Lower Priority
5. **Phase 13.2** - API Docs
   - Needed when exposing public API
   - Can wait until API stabilizes

6. **Phase 13.3** - Webhooks
   - Advanced feature
   - Required for enterprise integrations

---

## Technical Considerations

### Performance
- [ ] Index `audit_logs` table properly (created_at, model_type+model_id)
- [ ] Use chunked queries for exports
- [ ] Queue webhook dispatches

### Security
- [ ] Superadmin routes behind strict middleware
- [ ] Audit log sensitive data masking (passwords, tokens)
- [ ] Webhook signature verification documentation
- [ ] Rate limit webhook endpoints

### Testing
- [ ] Feature flag unit tests
- [ ] Impersonation integration tests
- [ ] Audit service tests
- [ ] Export service tests
- [ ] Webhook dispatch tests

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 10 - Feature Flags | 1 week | None |
| Phase 11 - Superadmin Portal | 1.5 weeks | Phase 10 |
| Phase 12 - Audit Logging | 1.5 weeks | None |
| Phase 13 - Export, Docs, Webhooks | 2 weeks | Phase 10 (for feature gating) |

**Total V3 Development: 6 weeks**

---

## Success Metrics

- Feature flag coverage: 100% of gated features enforced
- Impersonation usage: Support tickets resolved faster
- Audit coverage: All critical actions logged
- Export usage: Track download frequency
- Webhook reliability: >99% delivery success rate
- API adoption: Developer signups and API calls

---
