# LineCare V4 - Implementation Plan

Building on V3 to add QR codes, PWA/offline capabilities, and trial/demo functionality for a complete SaaS experience.

## V4 Vision

Transform LineCare into a mobile-first, self-service SaaS platform that:
- **Enables instant breakdown reporting** via QR codes on machines
- **Works offline** for operators in areas with poor connectivity
- **Supports self-service trials** for prospect conversion
- **Provides demo environments** for sales and evaluation

---

## Current Status - V4 Progress
- [x] V1 MVP Complete ✅
- [x] V2 Complete (Spare Parts, OEE, Costs, Integrations, Analytics) ✅
- [x] V3 Complete (Feature Flags, Superadmin, Audit, Export, Webhooks) ✅
- [x] Phase 14 - QR Codes for Machines ✅
- [ ] Phase 15 - PWA & Offline Operator Flow
- [ ] Phase 16 - Trial & Demo Flow

---

## Phase 14: QR Codes for Machines

### 14.1 QR Code Foundation

**Goals:**
- Every machine gets a unique QR code
- Operator scans QR at machine → lands on "Report Breakdown" with machine pre-filled
- Works on mobile (preparation for PWA)
- Printable labels for physical machines

**Database Changes:**

- [ ] **Migration: Add `qr_token` to `machines` table**
  ```php
  Schema::table('machines', function (Blueprint $table) {
      $table->string('qr_token')->unique()->nullable()->after('status');
  });
  ```

- [ ] **Backfill Command: Generate tokens for existing machines**
  ```php
  // app/Console/Commands/GenerateMachineQrTokens.php
  class GenerateMachineQrTokens extends Command
  {
      protected $signature = 'machines:generate-qr-tokens';
      
      public function handle()
      {
          Machine::whereNull('qr_token')->each(function ($machine) {
              $machine->update(['qr_token' => Str::uuid()]);
          });
          
          $this->info('QR tokens generated for all machines.');
      }
  }
  ```

- [ ] **Auto-generate on Machine Creation**
  ```php
  // In Machine model boot method
  protected static function boot()
  {
      parent::boot();
      
      static::creating(function ($machine) {
          $machine->qr_token = $machine->qr_token ?? Str::uuid();
      });
  }
  ```

### 14.2 QR Scan Entry Route

**Public QR Route:**

- [ ] **Route: `GET /m/{qrToken}`**
  ```php
  // routes/web.php
  Route::get('/m/{qrToken}', [QrScanController::class, 'scan'])
      ->name('qr.scan');
  ```

- [ ] **QrScanController**
  ```php
  class QrScanController extends Controller
  {
      public function scan(string $qrToken)
      {
          $machine = Machine::where('qr_token', $qrToken)->firstOrFail();
          
          $targetUrl = route('work-orders.report-breakdown', [
              'machine_id' => $machine->id
          ]);
          
          // If not logged in, store intended URL and redirect to login
          if (!auth()->check()) {
              session(['url.intended' => $targetUrl]);
              return redirect()->route('login')
                  ->with('info', 'Log in om een storing te melden voor ' . $machine->name);
          }
          
          // Verify user belongs to same company (multi-tenant check)
          if (auth()->user()->company_id !== $machine->company_id) {
              abort(403, 'Je hebt geen toegang tot deze machine.');
          }
          
          return redirect($targetUrl);
      }
  }
  ```

### 14.3 QR Image Generation

**Server-Side QR Generation:**

- [ ] **Install QR Package**
  ```bash
  composer require simplesoftwareio/simple-qrcode
  ```

- [ ] **QR Image Routes**
  ```php
  Route::middleware(['auth'])->group(function () {
      Route::get('/machines/{machine}/qr-image', [MachineQrController::class, 'image'])
          ->name('machines.qr-image');
      Route::get('/machines/{machine}/qr-print', [MachineQrController::class, 'print'])
          ->name('machines.qr-print');
  });
  ```

- [ ] **MachineQrController**
  ```php
  use SimpleSoftwareIO\QrCode\Facades\QrCode;
  
  class MachineQrController extends Controller
  {
      public function image(Machine $machine)
      {
          $this->authorize('view', $machine);
          
          $url = route('qr.scan', $machine->qr_token);
          
          $qr = QrCode::format('svg')
              ->size(300)
              ->margin(2)
              ->generate($url);
          
          return response($qr)
              ->header('Content-Type', 'image/svg+xml');
      }
      
      public function print(Machine $machine)
      {
          $this->authorize('view', $machine);
          
          return Inertia::render('Machines/QrPrint', [
              'machine' => $machine->only(['id', 'name', 'location', 'qr_token']),
              'qrUrl' => route('machines.qr-image', $machine),
          ]);
      }
  }
  ```

### 14.4 QR Code UI

**Machine Detail Page - QR Section:**

- [ ] **Add QR section to `machines/show.tsx`**
  ```tsx
  function MachineQrSection({ machine }: { machine: Machine }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code
          </CardTitle>
          <CardDescription>
            Scan deze QR-code om direct een storing te melden
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <img 
            src={`/machines/${machine.id}/qr-image`}
            alt={`QR code voor ${machine.name}`}
            className="w-64 h-64 border rounded-lg p-2 bg-white"
          />
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href={`/machines/${machine.id}/qr-image`} download={`qr-${machine.name}.svg`}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/machines/${machine.id}/qr-print`} target="_blank">
                <Printer className="w-4 h-4 mr-2" />
                Print Label
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  ```

**Print Label Page:**

- [ ] **Create `resources/js/pages/machines/qr-print.tsx`**
  ```tsx
  export default function QrPrint({ machine, qrUrl }: Props) {
    useEffect(() => {
      window.print();
    }, []);
    
    return (
      <div className="print:m-0 p-8 flex flex-col items-center">
        <style>{`
          @media print {
            @page { size: 62mm 100mm; margin: 5mm; }
            body { -webkit-print-color-adjust: exact; }
          }
        `}</style>
        
        <div className="border-2 border-dashed p-4 rounded-lg print:border-solid">
          <img src="/logo.svg" alt="Logo" className="h-8 mx-auto mb-2" />
          
          <h1 className="text-lg font-bold text-center mb-2">
            {machine.name}
          </h1>
          
          {machine.location && (
            <p className="text-sm text-center text-muted-foreground mb-3">
              {machine.location}
            </p>
          )}
          
          <img src={qrUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
          
          <p className="text-xs text-center mt-3 text-muted-foreground">
            Scan om storing te melden
          </p>
        </div>
      </div>
    );
  }
  ```

**Bulk QR Print Page (Optional):**

- [ ] **Create `resources/js/pages/machines/qr-bulk-print.tsx`**
  - Select multiple machines
  - Print all labels on one page
  - Grid layout for label sheets

### 14.5 Stappenplan Phase 14

| # | Task | Status |
|---|------|--------|
| 1 | Install `simplesoftwareio/simple-qrcode` package | [x] |
| 2 | Migration: add `qr_token` to machines | [x] |
| 3 | Add `qr_token` auto-generation in Machine model boot | [x] |
| 4 | Create `machines:generate-qr-tokens` command | [x] |
| 5 | Run command to backfill existing machines | [x] |
| 6 | Create `QrScanController` with scan method | [x] |
| 7 | Register public route `GET /m/{qrToken}` | [x] |
| 8 | Create `MachineQrController` with image/print methods | [x] |
| 9 | Register authenticated QR routes | [x] |
| 10 | Add QR section to machine detail page | [x] |
| 11 | Create QR print label page | [x] |
| 12 | Test full flow: scan → login → breakdown form | [x] |
| 13 | (Optional) Create bulk print page | [ ] |

---

## Phase 15: PWA & Offline Operator Flow

### 15.1 PWA Foundation

**Goals:**
- App installable on mobile home screen
- Breakdown form works offline
- Queued submissions sync when back online
- Focus on "Report Breakdown" - rest of app can require connection

**PWA Manifest:**

- [ ] **Create `public/manifest.json`**
  ```json
  {
    "name": "LineCare - Maintenance Management",
    "short_name": "LineCare",
    "description": "CMMS voor onderhoudsbeheer",
    "start_url": "/dashboard",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#0f172a",
    "orientation": "portrait-primary",
    "icons": [
      {
        "src": "/icons/icon-72x72.png",
        "sizes": "72x72",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-96x96.png",
        "sizes": "96x96",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-128x128.png",
        "sizes": "128x128",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-144x144.png",
        "sizes": "144x144",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-152x152.png",
        "sizes": "152x152",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-384x384.png",
        "sizes": "384x384",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }
  ```

- [ ] **Add manifest link to layout**
  ```html
  <!-- resources/views/app.blade.php -->
  <head>
      <link rel="manifest" href="/manifest.json">
      <meta name="theme-color" content="#0f172a">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png">
  </head>
  ```

### 15.2 Service Worker

- [ ] **Create `public/service-worker.js`**
  ```javascript
  const CACHE_NAME = 'linecare-v1';
  const OFFLINE_URL = '/offline';
  
  const PRECACHE_URLS = [
    '/',
    '/offline',
    '/work-orders/report-breakdown',
    '/build/assets/app.css',
    '/build/assets/app.js',
    '/icons/icon-192x192.png',
  ];
  
  // Install: cache essential files
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(PRECACHE_URLS);
      })
    );
    self.skipWaiting();
  });
  
  // Activate: clean old caches
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME)
              .map((key) => caches.delete(key))
        );
      })
    );
    self.clients.claim();
  });
  
  // Fetch: network-first for API, cache-first for assets
  self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // API requests: network only
    if (url.pathname.startsWith('/api/')) return;
    
    // HTML pages: network first, fallback to cache
    if (request.headers.get('Accept')?.includes('text/html')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
            return response;
          })
          .catch(() => caches.match(request) || caches.match(OFFLINE_URL))
      );
      return;
    }
    
    // Assets: cache first
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        });
      })
    );
  });
  ```

- [ ] **Register service worker in app**
  ```tsx
  // resources/js/app.tsx
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => console.log('SW registered:', reg.scope))
        .catch((err) => console.error('SW registration failed:', err));
    });
  }
  ```

### 15.3 Offline Queue System

**Offline Queue Helper:**

- [ ] **Create `resources/js/lib/offline-queue.ts`**
  ```typescript
  import { v4 as uuidv4 } from 'uuid';
  
  export interface QueuedBreakdown {
    id: string;
    machine_id: number;
    description: string;
    cause_category_id?: number;
    breakdown_start_at: string;
    queued_at: string;
    synced: boolean;
  }
  
  const STORAGE_KEY = 'offline_breakdowns';
  
  export function getQueue(): QueuedBreakdown[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
  
  export function addToQueue(breakdown: Omit<QueuedBreakdown, 'id' | 'queued_at' | 'synced'>): QueuedBreakdown {
    const queue = getQueue();
    const entry: QueuedBreakdown = {
      ...breakdown,
      id: uuidv4(),
      queued_at: new Date().toISOString(),
      synced: false,
    };
    queue.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    return entry;
  }
  
  export function removeFromQueue(id: string): void {
    const queue = getQueue().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  }
  
  export function clearQueue(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
  
  export async function processQueue(): Promise<{ success: number; failed: number }> {
    const queue = getQueue();
    const pending = queue.filter((item) => !item.synced);
    
    let success = 0;
    let failed = 0;
    
    for (const item of pending) {
      try {
        const response = await fetch('/api/work-orders/breakdown', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          body: JSON.stringify({
            machine_id: item.machine_id,
            description: item.description,
            cause_category_id: item.cause_category_id,
            breakdown_start_at: item.breakdown_start_at,
            client_uuid: item.id, // For deduplication
          }),
        });
        
        if (response.ok) {
          removeFromQueue(item.id);
          success++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }
    
    return { success, failed };
  }
  
  export function getPendingCount(): number {
    return getQueue().filter((item) => !item.synced).length;
  }
  ```

### 15.4 Online/Offline Detection

**Network Status Hook:**

- [ ] **Create `resources/js/hooks/use-network-status.ts`**
  ```typescript
  import { useState, useEffect } from 'react';
  
  export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(
      typeof navigator !== 'undefined' ? navigator.onLine : true
    );
    
    useEffect(() => {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);
    
    return isOnline;
  }
  ```

**Offline Banner Component:**

- [ ] **Create `resources/js/components/offline-banner.tsx`**
  ```tsx
  import { WifiOff, RefreshCw } from 'lucide-react';
  import { useNetworkStatus } from '@/hooks/use-network-status';
  import { getPendingCount, processQueue } from '@/lib/offline-queue';
  import { useState, useEffect } from 'react';
  
  export function OfflineBanner() {
    const isOnline = useNetworkStatus();
    const [pendingCount, setPendingCount] = useState(0);
    const [syncing, setSyncing] = useState(false);
    
    useEffect(() => {
      setPendingCount(getPendingCount());
    }, [isOnline]);
    
    useEffect(() => {
      if (isOnline && pendingCount > 0) {
        syncQueue();
      }
    }, [isOnline]);
    
    const syncQueue = async () => {
      setSyncing(true);
      const result = await processQueue();
      setPendingCount(getPendingCount());
      setSyncing(false);
      
      if (result.success > 0) {
        toast.success(`${result.success} melding(en) verstuurd`);
      }
    };
    
    if (isOnline && pendingCount === 0) return null;
    
    return (
      <div className={`px-4 py-2 text-sm flex items-center justify-between ${
        isOnline ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
      }`}>
        <div className="flex items-center gap-2">
          {!isOnline && <WifiOff className="w-4 h-4" />}
          {!isOnline ? (
            <span>Je bent offline. Meldingen worden opgeslagen.</span>
          ) : pendingCount > 0 ? (
            <span>{pendingCount} melding(en) wachten op verzending</span>
          ) : null}
        </div>
        
        {isOnline && pendingCount > 0 && (
          <button
            onClick={syncQueue}
            disabled={syncing}
            className="flex items-center gap-1 text-yellow-900 hover:underline"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Verzenden...' : 'Nu verzenden'}
          </button>
        )}
      </div>
    );
  }
  ```

### 15.5 Offline Breakdown Form

**Enhanced Breakdown Form:**

- [ ] **Update `resources/js/pages/work-orders/report-breakdown.tsx`**
  ```tsx
  import { useNetworkStatus } from '@/hooks/use-network-status';
  import { addToQueue, processQueue } from '@/lib/offline-queue';
  
  export default function ReportBreakdown({ machines, causeCategories, machineId }: Props) {
    const isOnline = useNetworkStatus();
    const [submitting, setSubmitting] = useState(false);
    
    const form = useForm({
      machine_id: machineId || '',
      description: '',
      cause_category_id: '',
      breakdown_start_at: new Date().toISOString().slice(0, 16),
    });
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      
      if (!isOnline) {
        // Queue for later
        addToQueue({
          machine_id: Number(form.data.machine_id),
          description: form.data.description,
          cause_category_id: form.data.cause_category_id 
            ? Number(form.data.cause_category_id) 
            : undefined,
          breakdown_start_at: form.data.breakdown_start_at,
        });
        
        toast.success('Melding opgeslagen. Wordt verstuurd zodra je weer online bent.');
        form.reset();
        setSubmitting(false);
        return;
      }
      
      // Normal online submission
      form.post('/api/work-orders/breakdown', {
        onSuccess: () => {
          toast.success('Storing gemeld!');
          router.visit('/work-orders');
        },
        onFinish: () => setSubmitting(false),
      });
    };
    
    return (
      <form onSubmit={handleSubmit}>
        {!isOnline && (
          <Alert variant="warning" className="mb-4">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              Je bent offline. De melding wordt opgeslagen en automatisch verstuurd
              zodra je weer verbinding hebt.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Form fields... */}
        
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Bezig...' : isOnline ? 'Verstuur melding' : 'Opslaan (offline)'}
        </Button>
      </form>
    );
  }
  ```

### 15.6 Backend: Deduplication

- [ ] **Add `client_uuid` to work_orders table**
  ```php
  Schema::table('work_orders', function (Blueprint $table) {
      $table->string('client_uuid')->nullable()->after('id');
      $table->unique(['company_id', 'client_uuid']);
  });
  ```

- [ ] **Handle deduplication in controller**
  ```php
  public function storeBreakdown(Request $request)
  {
      $validated = $request->validate([
          'machine_id' => 'required|exists:machines,id',
          'description' => 'required|string|max:1000',
          'cause_category_id' => 'nullable|exists:cause_categories,id',
          'breakdown_start_at' => 'required|date',
          'client_uuid' => 'nullable|string|max:36',
      ]);
      
      // Check for duplicate (offline resubmission)
      if ($request->client_uuid) {
          $existing = WorkOrder::where('company_id', auth()->user()->company_id)
              ->where('client_uuid', $request->client_uuid)
              ->first();
              
          if ($existing) {
              return response()->json($existing, 200); // Return existing, don't create duplicate
          }
      }
      
      $workOrder = WorkOrder::create([
          'company_id' => auth()->user()->company_id,
          'machine_id' => $validated['machine_id'],
          'title' => 'Storing: ' . Str::limit($validated['description'], 50),
          'description' => $validated['description'],
          'type' => 'breakdown',
          'status' => 'open',
          'priority' => 'high',
          'cause_category_id' => $validated['cause_category_id'],
          'breakdown_start_at' => $validated['breakdown_start_at'],
          'client_uuid' => $request->client_uuid,
          'reported_by' => auth()->id(),
      ]);
      
      return response()->json($workOrder, 201);
  }
  ```

### 15.7 Stappenplan Phase 15

| # | Task | Status |
|---|------|--------|
| 1 | Create app icons (72-512px) in `/public/icons/` | [ ] |
| 2 | Create `manifest.json` | [ ] |
| 3 | Add manifest and meta tags to layout | [ ] |
| 4 | Create `service-worker.js` | [ ] |
| 5 | Register service worker in app.tsx | [ ] |
| 6 | Create offline queue utility (`offline-queue.ts`) | [ ] |
| 7 | Create `useNetworkStatus` hook | [ ] |
| 8 | Create `OfflineBanner` component | [ ] |
| 9 | Add banner to app layout | [ ] |
| 10 | Update breakdown form with offline support | [ ] |
| 11 | Migration: add `client_uuid` to work_orders | [ ] |
| 12 | Update breakdown controller with deduplication | [ ] |
| 13 | Create offline fallback page | [ ] |
| 14 | Test PWA install on mobile | [ ] |
| 15 | Test offline → online sync flow | [ ] |

---

## Phase 16: Trial & Demo Flow

### 16.1 Trial System Foundation

**Goals:**
- Visitors can self-signup for 14-day trial
- Trial creates company + manager user + demo data
- In-app banner shows remaining trial days
- Expired trials get read-only access with upgrade prompt
- Superadmin can extend trials

**Database Changes:**

- [ ] **Migration: Add trial fields to `companies` table**
  ```php
  Schema::table('companies', function (Blueprint $table) {
      $table->boolean('is_trial')->default(false)->after('feature_flags');
      $table->timestamp('trial_ends_at')->nullable()->after('is_trial');
      $table->boolean('is_demo')->default(false)->after('trial_ends_at');
      $table->enum('status', ['active', 'trial', 'expired', 'suspended'])
          ->default('active')->after('is_demo');
  });
  ```

### 16.2 Trial Signup Flow

**Public Routes:**

- [ ] **Trial signup routes**
  ```php
  // routes/web.php
  Route::get('/trial', [TrialController::class, 'create'])->name('trial.create');
  Route::post('/trial', [TrialController::class, 'store'])->name('trial.store');
  ```

- [ ] **TrialController**
  ```php
  class TrialController extends Controller
  {
      public function create()
      {
          return Inertia::render('Trial/Signup');
      }
      
      public function store(Request $request)
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
                  'status' => 'trial',
                  'industry' => $validated['industry'],
                  'company_size' => $validated['company_size'],
              ]);
              
              // Create manager user
              $user = User::create([
                  'company_id' => $company->id,
                  'name' => $validated['name'],
                  'email' => $validated['email'],
                  'password' => Hash::make($validated['password']),
                  'role' => 'manager',
              ]);
              
              // Seed demo data for the trial
              $this->seedTrialData($company);
              
              // Log in the new user
              Auth::login($user);
          });
          
          return redirect()->route('dashboard')
              ->with('success', 'Welkom! Je hebt 14 dagen om LineCare te proberen.');
      }
      
      protected function seedTrialData(Company $company): void
      {
          // Create sample locations
          $locations = ['Productiehal A', 'Productiehal B', 'Magazijn'];
          foreach ($locations as $loc) {
              Location::create(['company_id' => $company->id, 'name' => $loc]);
          }
          
          // Create sample machines
          $machines = [
              ['name' => 'CNC Freesmachine 1', 'location' => 'Productiehal A'],
              ['name' => 'Lasersnijder', 'location' => 'Productiehal A'],
              ['name' => 'Verpakkingslijn 1', 'location' => 'Productiehal B'],
              ['name' => 'Heftruk 1', 'location' => 'Magazijn'],
          ];
          
          foreach ($machines as $m) {
              Machine::create([
                  'company_id' => $company->id,
                  'name' => $m['name'],
                  'location' => $m['location'],
                  'status' => 'operational',
              ]);
          }
          
          // Create sample cause categories
          $categories = ['Mechanisch', 'Elektrisch', 'Software', 'Operator fout'];
          foreach ($categories as $cat) {
              CauseCategory::create(['company_id' => $company->id, 'name' => $cat]);
          }
      }
  }
  ```

### 16.3 Trial Middleware & Guards

- [ ] **Create `EnsureTrialNotExpired` middleware**
  ```php
  // app/Http/Middleware/EnsureTrialNotExpired.php
  class EnsureTrialNotExpired
  {
      public function handle(Request $request, Closure $next)
      {
          $user = $request->user();
          
          if (!$user) {
              return $next($request);
          }
          
          $company = $user->company;
          
          // Check if trial has expired
          if ($company->is_trial && $company->trial_ends_at?->isPast()) {
              // Allow certain routes even when expired
              $allowedRoutes = ['trial.expired', 'logout', 'contact'];
              
              if (!in_array($request->route()->getName(), $allowedRoutes)) {
                  return redirect()->route('trial.expired');
              }
          }
          
          return $next($request);
      }
  }
  ```

- [ ] **Register middleware in Kernel**
  ```php
  // Apply to web group or specific routes
  protected $middlewareGroups = [
      'web' => [
          // ... other middleware
          \App\Http\Middleware\EnsureTrialNotExpired::class,
      ],
  ];
  ```

### 16.4 Trial UI Components

**Trial Banner:**

- [ ] **Create `resources/js/components/trial-banner.tsx`**
  ```tsx
  interface Props {
    company: {
      is_trial: boolean;
      trial_ends_at: string | null;
    };
  }
  
  export function TrialBanner({ company }: Props) {
    if (!company.is_trial || !company.trial_ends_at) return null;
    
    const endDate = new Date(company.trial_ends_at);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 0) return null; // Middleware handles expired
    
    const isUrgent = daysLeft <= 3;
    
    return (
      <div className={`px-4 py-2 text-sm flex items-center justify-between ${
        isUrgent ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      }`}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>
            Trial: nog <strong>{daysLeft}</strong> {daysLeft === 1 ? 'dag' : 'dagen'} over
          </span>
        </div>
        <Button size="sm" variant={isUrgent ? 'destructive' : 'default'} asChild>
          <Link href="/contact">
            {isUrgent ? 'Upgrade nu' : 'Neem contact op'}
          </Link>
        </Button>
      </div>
    );
  }
  ```

**Trial Expired Page:**

- [ ] **Create `resources/js/pages/trial/expired.tsx`**
  ```tsx
  export default function TrialExpired({ company }: Props) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle>Je proefperiode is verlopen</CardTitle>
            <CardDescription>
              Je trial van LineCare is op {formatDate(company.trial_ends_at)} geëindigd.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Je data blijft veilig bewaard. Neem contact met ons op om je account
              te activeren en verder te gaan waar je gebleven was.
            </p>
            
            <div className="flex flex-col gap-2">
              <Button asChild>
                <a href="mailto:sales@linecare.nl">
                  <Mail className="w-4 h-4 mr-2" />
                  Neem contact op
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://wa.me/31612345678">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/logout" method="post">
                  Uitloggen
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  ```

**Trial Signup Page:**

- [ ] **Create `resources/js/pages/trial/signup.tsx`**
  ```tsx
  export default function TrialSignup() {
    const form = useForm({
      company_name: '',
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      industry: '',
      company_size: '',
    });
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      form.post('/trial');
    };
    
    return (
      <div className="min-h-screen flex">
        {/* Left: Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Start je gratis trial</CardTitle>
              <CardDescription>
                14 dagen gratis toegang tot alle functies. Geen creditcard nodig.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="company_name">Bedrijfsnaam</Label>
                  <Input
                    id="company_name"
                    value={form.data.company_name}
                    onChange={(e) => form.setData('company_name', e.target.value)}
                  />
                  <InputError message={form.errors.company_name} />
                </div>
                
                <div>
                  <Label htmlFor="name">Je naam</Label>
                  <Input
                    id="name"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                  />
                  <InputError message={form.errors.name} />
                </div>
                
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                  />
                  <InputError message={form.errors.email} />
                </div>
                
                <div>
                  <Label htmlFor="password">Wachtwoord</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                  />
                  <InputError message={form.errors.password} />
                </div>
                
                <div>
                  <Label htmlFor="password_confirmation">Bevestig wachtwoord</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={form.data.password_confirmation}
                    onChange={(e) => form.setData('password_confirmation', e.target.value)}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={form.processing}>
                  {form.processing ? 'Bezig...' : 'Start gratis trial'}
                </Button>
              </form>
              
              <p className="text-sm text-muted-foreground text-center mt-4">
                Al een account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Right: Benefits */}
        <div className="hidden lg:flex flex-1 bg-primary text-primary-foreground p-12 items-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-6">Wat je krijgt:</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 mt-0.5 text-green-400" />
                <span>Onbeperkt machines en werkorders</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 mt-0.5 text-green-400" />
                <span>Preventief onderhoud planning</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 mt-0.5 text-green-400" />
                <span>QR-codes voor snelle storingsmeldingen</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 mt-0.5 text-green-400" />
                <span>Rapporten en analytics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  ```

### 16.5 Superadmin Trial Management

- [ ] **Add trial management to AdminCompanyController**
  ```php
  public function extendTrial(Company $company, Request $request)
  {
      $validated = $request->validate([
          'days' => 'required|integer|min:1|max:90',
      ]);
      
      $company->update([
          'trial_ends_at' => ($company->trial_ends_at ?? now())->addDays($validated['days']),
      ]);
      
      return back()->with('success', "Trial verlengd met {$validated['days']} dagen.");
  }
  
  public function convertToPaid(Company $company, Request $request)
  {
      $validated = $request->validate([
          'plan' => 'required|in:basic,pro,enterprise',
      ]);
      
      $company->update([
          'is_trial' => false,
          'trial_ends_at' => null,
          'status' => 'active',
          'plan' => $validated['plan'],
      ]);
      
      return back()->with('success', 'Company omgezet naar betaald account.');
  }
  ```

- [ ] **Update admin company detail UI with trial actions**

### 16.6 Demo Environment (Optional)

**Demo Company Setup:**

- [ ] **Create demo seeder**
  ```php
  // database/seeders/DemoCompanySeeder.php
  class DemoCompanySeeder extends Seeder
  {
      public function run()
      {
          // Create or update demo company
          $company = Company::updateOrCreate(
              ['is_demo' => true],
              [
                  'name' => 'Demo Bedrijf',
                  'plan' => 'enterprise',
                  'is_trial' => false,
                  'is_demo' => true,
                  'status' => 'active',
              ]
          );
          
          // Create demo user
          User::updateOrCreate(
              ['email' => 'demo@linecare.nl'],
              [
                  'company_id' => $company->id,
                  'name' => 'Demo Gebruiker',
                  'password' => Hash::make('demo'),
                  'role' => 'manager',
              ]
          );
          
          // Seed extensive demo data
          $this->seedLocations($company);
          $this->seedMachines($company);
          $this->seedWorkOrders($company);
          $this->seedSpareParts($company);
          // ... more realistic data
      }
  }
  ```

- [ ] **Demo login route**
  ```php
  Route::post('/demo-login', function () {
      $demoUser = User::whereHas('company', fn($q) => $q->where('is_demo', true))
          ->where('role', 'manager')
          ->firstOrFail();
      
      Auth::login($demoUser);
      
      return redirect()->route('dashboard')
          ->with('info', 'Je bent ingelogd in de demo-omgeving.');
  })->name('demo.login');
  ```

- [ ] **Daily demo reset command**
  ```php
  // app/Console/Commands/ResetDemoEnvironment.php
  class ResetDemoEnvironment extends Command
  {
      protected $signature = 'demo:reset';
      
      public function handle()
      {
          $demoCompany = Company::where('is_demo', true)->first();
          
          if (!$demoCompany) {
              $this->error('No demo company found.');
              return;
          }
          
          // Delete all data except users
          WorkOrder::where('company_id', $demoCompany->id)->delete();
          Machine::where('company_id', $demoCompany->id)->delete();
          // ... delete other related data
          
          // Re-seed
          $this->call(DemoCompanySeeder::class);
          
          $this->info('Demo environment reset complete.');
      }
  }
  ```

- [ ] **Schedule daily reset**
  ```php
  // app/Console/Kernel.php
  protected function schedule(Schedule $schedule)
  {
      $schedule->command('demo:reset')->dailyAt('03:00');
  }
  ```

### 16.7 Trial Reminder Notifications

- [ ] **Create trial reminder job**
  ```php
  // app/Jobs/SendTrialReminderEmails.php
  class SendTrialReminderEmails implements ShouldQueue
  {
      public function handle()
      {
          // 3 days remaining
          $this->sendReminders(3, 'Je trial loopt over 3 dagen af');
          
          // 1 day remaining
          $this->sendReminders(1, 'Je trial loopt morgen af');
          
          // Just expired
          $this->sendExpiredNotices();
      }
      
      protected function sendReminders(int $daysLeft, string $subject)
      {
          Company::where('is_trial', true)
              ->whereDate('trial_ends_at', now()->addDays($daysLeft))
              ->with('users')
              ->each(function ($company) use ($subject) {
                  $managers = $company->users->where('role', 'manager');
                  foreach ($managers as $manager) {
                      Mail::to($manager)->send(new TrialReminderMail($company, $subject));
                  }
              });
      }
  }
  ```

- [ ] **Schedule daily**
  ```php
  $schedule->job(new SendTrialReminderEmails)->dailyAt('09:00');
  ```

### 16.8 Stappenplan Phase 16

| # | Task | Status |
|---|------|--------|
| 1 | Migration: add `is_trial`, `trial_ends_at`, `is_demo`, `status` to companies | [ ] |
| 2 | Create TrialController with create/store methods | [ ] |
| 3 | Create trial signup page | [ ] |
| 4 | Implement trial data seeding | [ ] |
| 5 | Create `EnsureTrialNotExpired` middleware | [ ] |
| 6 | Register middleware in Kernel | [ ] |
| 7 | Create TrialBanner component | [ ] |
| 8 | Add banner to app layout | [ ] |
| 9 | Create trial expired page | [ ] |
| 10 | Add trial routes | [ ] |
| 11 | Add trial extend/convert actions to superadmin | [ ] |
| 12 | Update admin company detail with trial management | [ ] |
| 13 | Create trial reminder email templates | [ ] |
| 14 | Create SendTrialReminderEmails job | [ ] |
| 15 | Schedule reminder job | [ ] |
| 16 | (Optional) Create DemoCompanySeeder | [ ] |
| 17 | (Optional) Create demo login route | [ ] |
| 18 | (Optional) Create demo:reset command | [ ] |
| 19 | Test full trial signup → expiry flow | [ ] |

---

## Implementation Priority Matrix

### High Priority (User Acquisition)
1. **Phase 16** - Trial & Demo Flow
   - Essential for self-service signups
   - Enables sales demos
   - Quick path to paying customers

### Medium Priority (User Experience)
2. **Phase 14** - QR Codes
   - High value for operators
   - Simple implementation
   - Visible differentiator

3. **Phase 15** - PWA & Offline
   - Important for factory floors
   - Improves reliability
   - More complex implementation

---

## Technical Considerations

### Performance
- [ ] QR images should be cached (browser caching headers)
- [ ] Service worker cache versioning strategy
- [ ] Offline queue size limits (prevent localStorage overflow)

### Security
- [ ] QR tokens should be unguessable (UUID v4)
- [ ] Trial signup rate limiting (prevent abuse)
- [ ] Demo environment isolation (no real company data exposure)
- [ ] Validate company ownership in QR scan flow

### Testing
- [ ] QR scan flow (logged in/out, correct/wrong company)
- [ ] Offline queue sync (single item, multiple items, duplicates)
- [ ] Trial expiry edge cases (timezone handling)
- [ ] PWA install on iOS and Android

### Mobile
- [ ] Test QR scanning with native camera apps
- [ ] Test PWA install prompts
- [ ] Verify offline banner visibility
- [ ] Touch-friendly form inputs

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 14 - QR Codes | 1 week | None |
| Phase 15 - PWA & Offline | 1.5 weeks | None |
| Phase 16 - Trial & Demo | 1.5 weeks | None |

**Total V4 Development: 4 weeks**

---

## Success Metrics

- **QR Codes:**
  - % of breakdown reports via QR scan
  - Time from scan to submitted report
  - QR label print count

- **PWA & Offline:**
  - PWA install rate
  - Offline submissions successfully synced
  - Average sync delay

- **Trial & Demo:**
  - Trial signup conversion rate
  - Trial → paid conversion rate
  - Average trial duration before conversion
  - Demo login frequency

---

## Migration Notes from V3

### No Breaking Changes
- V4 features are additive
- Existing companies unaffected (is_trial = false)
- QR tokens backfilled with command
- PWA opt-in (users choose to install)

### Recommended Rollout
1. Deploy Phase 14 (QR) first → immediate value
2. Deploy Phase 16 (Trial) → start collecting signups
3. Deploy Phase 15 (PWA) → announce to existing users
