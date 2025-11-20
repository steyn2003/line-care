# Work Order Flow – UI Specification

## Overview

This document covers:
- High-level flow (who does what)
- Screen-by-screen UI spec (no model details, just fields & behavior)
- How it works on mobile vs desktop
- A ready-to-use monster prompt you can feed into ChatGPT later for component/code help

---

## 1. High-level Work Order Flow

### Roles

**Operator**
- Reports breakdowns ("machine is down")
- Can see status of their reported work orders (optional, but nice)

**Technician / TD**
- Sees list of open work orders
- Assigns themselves / is assigned
- Starts and completes work orders, logs what was done

**Manager**
- Uses same list & detail views as TD
- Also uses dashboards (separate)

### Flow

1. Operator or technician creates a work order (usually breakdown)
2. It appears in Work Order List (status: open)
3. Technician opens it, moves to "In progress", performs the work
4. Technician completes it, logs downtime, cause, notes
5. It shows up in history & reports

**Note:** Preventive tasks create work orders that follow the same UI flow, just with a "Preventive" tag.

---

## 2. Screen-by-screen UI

### 2.1 Global Navigation (relevant to work orders)

Keep this simple:

**Bottom nav (mobile) or top nav (desktop):**
- "Dashboard"
- "Work Orders"
- "Machines"
- "More" (settings, preventive tasks, profile)

The **Work Orders** item is the main hub for TD + managers.

---

### 2.2 "Report Breakdown" Screen (Operator)

**Goal:** Super low friction. This is often opened on a phone next to a noisy machine.

**Access:**
- Big primary button on main screen for operators: **"+ Report breakdown"**
- Or a floating action button "+" on Work Order List for operators

**Layout (mobile-first):**

**Header:** "Report breakdown"

**Machine picker (required)**
- Searchable dropdown, or
- Scan QR → auto-fill machine (later feature)

**Short description (required)**
- Single-line or short multi-line text
- Placeholder: "What is wrong?" / "Describe the issue"

**Start time**
- Default: "Now"
- Small "Change" link → date/time picker if they want to correct

**Optional quick fields (collapsible "More details")**
- Cause hint (simple dropdown like "Mechanical / Electrical / Process / Other")
- Photos (camera / gallery)
- Priority (Low / Normal / High) – keep optional at MVP

**Submit button**
- Primary button: **"Create work order"**

**Micro behavior:**

On submit:
- Show success toast/snackbar: "Breakdown logged – TD is notified."
- Option: link to "View this work order"

If machine not selected or description empty:
- Inline validation under field, no pop-ups

---

### 2.3 Work Order List (Technician / Manager)

This is the main workspace for TD.

**Entry:**
- Nav → "Work Orders"

**Layout (desktop-ish mental model; on mobile it stacks):**

**Top bar:**
- Page title: "Work Orders"
- Right side: **"+ New work order"** (for TD to create manual WOs, e.g. small tasks)

**Filter bar (row of chips / dropdowns):**

Tabs or filter chips:
- "Open"
- "In progress"
- "Completed"

Dropdown filters:
- Type: All / Breakdown / Preventive
- Machine (dropdown/search)
- Location (if multiple)
- Date range (for completed)

**List of work orders (cards or table rows):**

Each row/card shows:
- **Title:** "Machine name – short description"
- **Badges:**
  - Type badge: "Breakdown" or "Preventive"
  - Status badge: "Open", "In progress", "Completed"
- **Sub-info row:**
  - Machine name (if not in title)
  - Location
  - Created time (e.g. "Today 10:34")
  - For breakdowns: maybe age ("30 min open")
- **Right side (or bottom on mobile):**
  - Small status icon
  - Optional quick action for technicians:
    - "Start" (for open)
    - "Complete" (for in progress)
  - Or just a chevron ">" to detail

**Interactions:**
- Tap row → Work Order Detail
- Filters update list without full page reload

**For operators:**
- Default filter shows "My reported" or "All" depending on UX choice
- They see fewer filters, maybe just status & machine

---

### 2.4 Work Order Detail Screen

This is where the TD does most of the work.

**Header section:**

**Title:**
- "Machine name – [short description / WO number]"

**Badges:**
- Type badge: Breakdown / Preventive
- Status pill: Open / In progress / Completed (color-coded)

**Primary action button (based on status and role):**
- If Open → **"Start work"**
- If In progress → **"Complete"**
- If Completed → no primary action, maybe "Reopen" (later)

**Summary section:**
- Machine (clickable → machine detail)
- Location
- Created date/time & created by (user name)
- For preventive WOs: show link: "Generated from [Preventive Task name]"

**Optional summary fields:**
- Priority (if used)
- Due date (especially for preventive)

**Details section:**
- Description (more space than list)
- Cause category (dropdown – editable when closing)
- Attachments / photos
  - Thumbnails that open a viewer on tap

**Activity / timeline section:**

Simple chronological list:
- Created [time] by [user]
- Status changed to "In progress" by [user]
- Status changed to "Completed" by [user]
- Notes entries (MaintenanceLog style) with text

**Technician actions:**

**When Open:**
- **"Start work"** button:
  - On click → status = In progress
  - Optionally set "Actual start time" (default now)

**When In progress:**
- **"Complete"** button:
  - Opens a completion sheet/modal (mobile: slide-up sheet) with:
    - End time (default now)
    - Downtime duration (auto-calculated from start/end, but editable)
    - Cause category (required or strongly encouraged)
    - What was done (textarea)
  - Confirm → status = Completed, add MaintenanceLog entry

**For breakdown vs preventive:**

**Breakdown:**
- Emphasis on cause and downtime

**Preventive:**
- Emphasis on checklist / "done/not done" and notes
- For MVP: can just be a "completed with notes" flow with a "Preventive" label; checklists later

---

### 2.5 Quick-create Work Order for Technicians

Sometimes techs will create WOs themselves (e.g. small internal tasks).

**From Work Order List:**
- Button: **"+ New work order"**

**Form (similar to breakdown popup, but for TD):**
- Machine (required)
- Type (default: Breakdown, but can be Preventive Manual / Other)
- Description
- Optionally start immediately with status "In progress"

This uses the same Work Order Detail screen afterwards.

---

### 2.6 How Preventive Tasks Show as Work Orders

When a PreventiveTask generates a WorkOrder:

**In list:**
- Type badge = "Preventive"
- Title could be "Machine – [PreventiveTask name]"
- Due date visible

**In detail:**
- A line under header:
  - "Preventive task: [Task name] (every 3 months)"
  - Clicking that shows the recurrent task definition (later)

Technicians still just start/complete these like normal WOs.

---

## 3. Mobile vs Desktop Behavior

### On Mobile

**Work Order List:**
- Use cards instead of table
- Filter bar becomes:
  - Horizontal scrollable chips at top

**Work Order Detail:**
- Header (title + badges + primary action)
- Then vertically stacked sections: Summary → Details → Activity
- "Complete" opens a bottom sheet, so time/cause/notes edit don't jump away

**"Report breakdown":**
- Full-screen form, big fields and buttons
- Big tap targets, no tiny text

### On Desktop

**Work Order List:**
- Use table layout:
  - Columns: ID, Machine, Type, Status, Created, Assignee (if you add later)
  - Filters in a top bar

**Work Order Detail:**
- Two-column layout if you want:
  - Left: Summary & actions
  - Right: Activity / logs
- Or keep one-column for simplicity at MVP

---

## 4. Monster Prompt for Work Order Flow UI

You can paste this into ChatGPT when you're ready to implement components (React/Next/etc.):
```
I am building the work order flow UI for a small-factory CMMS.

Roles: operator, technician, manager.

Entities involved in the UI (high level): Company, Location, Machine, WorkOrder, PreventiveTask, MaintenanceLog, CauseCategory.

I want you to help me design the UI component structure and interactions, not databases.

Work order flow I want:

1. Operators use a "Report breakdown" screen (mobile-friendly) with:
   - machine picker (required)
   - short description (required)
   - start time (default now)
   - optional cause hint, photos, priority in a "more details" section.

2. Technicians and managers use:
   - a "Work Orders" list with filters by status, type (breakdown/preventive), machine, location, date range.
   - a "Work Order Detail" screen that shows:
     - header with title, type badge, status pill, and primary action button
     - summary (machine, location, created at/by, due date if preventive)
     - description, cause category, attachments
     - activity/timeline (status changes + notes)
   - they can:
     - start an open work order (status open → in progress, set actual start time)
     - complete an in-progress work order via a completion form:
       - end time (default now)
       - downtime duration (auto-calculated but editable)
       - cause category
       - "what was done" notes

3. Preventive work orders are visually tagged as "Preventive" and reference the PreventiveTask they came from.

Tasks:
1. Propose a React component tree for:
   - WorkOrderListPage
   - WorkOrderFilters
   - WorkOrderRow or card
   - WorkOrderDetailPage
   - ReportBreakdownPage
   - WorkOrderCompletionSheet/modal

2. For each component, describe:
   - its props
   - its responsibilities
   - what events it should emit (e.g. onFilterChange, onStatusChange, onComplete).

3. Explain how you would handle:
   - loading states
   - optimistic updates for status changes
   - mobile vs desktop layout differences.

Don't generate full code, just detailed component and interaction descriptions so I can implement them.
```
