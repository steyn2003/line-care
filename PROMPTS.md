# 5. "Monster Prompts" with Concrete Tasks

These are long prompts you can copy-paste into ChatGPT when you're ready to actually design/build.

I'll keep them model-agnostic but concrete about tasks.

---

## 5.1 Monster Prompt – Backend Structure & APIs
```
You are helping me design the backend for a small CMMS (maintenance app) for small factories.

Don't explain generic concepts, just produce concrete suggestions and structures.

Context:
- Users belong to a Company and have a Role (operator, technician, manager).
- Companies have Locations and Machines.
- Machines have WorkOrders (for breakdowns and preventive maintenance) and PreventiveTasks.
- PreventiveTasks define recurring work; they generate WorkOrders on a schedule.
- MaintenanceLog entries are created when technicians complete WorkOrders.
- WorkOrders have a type (breakdown / preventive), a status (open / in progress / completed / cancelled), and an optional CauseCategory.

Tasks:
1. Propose a clean API structure (REST endpoints) for:
   - auth & current user
   - machines
   - work orders
   - preventive tasks
   - maintenance logs
   - cause categories

2. For each endpoint, list:
   - URL pattern
   - HTTP method
   - the main inputs (without going into low-level field validation)
   - the main outputs (high level – e.g. "returns list of work orders with machine name and status").

3. Show how the preventive task scheduling could work:
   - how to trigger generation of work orders (e.g. daily job)
   - what logic is needed to avoid duplicate work orders for the same due date.

4. Describe authorization rules at endpoint level:
   - what operators can do
   - what technicians can do
   - what managers can do.

Don't design the database tables in detail, focus on endpoints and how they connect to the entities.
```

---

## 5.2 Monster Prompt – Frontend Flows & Screens
```
I am building the frontend for the same small-factory CMMS as before.

The core entities are:
- Company, Location, Machine
- WorkOrder, PreventiveTask, MaintenanceLog, CauseCategory
- User with Role (operator, technician, manager)

I want a mobile-friendly web app.

Tasks:
1. Define the main screens:
   - dashboard (for managers)
   - machine list & machine detail
   - work order list & work order detail
   - "report breakdown" screen (very simple for operators)
   - preventive task list & creation/edit form
   - settings (cause categories, locations, etc.)

2. For each screen, describe:
   - what components are needed
   - what main actions the user can take
   - how navigation works between screens (e.g. from machine detail → filtered work order list).

3. Explain how to make the "report breakdown" flow extremely simple on mobile:
   - minimal steps
   - sensible defaults
   - how to handle slow network.

4. Describe how to visually distinguish:
   - breakdown vs preventive work orders
   - status (open / in progress / completed)
   - overdue preventive tasks.

Don't write code, just give a structured description that I can turn into wireframes and React components later.
```

---

## 5.3 Monster Prompt – Scheduling & PM Logic
```
Same CMMS context as before.

I need help designing the logic for preventive maintenance (PreventiveTask → WorkOrders).

Entities (high level):
- PreventiveTask belongs to Machine and Company.
- PreventiveTask has a schedule (time-based, e.g. every 3 months).
- WorkOrder belongs to Machine and Company, and can optionally be linked to a PreventiveTask.

Tasks:
1. Describe a simple time-based scheduling model:
   - how to store the interval
   - how to determine the next due date.

2. Describe a daily job that:
   - finds tasks that are due soon or overdue
   - creates WorkOrders if they don't exist yet
   - avoids creating duplicate WorkOrders for the same due date.

3. Describe how completing a WorkOrder should update the PreventiveTask (e.g. last_completed_at).

4. Suggest what should happen if:
   - a WorkOrder is cancelled
   - the task schedule is changed
   - the machine is archived.

Keep the answer conceptual and step-by-step, no database schemas.
```

---

## 5.4 Monster Prompt – MVP Analytics & Dashboard Queries
```
Same CMMS product.

I need to design basic analytics for the MVP dashboard.

We want simple answers to:
- how many open work orders?
- how many overdue preventive tasks?
- which machines have the most breakdowns?

Entities:
- Machine
- WorkOrder (with type, status, timestamps, machine reference)
- PreventiveTask (with schedule and optional last_completion)

Tasks:
1. Describe what data we should use to calculate:
   - open work order count
   - breakdowns in a date range
   - top machines by breakdown count
   - simple approximation of total downtime (if we store start and end time in work orders).

2. For each metric, describe the query at a high level:
   - which entity is the main source
   - what filters apply (company, date range, status, type).

3. Suggest how to structure a dashboard API endpoint that returns all metrics needed for the manager home screen in one call.

No SQL or exact code, just the logic and relationships.
```

---

## 5.5 Monster Prompt – Onboarding & CSV Import
```
Same CMMS.

I want a smooth first-time onboarding for a new factory.

Context:
- We want to import machines from a CSV file.
- Companies may have a "location" column but sometimes they don't.
- We only need minimal fields to start.

Tasks:
1. Describe the ideal first-time onboarding flow for a manager:
   - create company account
   - set up locations (optional)
   - import machines from CSV.

2. Describe a CSV import UI:
   - upload step
   - column mapping step
   - validation step
   - confirmation.

3. Explain how to handle:
   - unknown or new locations in the CSV
   - duplicate machines
   - invalid rows.

4. Suggest how to give feedback after import (e.g. how many created, how many skipped).

Don't go into file parsing code, keep it at UX + high-level logic.
```
