# CMMS MVP - Product Requirements Document

## 1. MVP Scope & Phases

### Goal of MVP
Solve this one simple thing:

> "Small factories can log machines, breakdowns and basic preventive tasks in one place, and see which machines cause the most downtime."

### Non-goals (for later)
- No full spare parts system
- No complex OEE, energy, or cost modules
- No deep integrations (ERP, sensors, etc.)
- No native apps (mobile-friendly web only for v1)

### Rough Phases

**Phase 1 – Foundations**
- Auth, users, roles
- Basic assets (machines, locations)

**Phase 2 – Maintenance Flow**
- Breakdown / work order flow
- Preventive maintenance basics

**Phase 3 – Insights**
- Simple dashboards & lists
- Filtering by machine/date/cause

**Phase 4 – Pilot-ready**
- Seed data import (CSV)
- Basic permissions & UX polish

---

## 2. Core Entities & Relationships

### User
- Belongs to one **Company**
- Has one **Role** (e.g. operator, technician, manager)

### Company
- Has many **Locations**
- Has many **Users**
- Has many **Machines**
- Has many **WorkOrders**
- Has many **PreventiveTasks**

### Location
- Belongs to **Company**
- Has many **Machines**

### Machine
- Belongs to **Company**
- Optionally belongs to **Location**
- Has many **WorkOrders**
- Has many **PreventiveTasks**
- Has many **MaintenanceLogs**

### WorkOrder
- Belongs to **Company**
- Belongs to **Machine**
- Created by a **User**
- Assigned to a **User** (technician)
- Has one **WorkOrderType** (breakdown / corrective / preventive)
- Has one **Status** (open / in progress / completed / cancelled)
- Can be linked to a **PreventiveTask** (when PM generates a WO)

### PreventiveTask
- Belongs to **Company**
- Belongs to **Machine**
- Creates many **WorkOrders** over time (recurring schedule)
- Has one **Schedule** (time-based: every X days/months)

### MaintenanceLog
- Belongs to **WorkOrder**
- Belongs to **User** (technician who did the work)
- Used to store notes about what was done

### CauseCategory
- Belongs to **Company**
- Used by **WorkOrders** (root cause / category field)

---

## 3. Features & How They Work Together

### 3.1 Authentication & Roles

Users log in. Each user has:
- **Company**
- **Role:**
  - **Operator** – can:
    - Create breakdown reports (new WorkOrder with type "breakdown")
    - See own machine's open work orders
  - **Technician / TD** – can:
    - See all work orders
    - Change status (open → in progress → completed)
    - Enter maintenance logs
  - **Manager** – can:
    - See dashboards
    - Manage machines, preventive tasks, cause categories, users

### 3.2 Asset Management (Machines & Locations)

**Key flows:**

Manager or TD adds machines:
- Minimal fields: name, code, location, maybe criticality

Machines appear in:
- Work order form as selectable list
- Dashboard (breakdowns, downtime per machine)
- Preventive tasks (you attach PM to machines)

**Interaction:**

When adding a machine, you can:
- Assign it to a Location
- See its work order history later from the machine detail page

### 3.3 Breakdown Flow (WorkOrders – Reactive)

**Scenario: operator reports a breakdown**

1. Operator opens a simple "Report breakdown" screen:
   - Select machine
   - Short description
   - Optional: cause category, photo, and time breakdown started

2. This creates a **WorkOrder**:
   - `type = breakdown`
   - `status = open`
   - `created_by = operator`

3. Technicians see a work order list:
   - Filter by status, machine, location
   - Sort by newest / most critical (later you can add priority)

4. Technician picks a work order:
   - Set status to "in progress"
   - After completion:
     - Set status "completed"
     - Fill fields like actual start/end times, cause category, what was done
   - This completion creates a **MaintenanceLog** linked to that WorkOrder & Machine

**Result:**

Later you can do simple reports:
- Count of breakdown WOs per machine
- Total recorded downtime per machine
- Breakdowns by cause category

### 3.4 Preventive Maintenance (PreventiveTasks + WorkOrders)

**Scenario: manager sets up periodic tasks**

1. Manager goes to Preventive tasks:
   - Select machine
   - Describe the task (e.g. "Quarterly lubrication", "Visual inspection belts")
   - Define schedule (e.g. every 3 months)
   - Optionally assign default technician or team

2. The system:
   - Generates future WorkOrders according to schedule (or at MVP: only generate when due date is near, e.g. a few days before)

3. Technicians see planned tasks in the same work order list:
   - Filter by "planned / preventive"
   - Mark as completed when done

4. When completed:
   - Work order status = completed
   - Log entry in MaintenanceLog

**Interaction:**

- PreventiveTask → generates WorkOrders
- WorkOrders created from PreventiveTasks count as "done / overdue" in PM overview

You can show:
- List of upcoming tasks
- List of overdue tasks

### 3.5 Dashboard & Reporting

For MVP, keep it very simple.

**Home / dashboard for manager:**

Cards / tiles:
- Open work orders
- Overdue preventive tasks
- Breakdowns in last 7 / 30 days

**Top machines list:**
- 5 machines with most breakdown work orders in a chosen period

**Filter:**
- By date range
- By location

**Machine detail page:**
- Machine info
- List of latest work orders
- Count of breakdown vs preventive WOs in last 90 days

**Work order list page:**

Table with filters:
- Status
- Type (breakdown / preventive)
- Machine
- Date range

This is enough to start talking with managers and show insight.

### 3.6 CSV Import / Quick Onboarding

**Scenario: onboarding a pilot factory**

1. Manager exports their current machine list to CSV
2. You provide a simple CSV import screen:
   - Upload file
   - Map columns (name, code, location, etc.)
   - See preview
   - Confirm import

This reduces friction to start with real data.

---

## 4. Implementation Plan

### Step 1 – Skeleton
- Set up backend + frontend framework of your choice
- Set up auth & user accounts with:
  - Company
  - Role

### Step 2 – Assets
- Implement Company, Location, Machine entities
- Build minimal UI:
  - List of machines
  - Add/edit machine
  - Filter by location

### Step 3 – Work Orders
- Implement WorkOrder + MaintenanceLog + CauseCategory
- UI:
  - "Report breakdown" form (operator-friendly)
  - Work order list (TD)
  - Work order detail (status change + log)

### Step 4 – Preventive Tasks
- Implement PreventiveTask + scheduling mechanism
- UI:
  - Preventive task list + creation form
  - Planned tasks within work order list

### Step 5 – Dashboard
- Implement simple queries for dashboard numbers
- UI:
  - Dashboard page with tiles + top machines
  - Machine detail page

### Step 6 – Import & Polish
- CSV import for machines
- Basic validation and error messages
- Mobile-friendly layout for key screens
