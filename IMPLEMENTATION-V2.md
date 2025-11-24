# LineCare V2 - Implementation Plan

Building on the MVP foundation to create a comprehensive CMMS with spare parts, OEE tracking, cost management, and integrations.

## V2 Vision

Transform LineCare from a basic maintenance tracker into a full-featured CMMS that:
- **Manages spare parts inventory** with automatic reordering
- **Tracks OEE metrics** (Availability, Performance, Quality)
- **Monitors costs** (labor, parts, downtime impact)
- **Integrates with external systems** (ERP, IoT sensors, vendors)
- **Provides advanced analytics** for data-driven decision making

---

## Current Status - V2 Progress
- [x] MVP Complete (Phases 1-4) ✅
- [x] Phase 5 - Spare Parts Management ✅ **COMPLETE**
- [x] Phase 6 - OEE & Performance Tracking ✅ **COMPLETE**
- [ ] Phase 7 - Cost Management
- [ ] Phase 8 - Integrations & Automation
- [ ] Phase 9 - Advanced Analytics & Mobile

---

## Phase 5: Spare Parts Management

### 5.1 Core Spare Parts System

**New Models:**
- [x] **SparePart** model and migration ✅
  - Fields: company_id, part_number, name, description, category_id, manufacturer, supplier_id, unit_of_measure, unit_cost, reorder_point, reorder_quantity, lead_time_days, location, image_url, is_critical, status (active/discontinued), created_at, updated_at
- [x] **PartCategory** model ✅
  - Fields: company_id, name, description, parent_category_id (for nested categories)
- [x] **Supplier** model ✅
  - Fields: company_id, name, contact_person, email, phone, address, website, notes, is_preferred
- [x] **InventoryTransaction** model ✅
  - Fields: company_id, spare_part_id, transaction_type (in/out/adjustment), quantity, unit_cost, reference_type (work_order/purchase_order/adjustment), reference_id, user_id, notes, transaction_date
- [x] **Stock** model (current inventory levels) ✅
  - Fields: company_id, spare_part_id, location_id, quantity_on_hand, quantity_reserved, quantity_available (computed), last_counted_at
- [x] **PurchaseOrder** model ✅
  - Fields: company_id, supplier_id, po_number, status (draft/sent/received/cancelled), order_date, expected_delivery_date, received_date, total_cost, notes, created_by
- [x] **Notification** model ✅
  - Fields: user_id, type, title, message, link, is_read, read_at

**Relationships:**
- [x] SparePart → hasMany InventoryTransactions ✅
- [x] SparePart → hasMany Stocks (per location) ✅
- [x] SparePart → belongsTo Supplier ✅
- [x] SparePart → belongsTo PartCategory ✅
- [x] WorkOrder → belongsToMany SpareParts (parts used) ✅
- [x] PurchaseOrder → belongsToMany SpareParts (with quantity, unit_cost) ✅

### 5.2 Inventory Management APIs

**API Endpoints:**
- [x] GET `/api/spare-parts` - List spare parts ✅
  - Query params: category_id, supplier_id, low_stock (below reorder point), critical_only, search
  - Output: list with current stock levels, location
- [x] POST `/api/spare-parts` - Create spare part ✅
- [x] GET `/api/spare-parts/{id}` - Detail with stock levels per location ✅
- [x] PUT `/api/spare-parts/{id}` - Update spare part ✅
- [x] DELETE `/api/spare-parts/{id}` - Archive spare part ✅

- [x] GET `/api/spare-parts/{id}/transactions` - Transaction history ✅
- [x] POST `/api/spare-parts/{id}/adjust-stock` - Manual stock adjustment ✅
  - Input: location_id, quantity (+ or -), reason, notes
  - Creates InventoryTransaction with type=adjustment

- [x] GET `/api/inventory/low-stock` - Parts below reorder point ✅
- [x] GET `/api/inventory/stock-levels` - Current stock by location ✅
- [x] POST `/api/inventory/stock-count` - Physical count update ✅
  - Input: [{spare_part_id, location_id, counted_quantity}]
  - Creates adjustment transactions for discrepancies
- [x] GET `/api/inventory/valuation` - Inventory valuation ✅
- [x] GET `/api/inventory/movements` - Transaction history with filters ✅
- [x] GET `/api/inventory/usage-report` - Parts usage analytics ✅

### 5.3 Purchase Orders & Procurement

**API Endpoints:**
- [x] GET `/api/purchase-orders` - List POs ✅
  - Filter: status, supplier_id, date_range
- [x] POST `/api/purchase-orders` - Create PO ✅
  - Input: supplier_id, parts [{spare_part_id, quantity, unit_cost}], expected_delivery_date
  - Auto-generate PO number
- [x] GET `/api/purchase-orders/{id}` - PO detail with line items ✅
- [x] PUT `/api/purchase-orders/{id}` - Update PO (draft only) ✅
- [x] POST `/api/purchase-orders/{id}/send` - Send to supplier (draft → sent) ✅
- [x] POST `/api/purchase-orders/{id}/receive` - Receive shipment ✅
  - Input: received_parts [{spare_part_id, quantity_received}], received_date
  - Creates InventoryTransactions (type=in) for each part
  - Updates Stock quantities
  - Changes PO status to received
- [x] POST `/api/purchase-orders/{id}/cancel` - Cancel PO ✅

**Additional APIs:**
- [x] GET `/api/suppliers` - List suppliers ✅
- [x] POST `/api/suppliers` - Create supplier ✅
- [x] GET/PUT/DELETE `/api/suppliers/{id}` ✅
- [x] GET `/api/part-categories` - List categories ✅
- [x] POST `/api/part-categories` - Create category ✅
- [x] GET/PUT/DELETE `/api/part-categories/{id}` ✅

**Automated Reordering:**
- [x] Daily scheduled job: Check parts below reorder point ✅
  - Generate draft POs for low-stock critical parts
  - Group by supplier
  - Notify managers
- [x] Command: `inventory:check-low-stock` ✅
- [x] Scheduled daily at 7:00 AM ✅

### 5.4 Parts Usage in Work Orders

**Enhanced WorkOrder System:**
- [x] Add many-to-many relationship: WorkOrder ↔ SpareParts ✅
  - Pivot table: `work_order_spare_parts` with fields: work_order_id, spare_part_id, quantity_used, unit_cost, location_id
- [x] When completing work order, technician can add parts used: ✅
  - Search/select spare parts
  - Enter quantity used
  - System automatically creates InventoryTransaction (type=out)
  - Updates Stock quantity
  - Calculates total parts cost for the work order

**API Updates:**
- [x] POST `/api/work-orders/{id}/add-parts` - Add parts to work order ✅
  - Input: [{spare_part_id, quantity, location_id}]
  - Validates: part exists, sufficient stock
  - Reserves stock (quantity_reserved increases)
- [x] POST `/api/work-orders/{id}/remove-parts` - Remove parts from work order ✅
- [x] POST `/api/work-orders/{id}/complete-with-parts` - Enhanced to consume reserved parts ✅
  - Converts reserved quantity to used
  - Creates out transactions

**Notifications:**
- [x] GET `/api/notifications` - List user notifications ✅
- [x] GET `/api/notifications/unread-count` - Badge count ✅
- [x] POST `/api/notifications/{id}/mark-read` - Mark as read ✅
- [x] POST `/api/notifications/mark-all-read` - Mark all as read ✅
- [x] DELETE `/api/notifications/{id}` - Delete notification ✅

### 5.5 Spare Parts UI

**Screens:**
- [x] Spare parts list (`resources/js/pages/spare-parts/index.tsx`) ✅
  - Table with part number, name, category, current stock, reorder point
  - Stock level indicators (green/yellow/red)
  - Filters: category, supplier, low stock toggle
  - Quick actions: adjust stock, create PO
- [x] Sidebar navigation with "Inventory" section ✅
  - Spare Parts, Low Stock Alerts, Purchase Orders, Suppliers
- [x] Web routes configured ✅
- [x] SparePartController with index, create, show, edit methods ✅
  
- [x] Spare part detail (`resources/js/pages/spare-parts/show.tsx`) ✅
  - Part info card
  - Stock levels by location (table)
  - Low stock alert banner
  - Supplier information section
  - Stock summary with on-hand/reserved/available

- [x] Add/edit spare part form (`resources/js/pages/spare-parts/create.tsx` & `edit.tsx`) ✅
  - Basic info: part number, name, description
  - Inventory: unit cost, reorder point, reorder quantity
  - Supplier and category dropdowns
  - Critical part toggle
  - Status dropdown (active/discontinued)
  - Full validation and error handling

- [x] Low stock alerts page (`resources/js/pages/inventory/low-stock.tsx`) ✅
  - List of parts below reorder point
  - Recommended order quantities
  - Grouped by supplier with totals
  - Quick "Create PO" action per supplier
  - Critical parts highlighted

- [x] Purchase orders list (`resources/js/pages/purchase-orders/index.tsx`) ✅
  - Table with PO number, supplier, status, total cost
  - Filter by status, supplier
  - Pagination support
  - Status badges
  
- [x] PO creation (`resources/js/pages/purchase-orders/create.tsx`) ✅
  - Dynamic line items with add/remove
  - Part selection with auto-fill unit cost
  - Real-time total calculation
  - Supplier and delivery date selection
  - Pre-fill support from low stock alerts

- [x] PO detail (`resources/js/pages/purchase-orders/show.tsx`) ✅
  - Complete PO information and line items
  - Supplier details card
  - Order summary cards
  - Send to supplier action
  - Receive shipment modal with quantity entry
  - Cancel order action
  - Delete order action (draft/cancelled only)

- [x] Suppliers management (`resources/js/pages/suppliers/index.tsx`) ✅
  - List with inline CRUD
  - Dialog-based create/edit forms
  - Contact information management
  - Parts count and PO count per supplier
  - Delete with validation

**Integration with Work Order Flow:**
- [x] Enhanced work order completion form (`work-orders/show.tsx`) ✅
  - "Parts Used" section with dynamic add/remove
  - Search/select spare parts from inventory
  - Choose location to consume from
  - Enter quantities with real-time availability checking
  - Validates against available stock
  - Automatic stock consumption on completion
  - Creates inventory transactions
  - Display consumed parts on completed work orders with costs

---

## Phase 6: OEE & Performance Tracking

### 6.1 OEE Foundation

**Understanding OEE:**
```
OEE = Availability × Performance × Quality

Availability = (Operating Time / Planned Production Time) × 100%
Performance = (Actual Output / Theoretical Output) × 100%
Quality = (Good Output / Total Output) × 100%
```

**New Models:**
- [x] **ProductionRun** model ✅ COMPLETE
  - Fields: company_id, machine_id, work_order_id (optional), product_id, shift_id, start_time, end_time, planned_production_time, actual_production_time, theoretical_output, actual_output, good_output, defect_output, availability_pct, performance_pct, quality_pct, oee_pct, created_by
- [x] **Product** model ✅ COMPLETE
  - Fields: company_id, name, sku, description, theoretical_cycle_time (seconds), target_units_per_hour
- [x] **Shift** model ✅ COMPLETE
  - Fields: company_id, name, start_time, end_time, is_active
- [x] **Downtime** model (more detailed than just work orders) ✅ COMPLETE
  - Fields: company_id, machine_id, production_run_id, downtime_category_id, start_time, end_time, duration_minutes, description, recorded_by
- [x] **DowntimeCategory** model ✅ COMPLETE
  - Fields: company_id, name, category_type (planned/unplanned), is_included_in_oee

### 6.2 Production Tracking APIs

**API Endpoints:**
- [x] GET `/api/production-runs` - List production runs ✅ COMPLETE
  - Filter: machine_id, shift_id, date_range, product_id
  - Output: list with OEE metrics
- [x] POST `/api/production-runs` - Start production run ✅ COMPLETE
  - Input: machine_id, product_id, shift_id, planned_production_time, theoretical_output
  - Auto-records start_time
- [x] PUT `/api/production-runs/{id}/end` - End production run ✅ COMPLETE
  - Input: end_time, actual_output, good_output, defect_output
  - Calculates OEE metrics automatically
- [x] GET `/api/production-runs/{id}` - Detail with downtime breakdown ✅ COMPLETE

**OEE Calculation Endpoints:**
- [x] GET `/api/oee/metrics` - OEE metrics ✅ COMPLETE
  - Query params: machine_id, date_from, date_to, shift_id
  - Output: avg_availability, avg_performance, avg_quality, avg_oee
- [x] GET `/api/oee/trends` - OEE trends over time ✅ COMPLETE
  - Output: daily/weekly OEE values for charting
- [x] GET `/api/oee/comparison` - Compare machines or shifts ✅ COMPLETE
  - Output: OEE by machine or shift

### 6.3 Real-Time Downtime Tracking

**Enhanced Downtime Recording:**
- [x] Quick downtime entry (operator-friendly) ✅ COMPLETE
  - Machine stops → operator logs reason immediately
  - Creates Downtime record linked to current ProductionRun
  - Option to create WorkOrder if maintenance needed
  
**API Endpoints:**
- [x] POST `/api/downtime` - Record downtime event ✅ COMPLETE
  - Input: machine_id, production_run_id, downtime_category_id, start_time, description
  - Output: downtime record with auto-generated ID
- [x] PUT `/api/downtime/{id}/end` - End downtime ✅ COMPLETE
  - Input: end_time
  - Calculates duration automatically
- [x] GET `/api/downtime/categories` - List downtime categories ✅ COMPLETE
  - Separate planned (changeovers, breaks) from unplanned (breakdowns)

### 6.4 OEE Dashboard & Reports

**Screens:**
- [x] OEE dashboard (`resources/js/pages/oee/dashboard.tsx`) ✅ COMPLETE
  - Current shift OEE (live if possible)
  - Overall OEE metrics (availability, performance, quality)
  - Top loss categories (Pareto chart)
  - Machine comparison (bar chart)
  - Filters: date range, machine, shift

- [x] Production run list (`resources/js/pages/production/runs.tsx`) ✅ COMPLETE
  - Table with run details, OEE scores
  - Click to see detailed breakdown
  
- [x] Production run detail (`resources/js/pages/production/show.tsx`) ✅ COMPLETE
  - Run info and metrics
  - Downtime events timeline
  - Output vs target chart
  - Defects breakdown

- [x] OEE trends (`resources/js/pages/oee/trends.tsx`) ✅ COMPLETE
  - Line chart: OEE over time
  - Filter by machine
  - Compare multiple machines
  - Export to PDF/Excel

**Integration with Existing Features:**
- [x] Link ProductionRuns to WorkOrders ✅ COMPLETE
  - When breakdown occurs during production → create WO → link to run
- [x] Dashboard shows OEE alongside maintenance metrics ✅ COMPLETE
- [x] Machine detail page includes OEE history ✅ COMPLETE

---

## Phase 7: Cost Management ✅ 100% COMPLETE

**Status:** 100% Complete - All features fully implemented and tested

**What's Working:**
- ✅ Complete labor cost tracking with user/role-based rates
- ✅ Automatic labor cost calculation from time logs
- ✅ Downtime cost calculation based on machine production value
- ✅ Parts cost tracking integrated with inventory
- ✅ External service cost management
- ✅ Comprehensive cost reporting and analytics
- ✅ Budget management with variance tracking
- ✅ Labor rate management UI with active/scheduled/expired views
- ✅ Full Inertia-based UI with all CRUD operations
- ✅ Database-agnostic implementation (MySQL/SQLite)
- ✅ Work order detail page with cost breakdown card

### 7.1 Cost Tracking Foundation

**Cost Categories:**
- Labor costs (technician time on work orders)
- Parts costs (from spare parts usage)
- Downtime costs (production lost)
- External service costs (contractors, vendors)

**New Models:**
- [x] **LaborRate** model
  - Fields: company_id, user_id (or role_id for general rates), hourly_rate, overtime_rate, effective_from, effective_to
  - ✅ Migration: `2025_11_24_190429_create_labor_rates_table.php`
  - ✅ Model: `app/Models/LaborRate.php`
  - ✅ API Controller: `app/Http/Controllers/Api/LaborRateController.php`
  - ✅ Inertia Controller: `app/Http/Controllers/LaborRateController.php`
- [x] **WorkOrderCost** model (aggregated costs per work order)
  - Fields: work_order_id, labor_cost, parts_cost, external_service_cost, downtime_cost, total_cost, calculated_at
  - ✅ Migration: `2025_11_24_190519_create_work_order_costs_table.php`
  - ✅ Model: `app/Models/WorkOrderCost.php`
- [x] **ExternalService** model
  - Fields: company_id, work_order_id, vendor_name, description, cost, invoice_number, invoice_date
  - ✅ Migration: `2025_11_24_190604_create_external_services_table.php`
  - ✅ Model: `app/Models/ExternalService.php`
  - ✅ API Controller: `app/Http/Controllers/Api/ExternalServiceController.php`

### 7.2 Labor Cost Tracking

**Time Tracking:**
- [x] Enhance MaintenanceLog to include time tracking:
  - Add fields: time_started, time_completed, hours_worked, break_time
  - Calculate labor cost = hours_worked × technician_hourly_rate
  - ✅ Migration: `2025_11_24_190643_add_time_tracking_to_maintenance_logs_table.php`
  
**API Updates:**
- [x] POST `/api/work-orders/{id}/log-time` - Log time spent
  - Input: time_started, time_completed, break_time, notes
  - Auto-calculates hours_worked
  - Fetches technician's hourly_rate from LaborRate
  - Calculates labor_cost
  - ✅ Implemented in: `app/Http/Controllers/Api/WorkOrderController.php::logTime()`

### 7.3 Downtime Cost Calculation

**Downtime Impact:**
- [x] Add hourly_production_value to Machine model
  - Represents revenue lost per hour of downtime
  - ✅ Migration: `2025_11_24_190729_add_hourly_production_value_to_machines_table.php`
- [x] Calculate downtime cost:
  - `downtime_cost = downtime_hours × machine.hourly_production_value`
  - ✅ Automatically calculated in `WorkOrderController::logTime()`
- [x] Link to work orders and production runs
  - ✅ Stored in WorkOrderCost model

**API Endpoints:**
- [x] GET `/api/costs/downtime` - Downtime costs
  - Query params: date_from, date_to, machine_id
  - Output: total downtime hours, total downtime cost, breakdown by machine
  - ✅ Implemented in: `app/Http/Controllers/Api/CostController.php::downtime()`

### 7.4 Cost Reporting & Budgeting

**API Endpoints:**
- [x] GET `/api/costs/summary` - Cost summary
  - Query params: date_from, date_to, machine_id, cost_type
  - Output: labor_total, parts_total, downtime_total, external_total, grand_total
  - ✅ Implemented in: `app/Http/Controllers/Api/CostController.php::summary()`
- [x] GET `/api/costs/by-machine` - Costs per machine
  - Helps identify most expensive machines to maintain
  - ✅ Implemented in: `app/Http/Controllers/Api/CostController.php::byMachine()`
- [x] GET `/api/costs/by-category` - Costs by work order type or cause category
  - ✅ Implemented in: `app/Http/Controllers/Api/CostController.php::byCategory()`
- [x] GET `/api/costs/trends` - Monthly cost trends
  - ✅ Implemented in: `app/Http/Controllers/Api/CostController.php::trends()`

**Budget Management:**
- [x] **MaintenanceBudget** model
  - Fields: company_id, year, month, budgeted_labor, budgeted_parts, budgeted_total, actual_labor, actual_parts, actual_total, variance
  - ✅ Migration: `2025_11_24_190820_create_maintenance_budgets_table.php`
  - ✅ Model: `app/Models/MaintenanceBudget.php`
  - ✅ API Controller: `app/Http/Controllers/Api/MaintenanceBudgetController.php`
- [x] API to compare budget vs actual
  - ✅ Implemented with automatic calculation in Inertia controller
- [x] Alerts when budget exceeded
  - ✅ Visual indicators on budget page (red/yellow/green badges)

### 7.5 Cost Management UI

**Screens:**
- [x] Cost dashboard (`resources/js/pages/costs/dashboard.tsx`)
  - Total maintenance costs (cards: labor, parts, downtime, external)
  - Cost trends chart
  - Budget vs actual gauge
  - Top cost drivers (machines or work orders)
  - ✅ Inertia-based with server-side props
  - ✅ Controller: `app/Http/Controllers/CostController.php::dashboard()`
  - ✅ Added to sidebar navigation
  
- [x] Detailed cost report (`resources/js/pages/costs/report.tsx`)
  - Filterable table of all costs
  - Export to CSV/Excel
  - Group by machine, work order type, time period
  - ✅ Inertia-based with filters via router.get()
  - ✅ Controller: `app/Http/Controllers/CostController.php::report()`
  - ✅ Database-agnostic queries (MySQL/SQLite)
  
- [x] Budget management (`resources/js/pages/costs/budget.tsx`)
  - Set monthly budgets
  - View variance
  - Forecast based on trends
  - ✅ Full Inertia forms (CRUD operations)
  - ✅ Controller: `app/Http/Controllers/CostController.php::budget()`
  - ✅ Visual status badges and variance display
  - ✅ "Update Actuals" refresh functionality

- [x] Labor rate management (`resources/js/pages/costs/labor-rates.tsx`)
  - Set user-specific or role-based hourly rates
  - Configure overtime rates
  - Effective date ranges
  - Active/Scheduled/Expired rate views
  - ✅ Full Inertia forms (CRUD operations)
  - ✅ Controller: `app/Http/Controllers/LaborRateController.php`
  - ✅ Added to sidebar navigation

**Work Order Cost Visibility:**
- [x] Enhanced work order detail page:
  - Cost breakdown section (labor, parts, downtime, external)
  - Total cost card
  - Only shows for completed work orders
  - Link to detailed cost report
  - ✅ Implemented in sidebar of work order detail page
  - ✅ File: `resources/js/pages/work-orders/show.tsx`

---

## Phase 8: Integrations & Automation

### 8.1 ERP Integration

**Goals:**
- Sync spare parts with ERP inventory
- Push purchase orders to ERP
- Import production data
- Sync work order costs to ERP

**Architecture:**
- [ ] Create integration framework:
  - Abstract `Integration` interface
  - Specific implementations for common ERPs (SAP, Oracle, NetSuite)
- [ ] **Integration** model
  - Fields: company_id, integration_type, config (JSON), is_enabled, last_sync_at, sync_frequency

**API Endpoints:**
- [ ] POST `/api/integrations` - Set up integration
  - Input: integration_type, config (credentials, endpoints)
- [ ] GET `/api/integrations` - List active integrations
- [ ] POST `/api/integrations/{id}/sync` - Manual sync trigger
- [ ] GET `/api/integrations/{id}/logs` - Sync history and errors

**Sync Jobs:**
- [ ] Scheduled job: Sync spare parts inventory with ERP
  - Push stock levels
  - Pull purchase orders
- [ ] Scheduled job: Sync work order costs to ERP
  - Export completed work orders as cost transactions

**Webhooks:**
- [ ] POST `/webhooks/erp/purchase-order-received` - ERP notifies when PO received
  - Auto-update PurchaseOrder status
  - Create inventory transactions

### 8.2 IoT Sensor Integration

**Goals:**
- Receive real-time machine status
- Auto-detect downtime events
- Monitor machine health (vibration, temperature)

**New Models:**
- [ ] **Sensor** model
  - Fields: company_id, machine_id, sensor_type, sensor_id, is_active, last_reading_at
- [ ] **SensorReading** model
  - Fields: sensor_id, reading_value, unit, reading_time
  - Store time-series data (consider using TimescaleDB or InfluxDB)
- [ ] **SensorAlert** model
  - Fields: sensor_id, machine_id, alert_type, threshold_value, current_value, triggered_at, acknowledged_at

**API Endpoints:**
- [ ] POST `/webhooks/sensors/reading` - Receive sensor data
  - Input: sensor_id, reading_value, timestamp
  - Store in SensorReading
  - Check against thresholds → trigger alerts
- [ ] GET `/api/sensors` - List sensors per machine
- [ ] POST `/api/sensors` - Register new sensor
- [ ] GET `/api/sensors/{id}/readings` - Time-series data
  - Query params: date_from, date_to
- [ ] POST `/api/sensors/{id}/alerts/configure` - Set thresholds

**Auto Work Order Creation:**
- [ ] If sensor reading exceeds threshold:
  - Auto-create WorkOrder (type=breakdown)
  - Assign to default technician
  - Attach sensor alert details

**IoT Dashboard:**
- [ ] Real-time machine status page (`resources/js/pages/iot/dashboard.tsx`)
  - Machine status grid (running/stopped/alert)
  - Live sensor readings
  - Alert notifications

### 8.3 Email & Notification System

**Goals:**
- Email notifications for work order assignments
- SMS for critical alerts
- In-app notifications

**New Models:**
- [ ] **Notification** model
  - Fields: user_id, notification_type, title, message, link, is_read, sent_at
- [ ] **NotificationPreference** model
  - Fields: user_id, notification_type, email_enabled, sms_enabled, push_enabled

**Notification Events:**
- [ ] Work order assigned
- [ ] Work order overdue
- [ ] Preventive task due soon
- [ ] Part low stock
- [ ] Sensor alert triggered
- [ ] Budget exceeded

**API Endpoints:**
- [ ] GET `/api/notifications` - List user's notifications
- [ ] PUT `/api/notifications/{id}/read` - Mark as read
- [ ] GET `/api/notifications/unread-count` - Badge count
- [ ] POST `/api/notifications/preferences` - Update preferences

**Email Queue:**
- [ ] Laravel Queue for async email sending
- [ ] Email templates for each notification type
- [ ] Support for SMTP, SendGrid, Mailgun

### 8.4 Vendor Portal

**Goals:**
- Allow suppliers to view POs
- Suppliers can update PO status
- Upload invoices and delivery notes

**Public API:**
- [ ] API key authentication for vendors
- [ ] GET `/api/vendor/purchase-orders` - Vendor's POs
- [ ] PUT `/api/vendor/purchase-orders/{id}/shipped` - Mark as shipped
- [ ] POST `/api/vendor/purchase-orders/{id}/invoice` - Upload invoice

**Vendor Portal UI:**
- [ ] Separate React app or public pages
- [ ] Login with API key
- [ ] View POs
- [ ] Update status
- [ ] Upload documents

---

## Phase 9: Advanced Analytics & Mobile

### 9.1 Advanced Analytics

**Predictive Maintenance:**
- [ ] **PredictiveModel** model
  - Use historical work order data to predict failures
  - Fields: machine_id, model_type, last_trained_at, accuracy_score
- [ ] Machine learning integration:
  - Train model on breakdown patterns
  - Predict next failure date
  - Suggest preventive actions

**MTBF & MTTR Metrics:**
- [ ] Mean Time Between Failures (MTBF)
  - `MTBF = Total operating time / Number of breakdowns`
- [ ] Mean Time To Repair (MTTR)
  - `MTTR = Total repair time / Number of repairs`
- [ ] API endpoints for these metrics

**API Endpoints:**
- [ ] GET `/api/analytics/mtbf` - MTBF by machine
- [ ] GET `/api/analytics/mttr` - MTTR by machine or category
- [ ] GET `/api/analytics/predictions` - Predicted failures
- [ ] GET `/api/analytics/pareto` - Pareto analysis (80/20 rule)
  - Which 20% of machines cause 80% of issues

**Advanced Reports:**
- [ ] Failure mode analysis
- [ ] Root cause trends
- [ ] Maintenance effectiveness (breakdowns before/after PM)
- [ ] Cost-benefit analysis of preventive vs reactive

### 9.2 Custom Dashboards

**Dashboard Builder:**
- [ ] Drag-and-drop dashboard creator (manager only)
- [ ] Widget library:
  - Metric cards (KPIs)
  - Charts (line, bar, pie)
  - Tables (recent work orders, low stock)
  - Gauges (OEE, budget)
- [ ] Save custom layouts per user or role
- [ ] Share dashboards with team

**Models:**
- [ ] **Dashboard** model
  - Fields: company_id, name, layout (JSON), is_default, created_by, is_shared
- [ ] **Widget** model
  - Fields: dashboard_id, widget_type, config (JSON), position_x, position_y, size_x, size_y

### 9.3 Mobile Native Apps

**React Native Apps:**
- [ ] Separate mobile app codebase
- [ ] iOS and Android support
- [ ] Offline-first architecture

**Operator App Features:**
- [ ] Quick breakdown reporting (voice input, photo capture)
- [ ] QR code scanning for machines
- [ ] Push notifications for assignments
- [ ] Offline mode (sync when back online)

**Technician App Features:**
- [ ] Work order list with swipe actions
- [ ] Timer for time tracking
- [ ] Parts lookup and inventory check
- [ ] Photo documentation
- [ ] Digital signature for completion

**Manager App Features:**
- [ ] Dashboard overview
- [ ] Approval workflows
- [ ] Real-time alerts

**API Updates:**
- [ ] Optimize APIs for mobile (smaller payloads)
- [ ] Implement GraphQL for flexible queries
- [ ] Add file upload for photos

### 9.4 Advanced Search & Filters

**Global Search:**
- [ ] Search across machines, work orders, parts, documents
- [ ] Elasticsearch integration for fast full-text search
- [ ] Search suggestions and autocomplete

**Saved Filters:**
- [ ] Allow users to save common filter combinations
- [ ] Quick access to saved filters
- [ ] Share filters with team

**API Endpoints:**
- [ ] GET `/api/search` - Global search
  - Query param: q (search term)
  - Returns: machines, work orders, parts, users
- [ ] POST `/api/filters/save` - Save filter preset
- [ ] GET `/api/filters` - List saved filters

---

## Phase 10: Compliance & Documentation

### 10.1 Compliance & Audit Trail

**Audit Logging:**
- [ ] **AuditLog** model
  - Fields: company_id, user_id, action, model_type, model_id, old_values (JSON), new_values (JSON), ip_address, created_at
- [ ] Log all changes to critical records:
  - Work orders (status changes)
  - Maintenance logs
  - Parts usage
  - Preventive tasks

**Compliance Reports:**
- [ ] Generate compliance reports for auditors
- [ ] Export work order history
- [ ] Maintenance completion certificates

**API Endpoints:**
- [ ] GET `/api/audit-logs` - View audit trail
  - Filter by user, date, model type
- [ ] GET `/api/compliance/report` - Generate compliance report

### 10.2 Document Management

**Goals:**
- Store machine manuals, safety documents, certifications
- Link documents to machines or work orders
- Version control

**New Models:**
- [ ] **Document** model
  - Fields: company_id, documentable_type, documentable_id, name, file_path, file_type, size, version, uploaded_by, created_at
- [ ] Polymorphic relationships:
  - Machine hasMany Documents
  - WorkOrder hasMany Documents
  - SparePart hasMany Documents

**API Endpoints:**
- [ ] POST `/api/documents/upload` - Upload document
  - Input: file, documentable_type, documentable_id
- [ ] GET `/api/documents` - List documents
  - Filter by documentable
- [ ] GET `/api/documents/{id}/download` - Download file
- [ ] DELETE `/api/documents/{id}` - Delete document

**UI:**
- [ ] Document library page
- [ ] Machine detail page → Documents tab
- [ ] Work order detail → Attach documents

---

## Implementation Priority Matrix

### High Priority (Start Here)
1. **Phase 5.1-5.4** - Spare Parts Management
   - Most requested feature
   - Builds on existing work order system
   - Quick wins for user satisfaction

2. **Phase 7.1-7.3** - Cost Tracking
   - Labor and parts costs (using spare parts from Phase 5)
   - Downtime costs
   - Provides immediate ROI visibility

3. **Phase 8.3** - Email Notifications
   - Low effort, high impact
   - Improves user engagement

### Medium Priority
4. **Phase 6.1-6.3** - OEE Tracking
   - More complex, but valuable for manufacturers
   - Requires production run data entry

5. **Phase 8.1-8.2** - Basic Integrations
   - Start with simple ERP sync
   - Add IoT if customers have sensors

### Lower Priority (Nice to Have)
6. **Phase 9.1-9.2** - Advanced Analytics
   - Build after sufficient data collected
   - Predictive models need training data

7. **Phase 9.3** - Mobile Native Apps
   - Current mobile-web is functional
   - Only if users demand native features

8. **Phase 10** - Compliance & Docs
   - Important for regulated industries
   - Can be added incrementally

---

## Technical Considerations

### Database Optimization
- [ ] Add indexes for frequently queried fields
- [ ] Consider partitioning large tables (SensorReading, AuditLog)
- [ ] Implement caching (Redis) for dashboard queries
- [ ] Archive old data (work orders older than 2 years)

### Performance
- [ ] Optimize OEE calculations (use materialized views or summary tables)
- [ ] Lazy load images and documents
- [ ] Implement API pagination (already done in MVP, ensure all new endpoints have it)
- [ ] Background jobs for heavy calculations

### Security
- [ ] API rate limiting per user/company
- [ ] Encrypt sensitive data (labor rates, costs)
- [ ] Secure file uploads (scan for malware)
- [ ] API key management for integrations

### Scalability
- [ ] Horizontal scaling with load balancer
- [ ] Separate read/write database (if needed)
- [ ] CDN for static assets
- [ ] Message queue for integrations (RabbitMQ or AWS SQS)

---

## API Reference Summary (V2 Additions)

### Spare Parts
- GET/POST `/api/spare-parts`
- GET/PUT `/api/spare-parts/{id}`
- POST `/api/spare-parts/{id}/adjust-stock`
- GET `/api/inventory/low-stock`

### Purchase Orders
- GET/POST `/api/purchase-orders`
- GET/PUT `/api/purchase-orders/{id}`
- POST `/api/purchase-orders/{id}/send`
- POST `/api/purchase-orders/{id}/receive`

### OEE & Production
- GET/POST `/api/production-runs`
- PUT `/api/production-runs/{id}/end`
- GET `/api/oee/metrics`
- GET `/api/oee/trends`
- POST `/api/downtime`

### Costs
- GET `/api/costs/summary`
- GET `/api/costs/by-machine`
- GET `/api/costs/trends`
- POST `/api/work-orders/{id}/log-time`

### Integrations
- POST `/api/integrations`
- POST `/api/integrations/{id}/sync`
- POST `/webhooks/sensors/reading`

### Notifications
- GET `/api/notifications`
- PUT `/api/notifications/{id}/read`
- POST `/api/notifications/preferences`

### Analytics
- GET `/api/analytics/mtbf`
- GET `/api/analytics/mttr`
- GET `/api/analytics/predictions`

---

## Migration Strategy from MVP to V2

### Data Migration
1. Add new tables without disrupting existing data
2. Backfill labor costs for completed work orders (if labor rates exist)
3. Import existing spare parts from CSV (if available)

### Gradual Rollout
1. Deploy Phase 5 (Spare Parts) first → test with pilot users
2. Train users on new features
3. Collect feedback
4. Deploy Phase 6-7 incrementally
5. Integrations last (Phase 8) → requires customer-specific setup

### Backward Compatibility
- All MVP features remain unchanged
- V2 features are additive
- Users can continue using MVP features while adopting V2 gradually

---

## Getting Started with V2

**Recommended Order:**
1. Start with **Phase 5.1** (Spare Parts models)
2. Build **Phase 5.2-5.3** (APIs)
3. Create **Phase 5.5** (UI)
4. Test spare parts end-to-end
5. Move to **Phase 7** (Costs) → depends on spare parts
6. Then **Phase 6** (OEE) or **Phase 8** (Integrations) based on customer priority

**Timeline Estimate:**
- Phase 5 (Spare Parts): 3-4 weeks
- Phase 6 (OEE): 3 weeks
- Phase 7 (Costs): 2 weeks
- Phase 8 (Integrations): 4-6 weeks (highly variable)
- Phase 9-10: 4-6 weeks

**Total V2 Development: 16-25 weeks** (4-6 months)

---

## Success Metrics for V2

Track these KPIs to measure V2 success:
- Parts inventory accuracy (target: >95%)
- OEE improvement (target: +5-10% after 6 months)
- Cost visibility (100% of maintenance costs tracked)
- Integration uptime (target: >99%)
- User adoption of new features (target: 70% active use)

---
