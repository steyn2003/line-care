# LineCare V2 - Product Requirements Document

To check if the typescript is right please do 
npm run lint


## 1. V2 Vision & Scope

### Goal of V2
Transform LineCare from a basic maintenance tracker into a comprehensive CMMS that provides:

> "Complete maintenance management with spare parts inventory, OEE tracking, cost analysis, and integrations - giving factories full visibility into maintenance operations and their business impact."

### What's New in V2
Building on the successful MVP foundation, V2 adds:

- **Spare Parts Management** - Full inventory control with automatic reordering
- **OEE Tracking** - Measure availability, performance, and quality metrics
- **Cost Management** - Track labor, parts, and downtime costs with budgeting
- **Integrations** - Connect to ERP systems, IoT sensors, and vendors
- **Advanced Analytics** - MTBF, MTTR, predictive maintenance, and custom dashboards
- **Mobile Native Apps** - Dedicated iOS/Android apps with offline capabilities
- **Compliance & Documentation** - Audit trails and document management

### MVP Features (Retained)
All MVP features continue to work:
- User management with roles (operator, technician, manager)
- Asset/machine management
- Breakdown and preventive maintenance workflows
- Work order management
- Basic dashboards and reporting
- CSV import for onboarding

### Phases Overview

**Phase 5 – Spare Parts Management**
- Parts catalog and inventory
- Stock tracking per location
- Purchase orders and procurement
- Parts usage in work orders
- Low stock alerts and auto-reordering

**Phase 6 – OEE & Performance**
- Production run tracking
- Real-time availability, performance, quality metrics
- Downtime categorization
- OEE dashboards and trends

**Phase 7 – Cost Management**
- Labor cost tracking
- Parts cost tracking
- Downtime impact analysis
- Budget management
- Cost reporting

**Phase 8 – Integrations & Automation**
- ERP integration (sync inventory, costs, POs)
- IoT sensor integration (real-time machine status)
- Email and SMS notifications
- Vendor portal for suppliers

**Phase 9 – Advanced Analytics & Mobile**
- Predictive maintenance (ML models)
- MTBF and MTTR metrics
- Custom dashboards
- Native mobile apps (iOS/Android)
- Advanced search

**Phase 10 – Compliance & Documentation**
- Full audit trail
- Compliance reporting
- Document management
- Version control

---

## 2. Core Entities & Relationships (V2 Expanded)

### Existing Entities (from MVP)
- User, Company, Location, Machine
- WorkOrder, PreventiveTask, MaintenanceLog
- CauseCategory

### New Entities in V2

#### Spare Parts Module
**SparePart**
- Belongs to **Company**
- Belongs to **PartCategory**
- Belongs to **Supplier**
- Has many **InventoryTransactions**
- Has many **Stocks** (per location)
- BelongsToMany **WorkOrders** (parts used)
- BelongsToMany **PurchaseOrders** (parts ordered)

**PartCategory**
- Belongs to **Company**
- Can have parent **PartCategory** (nested categories)
- Has many **SpareParts**

**Supplier**
- Belongs to **Company**
- Has many **SpareParts**
- Has many **PurchaseOrders**

**Stock**
- Belongs to **Company**
- Belongs to **SparePart**
- Belongs to **Location**
- Tracks: quantity_on_hand, quantity_reserved, quantity_available

**InventoryTransaction**
- Belongs to **Company**
- Belongs to **SparePart**
- Belongs to **User** (who made the transaction)
- Can link to **WorkOrder** (parts used) or **PurchaseOrder** (parts received)
- Types: in (received), out (used), adjustment (manual)

**PurchaseOrder**
- Belongs to **Company**
- Belongs to **Supplier**
- Created by **User**
- Has many **SpareParts** (with quantities)
- Statuses: draft, sent, received, cancelled

#### OEE Module
**ProductionRun**
- Belongs to **Company**
- Belongs to **Machine**
- Belongs to **Product**
- Belongs to **Shift**
- Optionally linked to **WorkOrder**
- Has many **Downtime** events
- Stores: OEE metrics (availability, performance, quality)

**Product**
- Belongs to **Company**
- Has theoretical cycle time and target output
- Has many **ProductionRuns**

**Shift**
- Belongs to **Company**
- Defines: start_time, end_time
- Has many **ProductionRuns**

**Downtime** (detailed tracking)
- Belongs to **Company**
- Belongs to **Machine**
- Belongs to **ProductionRun**
- Belongs to **DowntimeCategory**
- Stores: start_time, end_time, duration

**DowntimeCategory**
- Belongs to **Company**
- Types: planned (changeovers, breaks) or unplanned (breakdowns)
- Flag: is_included_in_oee (some planned downtime may not count)

#### Cost Module
**LaborRate**
- Belongs to **Company**
- Can be per **User** or per role
- Stores: hourly_rate, overtime_rate, effective dates

**WorkOrderCost** (aggregated)
- Belongs to **WorkOrder**
- Stores: labor_cost, parts_cost, external_service_cost, downtime_cost, total_cost

**ExternalService**
- Belongs to **Company**
- Belongs to **WorkOrder**
- Tracks: vendor costs, invoices

**MaintenanceBudget**
- Belongs to **Company**
- Per year/month
- Stores: budgeted amounts vs actual amounts, variance

#### Integration Module
**Integration**
- Belongs to **Company**
- Types: ERP, IoT, Email, etc.
- Stores: config (JSON), credentials, sync frequency

**Sensor**
- Belongs to **Company**
- Belongs to **Machine**
- Types: vibration, temperature, pressure, etc.

**SensorReading**
- Belongs to **Sensor**
- Time-series data: reading_value, timestamp

**SensorAlert**
- Belongs to **Sensor**
- Belongs to **Machine**
- Triggered when reading exceeds threshold
- Can auto-create **WorkOrder**

**Notification**
- Belongs to **User**
- Types: work_order_assigned, part_low_stock, sensor_alert, etc.

**NotificationPreference**
- Belongs to **User**
- Settings: email_enabled, sms_enabled, push_enabled per notification type

#### Analytics Module
**PredictiveModel**
- Belongs to **Machine**
- ML model for predicting failures
- Stores: accuracy, last_trained_at, predictions

**Dashboard**
- Belongs to **Company**
- Created by **User**
- Stores: layout (JSON), widgets, is_shared

**Widget**
- Belongs to **Dashboard**
- Types: metric card, chart, table, gauge
- Stores: config (JSON), position

#### Compliance Module
**AuditLog**
- Belongs to **Company**
- Belongs to **User** (who made the change)
- Tracks: action, model changed, old/new values, IP address

**Document**
- Belongs to **Company**
- Polymorphic: can attach to Machine, WorkOrder, SparePart
- Stores: file, version, uploaded by

---

## 3. Features & How They Work Together

### 3.1 Authentication & Roles (Enhanced)

Same as MVP, but with additional capabilities:

**Manager** gains:
- Spare parts and inventory management
- Cost and budget management
- Integration setup
- Dashboard customization
- Compliance reporting

**Technician** gains:
- Parts usage entry when completing work orders
- Time tracking for labor costs
- Production run data entry (OEE)
- Document uploads

**Operator** gains:
- Quick downtime logging (OEE)
- Mobile app for breakdown reporting
- QR code machine scanning

### 3.2 Spare Parts Management

#### 3.2.1 Parts Catalog

**Scenario: Manager sets up parts catalog**

1. Manager creates part categories:
   - Bearings, Belts, Filters, Lubricants, Electrical, etc.
   - Categories can be nested (e.g., Bearings → Ball Bearings, Roller Bearings)

2. Manager adds spare parts:
   - Basic info: part number, name, description, photo
   - Inventory info: unit cost, unit of measure
   - Supplier info: select supplier, lead time
   - Reorder settings: reorder point, reorder quantity
   - Criticality: mark critical parts (affect production if out of stock)
   - Storage: assign to location(s)

3. Parts appear in:
   - Parts catalog (searchable list)
   - Work order completion form (when adding parts used)
   - Low stock alerts dashboard
   - Purchase order form

#### 3.2.2 Inventory Tracking

**Stock Management:**
- System tracks quantity per part per location
- Three quantities:
  - **On hand**: physical count
  - **Reserved**: allocated to open work orders
  - **Available**: on_hand - reserved

**Inventory Transactions:**
Every stock change creates a transaction:
- **IN**: Receiving from purchase order
- **OUT**: Used in work order
- **ADJUSTMENT**: Manual correction (physical count)

**Scenario: Technician uses parts on work order**

1. Technician completes work order
2. In completion form, adds parts used:
   - Search for "bearing 608"
   - Select part from dropdown
   - Enter quantity used: 2
   - Select location: Main warehouse
3. System:
   - Creates OUT transaction
   - Reduces stock.quantity_on_hand by 2
   - Records unit_cost at time of use
   - Links transaction to work order
   - Calculates work_order.parts_cost

**Physical Count:**
1. Periodically, manager performs physical count
2. Enter actual quantity counted
3. System compares to system quantity
4. If discrepancy, creates ADJUSTMENT transaction
5. Updates stock to match physical count

#### 3.2.3 Purchase Orders & Procurement

**Scenario: Automated reordering for low stock**

1. Daily scheduled job runs:
   - Finds parts where stock.quantity_available < spare_part.reorder_point
   - Groups by supplier
   - Creates draft purchase orders

2. Manager receives notification: "5 parts are low on stock"

3. Manager reviews draft PO:
   - Part list with quantities (using reorder_quantity)
   - Edit quantities if needed
   - Add/remove parts
   - Review total cost

4. Manager sends PO to supplier:
   - Status changes: draft → sent
   - Email sent to supplier (if email integration enabled)
   - OR download PDF to send manually

5. Supplier ships parts:
   - Supplier updates PO status (via vendor portal OR manager does it manually)
   - Status: sent → received

6. Manager receives shipment:
   - Goes to PO detail page
   - Clicks "Receive Shipment"
   - Confirms quantities received (may differ from ordered)
   - System creates IN transactions for each part
   - Updates stock quantities
   - PO status → received

**Result:**
- Inventory always up to date
- Never run out of critical parts
- Clear audit trail of all purchases

#### 3.2.4 Parts Usage in Work Orders

**Enhanced Work Order Flow:**

When completing a work order:
1. Technician enters what was done (as before)
2. NEW: "Parts Used" section:
   - Click "Add Part"
   - Search by part number or name
   - Select part
   - Enter quantity
   - System shows: available stock, unit cost
   - Repeatable (add multiple parts)

3. On save:
   - System validates: sufficient stock available?
   - If yes: creates OUT transactions, updates stock
   - If no: shows warning "Only 1 in stock, you entered 2"
   - Records parts_cost on work order

**Bulk Parts Reservation:**
For planned work:
- When creating planned/preventive work order, manager can pre-reserve parts
- System increases stock.quantity_reserved
- When work order completed, reserved → used

### 3.3 OEE Tracking

#### 3.3.1 Understanding OEE

**OEE Formula:**
```
OEE = Availability × Performance × Quality

Availability = (Operating Time / Planned Production Time) × 100%
  - Planned Production Time = Shift time - Planned downtime (breaks, changeovers)
  - Operating Time = Planned Production Time - Unplanned downtime (breakdowns)

Performance = (Actual Output / Theoretical Output) × 100%
  - Theoretical Output = Planned Production Time × Ideal cycle time
  - Actual Output = Units produced

Quality = (Good Output / Total Output) × 100%
  - Good Output = Total Output - Defects
```

**World-class OEE:**
- 85%+ is world-class
- 60% is typical for many manufacturers
- Below 40% indicates significant improvement opportunity

#### 3.3.2 Production Run Tracking

**Scenario: Operator starts production run**

1. Operator logs into system (or mobile app)
2. Selects machine: "CNC Mill 1"
3. Selects product: "Widget A"
4. Selects shift: "Day shift (6 AM - 2 PM)"
5. Enters planned production:
   - Target quantity: 1000 units
   - OR System calculates from: shift duration × ideal cycle time
6. Clicks "Start Run"

**System records:**
- start_time = now
- planned_production_time = shift duration
- theoretical_output = calculated based on product.theoretical_cycle_time

**During production:**
Operator or system records:
- Actual units produced (manual entry or auto from PLC/ERP)
- Good units vs defects
- Downtime events (see next section)

**Scenario: Operator ends production run**

1. At end of shift, operator clicks "End Run"
2. Enters:
   - Actual output: 850 units
   - Good output: 820 units
   - Defects: 30 units
3. System calculates OEE:
   - Availability: 92% (8 minutes downtime during 480 min shift)
   - Performance: 85% (850 actual vs 1000 target)
   - Quality: 96% (820 good vs 850 total)
   - **OEE: 75%** (0.92 × 0.85 × 0.96)

#### 3.3.3 Downtime Tracking (Detailed)

**Why track downtime separately?**
- Work orders track maintenance actions
- Downtime tracks production interruptions
- One breakdown can have multiple downtime events
- Some downtime is planned (changeovers), some unplanned (breakdowns)

**Scenario: Machine stops during production**

1. Operator notices machine stopped
2. Opens downtime log (quick access button)
3. Selects category:
   - **Unplanned:** Breakdown, Material shortage, Quality issue
   - **Planned:** Changeover, Preventive maintenance, Break
4. Optionally: short description
5. Clicks "Start Downtime"

**System records:**
- Links to current production run
- Stores start_time
- Status: active

**When machine resumes:**
1. Operator clicks "End Downtime"
2. System calculates duration
3. If category = Breakdown → prompt: "Create work order?"
   - If yes: pre-fills work order with machine, time, description

**Downtime Categories Configuration:**
- Manager sets up categories
- Marks which are included in OEE calculation
- Example: 
  - Planned breaks: NOT included (don't count against availability)
  - Planned PM: Included (reduces available production time)
  - Unplanned breakdowns: Included (major availability factor)

#### 3.3.4 OEE Dashboard

**Real-Time OEE Display:**
- Shows current shift's OEE (live if production run active)
- Three gauges: Availability, Performance, Quality
- Overall OEE score with color coding:
  - Red: < 60%
  - Yellow: 60-85%
  - Green: > 85%

**Loss Analysis:**
- Pareto chart: Top causes of OEE loss
  - Availability losses (downtime)
  - Performance losses (speed)
  - Quality losses (defects)
- Clicking a bar shows contributing factors

**Machine Comparison:**
- Bar chart: OEE by machine
- Identifies best and worst performers
- Filterable by date range, shift

**Trends:**
- Line chart: OEE over time (daily/weekly/monthly)
- Spot improvement or degradation
- Filter by machine

**Interaction with Work Orders:**
- If downtime event has linked work order → click to view
- See: downtime events that generated work orders
- Track: maintenance impact on OEE

### 3.4 Cost Management

#### 3.4.1 Cost Components

LineCare tracks four cost types per work order:

1. **Labor Cost**
   - Technician time × hourly rate
   - Automatically calculated from time logs

2. **Parts Cost**
   - Sum of parts used × unit_cost at time of use
   - Pulled from inventory transactions

3. **Downtime Cost**
   - Downtime duration × machine hourly production value
   - Shows business impact of breakdowns

4. **External Service Cost**
   - Contractor/vendor charges
   - Manual entry with invoices

**Total Work Order Cost = Labor + Parts + Downtime + External**

#### 3.4.2 Labor Cost Tracking

**Setup:**
1. Manager configures labor rates:
   - Per user (individual rates) OR per role (standard rates)
   - Regular hourly rate
   - Overtime rate (optional)
   - Effective date range (handle rate changes over time)

**Scenario: Technician logs time on work order**

1. Technician opens work order
2. Clicks "Log Time"
3. Enters:
   - Time started: 9:00 AM
   - Time completed: 11:30 AM
   - Break time: 15 minutes
   - Notes: "Replaced bearing and realigned belt"
4. System calculates:
   - Work duration: 2.5 hours - 0.25 hours = 2.25 hours
   - Labor cost: 2.25 hours × $35/hour = $78.75
5. Creates MaintenanceLog with cost
6. Updates WorkOrder.labor_cost

**Overtime Handling:**
If work done during overtime hours → uses overtime_rate

#### 3.4.3 Downtime Cost Calculation

**Setup:**
1. Manager configures machine economic impact:
   - Goes to machine settings
   - Enters "Hourly Production Value": $500
   - This represents: revenue lost per hour when machine is down

**Automatic Calculation:**
When work order is completed:
1. System looks at work order duration:
   - started_at: 9:00 AM
   - completed_at: 11:30 AM
   - Downtime: 2.5 hours
2. Calculates downtime cost:
   - 2.5 hours × $500/hour = $1,250
3. Stores in work_order.downtime_cost

**Note:** This is approximate (assumes linear production loss)

#### 3.4.4 Cost Reporting

**Cost Summary Dashboard:**
- Cards showing total costs:
  - This month: Labor, Parts, Downtime, External
  - Year to date
  - Comparison vs last month/year

**Cost Trends:**
- Line chart: monthly costs over time
- Stacked area: breakdown by cost type
- Identify: seasonal patterns, increasing trends

**Cost by Machine:**
- Table: machines sorted by total maintenance cost
- Shows: high-cost assets needing attention
- Click machine → see cost breakdown

**Cost by Work Order Type:**
- Compare: breakdown costs vs preventive costs
- Goal: increase preventive (cheaper) to reduce breakdown (expensive)

**Budget Management:**

1. Manager sets monthly budget:
   - Budget for labor: $5,000
   - Budget for parts: $3,000
   - Total: $8,000

2. Dashboard shows:
   - Budget vs actual gauge
   - Variance: over/under budget
   - Forecast: projected end-of-month based on current spending rate

3. Alerts:
   - If 80% of budget spent → warning
   - If over budget → notification to manager

**Cost Analysis:**
- Which machines are most expensive to maintain?
- Is preventive maintenance reducing breakdown costs?
- Are we spending too much on external services vs in-house?
- What's the ROI of PM programs?

### 3.5 Integrations & Automation

#### 3.5.1 ERP Integration

**Supported ERPs:**
- SAP
- Oracle NetSuite
- Microsoft Dynamics
- Odoo
- Custom API

**Integration Goals:**

1. **Inventory Sync:**
   - Push: LineCare stock levels → ERP inventory
   - Pull: ERP purchase orders → LineCare
   - Keeps both systems aligned

2. **Cost Export:**
   - Export completed work orders as cost transactions
   - Labor costs → ERP payroll/accounting
   - Parts costs → ERP inventory valuation
   - Enables: accurate financial reporting

3. **Production Data:**
   - Import: production schedules from ERP
   - Export: actual production from OEE runs
   - Enables: better planning

**Setup:**
1. Manager goes to Settings → Integrations
2. Clicks "Add Integration"
3. Selects: ERP type (e.g., SAP)
4. Enters: API endpoint, credentials
5. Configures sync settings:
   - Sync frequency: hourly, daily, real-time
   - Data to sync: inventory, costs, production
6. Tests connection
7. Enables integration

**Sync Process:**
- Scheduled job runs at configured interval
- Pulls/pushes data via API
- Logs: success/failure, records synced
- Alerts on errors

**Conflict Resolution:**
- Last write wins (typically)
- OR Manual review for discrepancies

#### 3.5.2 IoT Sensor Integration

**Supported Protocols:**
- MQTT (common for industrial IoT)
- OPC UA (factory automation standard)
- REST webhooks
- Modbus TCP

**Sensor Types:**
- Vibration sensors (detect bearing wear)
- Temperature sensors (detect overheating)
- Pressure sensors (hydraulic/pneumatic)
- Current sensors (electrical consumption)
- Speed sensors (RPM monitoring)

**Scenario: Auto-detect machine breakdown**

1. Vibration sensor on "CNC Mill 1" monitors bearing health
2. Normal reading: 2.5 mm/s RMS
3. Threshold set: 8.0 mm/s (warning), 12.0 mm/s (critical)
4. Sensor reading spikes to 13.2 mm/s
5. Sensor sends data to LineCare webhook:
   ```json
   {
     "sensor_id": "VIB-001",
     "machine_id": "CNC-Mill-1",
     "reading": 13.2,
     "unit": "mm/s",
     "timestamp": "2025-01-20T14:35:22Z"
   }
   ```
6. LineCare receives webhook:
   - Stores reading in SensorReading table
   - Checks threshold: 13.2 > 12.0 (critical)
   - Creates SensorAlert
   - Auto-creates WorkOrder:
     - Type: breakdown
     - Title: "High vibration detected on CNC Mill 1"
     - Description: "Vibration reading: 13.2 mm/s (critical threshold: 12.0)"
     - Status: open
     - Priority: high
     - Assigned to: default technician
   - Sends notification to technician
7. Technician receives push notification on mobile
8. Views work order, investigates bearing
9. Completes repair, marks work order complete

**Real-Time Monitoring:**
- IoT Dashboard shows:
  - Machine status grid (running/stopped/alert)
  - Live sensor readings
  - Alert history
- Color coding:
  - Green: normal operation
  - Yellow: warning threshold exceeded
  - Red: critical threshold exceeded

**Predictive Maintenance:**
- Historical sensor data fed to ML model
- Model learns: vibration patterns before failure
- Predicts: "Bearing likely to fail in 7-14 days"
- System creates preventive work order: "Replace bearing on CNC Mill 1"

#### 3.5.3 Email & SMS Notifications

**Notification Events:**
1. **Work Order Assigned**
   - When: technician assigned to work order
   - To: assigned technician
   - Content: WO number, machine, priority, link

2. **Work Order Overdue**
   - When: work order not completed by due date
   - To: assigned technician + manager
   - Content: overdue info, escalation

3. **Preventive Task Due**
   - When: 3 days before PM due date
   - To: assigned technician + manager
   - Content: task details, schedule link

4. **Part Low Stock**
   - When: part quantity < reorder point
   - To: manager
   - Content: part info, current stock, reorder link

5. **Sensor Alert**
   - When: sensor reading exceeds threshold
   - To: technician + manager
   - Content: machine, sensor type, reading, threshold

6. **Budget Exceeded**
   - When: monthly spending > 100% of budget
   - To: manager
   - Content: budget vs actual, variance

7. **Production Run Complete**
   - When: operator ends production run
   - To: manager (optional)
   - Content: OEE score, output summary

**Notification Preferences:**
- Users control: email, SMS, push (mobile app)
- Per notification type
- Example:
  - Email: all notifications
  - SMS: only critical alerts (sensor, overdue)
  - Push: work order assignments

**Setup:**
- Manager configures email server (SMTP or service like SendGrid)
- SMS provider (Twilio, AWS SNS)
- Users set preferences in profile settings

#### 3.5.4 Vendor Portal

**Goal:** Allow suppliers to interact with LineCare

**Features for Vendors:**
1. View purchase orders sent to them
2. Acknowledge receipt
3. Update order status (processing, shipped)
4. Upload shipping tracking info
5. Upload invoices and delivery notes
6. View payment status (if integrated with accounting)

**Access Control:**
- Vendors authenticate with API key
- Can only see their own POs
- Cannot see other company data

**Scenario: Vendor receives PO**

1. Manager sends PO to "ABC Bearings Inc"
2. System sends email to vendor: "New PO #12345"
3. Vendor clicks link → vendor portal
4. Logs in with API key
5. Sees PO details: parts, quantities, delivery address
6. Clicks "Acknowledge" → status: sent → processing
7. When shipped:
   - Vendor updates status → shipped
   - Enters tracking number
   - Uploads packing slip
8. Manager receives notification
9. When delivered:
   - Vendor updates status → delivered
   - Manager receives shipment in LineCare

**Benefits:**
- Faster communication
- Automated status updates
- Reduced emails/phone calls
- Better supplier relationships

### 3.6 Advanced Analytics

#### 3.6.1 MTBF & MTTR

**Mean Time Between Failures (MTBF):**
- Measures reliability
- Formula: `MTBF = Total operating time / Number of failures`
- Higher is better (more reliable)

**Example:**
- Machine runs 720 hours in a month
- 3 breakdowns occur
- MTBF = 720 / 3 = 240 hours
- Meaning: on average, machine runs 240 hours before next failure

**Mean Time To Repair (MTTR):**
- Measures maintenance efficiency
- Formula: `MTTR = Total repair time / Number of repairs`
- Lower is better (faster repairs)

**Example:**
- 3 breakdowns take: 2 hours, 4 hours, 1.5 hours
- Total: 7.5 hours
- MTTR = 7.5 / 3 = 2.5 hours
- Meaning: average repair time is 2.5 hours

**LineCare Calculation:**
1. System tracks all breakdown work orders
2. For MTBF:
   - Gets machine.total_operating_hours (from production runs or manual entry)
   - Counts breakdown work orders
   - Calculates MTBF
3. For MTTR:
   - For each completed breakdown WO: completed_at - started_at
   - Averages repair times

**MTBF/MTTR Dashboard:**
- Cards: avg MTBF, avg MTTR across all machines
- Table: MTBF and MTTR per machine (sorted)
- Trends: MTBF/MTTR over time (are we improving?)
- Benchmarks: compare to industry standards

**Insights:**
- Low MTBF → unreliable machine → investigate root causes
- High MTTR → slow repairs → need training or better parts availability
- Improving MTBF → preventive maintenance is working
- Improving MTTR → technicians are getting more efficient

#### 3.6.2 Predictive Maintenance (ML)

**Goal:** Predict failures before they happen

**How It Works:**
1. Collect data:
   - Work order history (when failures occurred)
   - Sensor data (vibration, temperature over time)
   - Production data (usage patterns)
   - Maintenance history (last PM dates)

2. Train ML model:
   - Use historical data to find patterns
   - Example: vibration increases 2 weeks before bearing failure
   - Model learns: when vibration > X for Y days → failure likely in Z days

3. Generate predictions:
   - Model runs daily on current sensor data
   - Outputs: "Bearing failure predicted in 10 days (75% confidence)"

4. Create preventive work order:
   - Auto-generate: "Replace bearing on CNC Mill 1"
   - Schedule: before predicted failure date
   - Assign to technician

5. Technician performs preventive replacement:
   - Prevents breakdown
   - Avoids unexpected downtime
   - More cost-effective than reactive repair

**Models Supported:**
- Time-series analysis (trend detection)
- Classification (failure vs non-failure)
- Anomaly detection (unusual patterns)

**Requirements:**
- Sufficient historical data (6+ months)
- Sensor data or detailed work order logs
- Periodic retraining as new data arrives

**Prediction Dashboard:**
- List of machines with predictions
- Failure likelihood (low/medium/high)
- Predicted date
- Recommended actions
- Confidence score

#### 3.6.3 Pareto Analysis (80/20 Rule)

**Principle:** 80% of problems come from 20% of causes

**LineCare Applications:**

1. **Machines:**
   - 20% of machines cause 80% of breakdowns
   - Chart: bars showing breakdown count per machine
   - Cumulative line showing % of total
   - Identifies: problem machines needing attention

2. **Failure Causes:**
   - 20% of causes account for 80% of downtime
   - Chart: bars for each cause category
   - Focus maintenance efforts on top causes

3. **Parts:**
   - 20% of parts account for 80% of cost
   - Identifies: high-cost parts to negotiate or find alternatives

4. **Work Orders:**
   - 20% of work orders consume 80% of labor hours
   - Identifies: complex/recurring issues

**Pareto Chart:**
- Bars: frequency/cost per item (descending)
- Line: cumulative percentage
- Marks 80% threshold
- Interactive: click bar to drill down

**Actionable Insights:**
- Focus improvement efforts on the vital few (top 20%)
- Example: If 3 machines cause 80% of downtime → prioritize those for PM upgrades

#### 3.6.4 Custom Dashboards

**Goal:** Let users create personalized views

**Dashboard Builder:**
- Drag-and-drop interface
- Widget library:
  - **Metric Cards:** KPIs (open WOs, OEE, costs)
  - **Charts:** line, bar, pie, gauge
  - **Tables:** recent work orders, low stock parts
  - **Lists:** overdue tasks, sensor alerts
- Resize and arrange widgets
- Save layouts

**Widget Configuration:**
- Data source: work orders, machines, parts, OEE
- Filters: date range, machine, location
- Aggregation: count, sum, average
- Visualization: choose chart type

**Sharing:**
- Save as: "My Dashboard", "Team Dashboard"
- Set as default for role (e.g., all technicians see this)
- Export to PDF/email (scheduled reports)

**Examples:**

**Operator Dashboard:**
- Current shift OEE gauge
- My open work orders list
- Downtime log quick access

**Technician Dashboard:**
- Assigned work orders (priority sorted)
- Upcoming preventive tasks
- Parts I frequently use (quick access)

**Manager Dashboard:**
- Overall OEE trend
- Cost summary (budget vs actual)
- Top 5 problem machines
- Low stock alerts
- Overdue work orders

### 3.7 Mobile Native Apps

**Why Native Apps?**
- Better performance (faster, smoother)
- Offline functionality (work without internet)
- Push notifications (instant alerts)
- Device features (camera, GPS, barcode scanner)

#### 3.7.1 Operator Mobile App

**Key Features:**

1. **Quick Breakdown Reporting:**
   - Large "Report Breakdown" button on home screen
   - Scan QR code on machine (auto-selects machine)
   - Voice input for description
   - Camera for photos (multiple angles)
   - Submit even if offline (syncs when online)

2. **Downtime Logging:**
   - Quick access: "Log Downtime" button
   - Preset categories (tap to select)
   - Timer shows duration
   - Stop with one tap

3. **My Work Orders:**
   - Simple list view
   - Status badges (color-coded)
   - Tap to view details
   - Read-only (can't edit)

4. **Notifications:**
   - Push: when work order status changes
   - Badge count for updates

**Design Principles:**
- Minimal taps (1-2 taps to start reporting)
- Large touch targets (finger-friendly)
- Offline-first (data syncs in background)
- Dark mode support (for factory floor)

#### 3.7.2 Technician Mobile App

**Key Features:**

1. **Work Order Management:**
   - List: assigned to me, by priority
   - Swipe actions: start work, complete, call for help
   - Detail view: all WO info
   - Status change: single tap buttons

2. **Time Tracking:**
   - Timer widget: start/stop work
   - Auto-logs time to work order
   - Break timer (excluded from work time)
   - Manual time entry if needed

3. **Parts Lookup:**
   - Search spare parts
   - Check stock availability
   - Request parts (creates requisition)
   - Barcode scanner for quick lookup

4. **Photo Documentation:**
   - Before/after photos
   - Annotate images (circle problems)
   - Attach to work orders automatically

5. **Digital Signature:**
   - Sign off on completed work
   - Supervisor signature for critical work
   - Stored with maintenance log

6. **Offline Mode:**
   - Download assigned WOs for the day
   - Work offline (no internet in factory areas)
   - Auto-sync when back online
   - Conflict resolution (if WO changed remotely)

#### 3.7.3 Manager Mobile App

**Key Features:**

1. **Dashboard:**
   - Same metrics as web dashboard
   - Swipeable cards
   - Tap to drill down

2. **Approvals:**
   - Review work orders needing approval
   - Approve/reject with reason
   - Swipe gestures

3. **Alerts:**
   - Real-time push for critical issues
   - Sensor alerts, budget overages
   - Tap to view details

4. **Quick Actions:**
   - Create work order
   - Assign technician
   - Adjust stock (emergency)

5. **Reports:**
   - View pre-built reports
   - Filter and export
   - Schedule delivery (email PDF)

**Cross-Platform:**
- iOS (Swift + SwiftUI)
- Android (Kotlin + Jetpack Compose)
- Shared logic via API

### 3.8 Compliance & Documentation

#### 3.8.1 Audit Trail

**What Gets Logged:**
- All changes to critical records:
  - Work orders (status, assignment, completion)
  - Machines (updates, archiving)
  - Parts (stock adjustments)
  - Preventive tasks (schedule changes)
- Who made the change (user)
- When (timestamp)
- What changed (old value → new value)
- Where (IP address)

**Audit Log Format:**
```json
{
  "id": 12345,
  "user": "John Doe (Technician)",
  "action": "updated",
  "model": "WorkOrder",
  "model_id": 789,
  "changes": {
    "status": {
      "old": "in_progress",
      "new": "completed"
    },
    "completed_at": {
      "old": null,
      "new": "2025-01-20 14:30:00"
    }
  },
  "ip_address": "192.168.1.100",
  "created_at": "2025-01-20 14:30:05"
}
```

**Viewing Audit Logs:**
- Manager-only access
- Filterable by:
  - User
  - Date range
  - Model type (work orders, machines, etc.)
  - Action (create, update, delete)
- Searchable
- Exportable (CSV for auditors)

**Use Cases:**
- Compliance audits (ISO 9001, FDA regulations)
- Investigating discrepancies
- User activity monitoring
- Security incident response

#### 3.8.2 Compliance Reporting

**Goal:** Generate reports for regulatory compliance

**Report Types:**

1. **Maintenance Completion Certificate:**
   - For specific machine or work order
   - Shows: what was done, by whom, when
   - Includes: parts used, time spent, signatures
   - Printable/PDF with company letterhead

2. **Preventive Maintenance Schedule Report:**
   - Shows: all PM tasks, frequencies, completion rates
   - Proves: company follows PM schedule
   - Filterable by machine, date range

3. **Calibration Records:**
   - For regulated industries (pharma, food)
   - Tracks: when machines calibrated, by whom
   - Links to work orders with calibration tag

4. **Safety Inspection Reports:**
   - If work orders tagged as safety inspections
   - Shows: all safety checks completed
   - Pass/fail status

5. **Document Control:**
   - Versioned documents (SOPs, work instructions)
   - Shows: who approved, when, what changed
   - Ensures: only current versions used

**Generating Reports:**
1. Manager goes to Reports → Compliance
2. Selects report type
3. Applies filters (date range, machines, etc.)
4. Clicks "Generate"
5. System compiles data from database
6. Outputs: PDF or Excel
7. Optional: digitally sign PDF (if configured)

#### 3.8.3 Document Management

**Goal:** Store and organize documents related to maintenance

**Document Types:**
- Machine manuals (PDF)
- Wiring diagrams (images, CAD files)
- Safety data sheets (SDS for chemicals)
- Work instructions (step-by-step procedures)
- Calibration certificates
- Warranty documents
- Training materials

**Organization:**
- Documents attached to:
  - Machines (manual, diagram)
  - Work orders (photos, reports)
  - Spare parts (SDS, specs)
  - Users (certifications, training)

**Version Control:**
- Upload new version → old version archived
- Maintains history (who uploaded, when)
- Can view/restore old versions
- Compare versions (diff)

**Permissions:**
- Public: everyone can view (manuals)
- Restricted: role-based (sensitive docs)
- Approval workflow: manager must approve uploads

**Search & Access:**
- Full-text search across document contents
- Filter by type, machine, date
- Quick access: machine detail page → Documents tab
- Download or view inline (for PDFs, images)

**Scenario: Technician needs machine manual**

1. Opens work order for "CNC Mill 1"
2. Clicks "View Machine Details"
3. Navigates to "Documents" tab
4. Sees list: Manual, Wiring Diagram, Maintenance SOP
5. Clicks "Manual" → opens PDF viewer
6. Zooms to relevant section
7. Completes repair

---

## 4. Implementation Strategy

### 4.1 Recommended Build Order

**Priority 1 (Immediate Value):**
1. Spare Parts Management (Phase 5)
   - Most requested by users
   - Directly improves work order flow
   - 3-4 weeks

2. Cost Tracking (Phase 7)
   - Leverages spare parts data
   - Shows ROI to stakeholders
   - 2 weeks

**Priority 2 (Operational Efficiency):**
3. Email Notifications (Phase 8.3)
   - Quick win (1 week)
   - Improves communication

4. OEE Tracking (Phase 6)
   - Higher complexity
   - Requires production data entry
   - 3 weeks

**Priority 3 (Advanced Features):**
5. ERP/IoT Integrations (Phase 8.1-8.2)
   - Customer-specific setup
   - 4-6 weeks (varies by ERP)

6. Advanced Analytics (Phase 9.1-9.2)
   - Needs data volume first
   - 2-3 weeks

**Priority 4 (Enhanced Experience):**
7. Mobile Native Apps (Phase 9.3)
   - Current web-mobile is functional
   - 6-8 weeks (iOS + Android)

8. Compliance & Docs (Phase 10)
   - Industry-specific needs
   - 2-3 weeks

### 4.2 Technical Considerations

**Database:**
- Add indexes for new queries (OEE calculations, cost summaries)
- Consider partitioning for time-series data (sensor readings)
- Implement archiving for old data (>2 years)

**Performance:**
- Cache dashboard metrics (Redis)
- Background jobs for heavy calculations (OEE, predictions)
- Optimize N+1 queries (eager load relationships)

**Security:**
- Encrypt sensitive data (labor rates, costs, supplier pricing)
- Secure file uploads (scan for malware)
- API key management for integrations (rotate regularly)

**Scalability:**
- Horizontal scaling ready (stateless API)
- Queue system for integrations (RabbitMQ/SQS)
- CDN for static assets and documents

### 4.3 Data Migration

**From MVP to V2:**
1. Add new tables (spare parts, OEE, costs, etc.)
2. Backfill data:
   - Extract parts mentioned in work order notes → create spare parts (manual or AI-assisted)
   - Estimate labor costs for past work orders (if hours logged)
3. No disruption to existing data
4. Gradual adoption (users don't need to use all V2 features immediately)

---

## 5. Success Metrics for V2

**Spare Parts:**
- Inventory accuracy: >95%
- Stockout incidents: <5 per month
- Parts cost tracking: 100% of parts usage logged

**OEE:**
- OEE data capture rate: 80% of production shifts
- Average OEE improvement: +5-10% within 6 months
- Downtime categorization accuracy: 90%

**Costs:**
- Cost visibility: 100% of maintenance costs tracked
- Budget adherence: within ±10%
- Cost per unit produced: tracked and trending down

**Integrations:**
- ERP sync uptime: >99%
- IoT sensor coverage: 50% of critical machines in year 1
- Notification delivery rate: >98%

**User Adoption:**
- Active users (V2 features): 70% within 3 months
- Mobile app downloads: 50% of operators and technicians
- Dashboard customization: 30% of managers create custom dashboards

**Business Impact:**
- Unplanned downtime: reduced by 20%
- Maintenance costs: reduced by 15%
- Spare parts carrying cost: reduced by 10%
- MTBF: increased by 15%
- MTTR: reduced by 20%

---

## 6. Future Roadmap (Beyond V2)

**Energy Management:**
- Track machine energy consumption
- Identify energy waste
- Calculate carbon footprint

**Asset Lifecycle Management:**
- Depreciation tracking
- Replacement planning
- Total cost of ownership (TCO)

**Work Order Scheduling Optimization:**
- AI-powered scheduling (assign techs based on skills, location, workload)
- Route optimization for multi-machine facilities

**Collaborative Maintenance:**
- Team chat within work orders
- Video call support for remote assistance
- Shared AR overlays (point to problem parts)

**Advanced Quality Integration:**
- Link quality defects to maintenance issues
- Root cause analysis across quality and maintenance
- Statistical process control (SPC) integration

---

This V2 PRD provides a comprehensive vision for transforming LineCare into a world-class CMMS while maintaining the simplicity and usability that made the MVP successful. Each feature builds logically on the foundation, creating a powerful yet intuitive maintenance management platform.
