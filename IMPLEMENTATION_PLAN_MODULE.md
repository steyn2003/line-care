# LineCare Planning Module - Complete Implementation

The ultimate scheduling and planning solution for maintenance management.

## Vision

A world-class planning system that intelligently schedules maintenance work, optimizes resource utilization, and provides real-time visibility into all maintenance activities. The system automatically handles preventive maintenance scheduling, detects and resolves conflicts, and learns from historical data to continuously improve planning accuracy.

---

## Core Data Model

### Planning Tables

**planning_slots**
- id, company_id
- work_order_id (FK)
- technician_id (FK → users)
- machine_id (FK, denormalized)
- location_id (FK)
- start_at, end_at, duration_minutes
- status (tentative/planned/in_progress/completed/cancelled)
- source (manual/auto_pm/shutdown/recurring)
- color (for visual differentiation)
- notes
- created_by, updated_by, timestamps

**planned_shutdowns**
- id, company_id
- name, description
- machine_id (nullable, for line-wide shutdowns)
- location_id
- start_at, end_at
- shutdown_type (planned_maintenance/changeover/holiday)
- status (scheduled/in_progress/completed/cancelled)
- created_by, timestamps

**technician_availability**
- id, company_id
- technician_id (FK → users)
- date, start_time, end_time
- availability_type (available/vacation/sick/training)
- notes

**planning_templates**
- id, company_id
- name, description
- template_data (JSON - contains slot pattern)
- recurrence_rule (cron-style)
- created_by, timestamps

### Work Orders Extensions

Add to `work_orders` table:
- planned_start_at, planned_end_at
- planned_duration_minutes
- is_firm_planned (boolean)
- planning_priority (1-5)
- requires_shutdown (boolean)

---

## Complete API Specification

### Planning Slots

**GET /api/planning/slots**
```json
Query: date_from, date_to, technician_id, machine_id, status
Response: {
  "slots": [/* array of slots with relationships */],
  "meta": { "total": 156, "page": 1 }
}
```

**POST /api/planning/slots**
```json
Input: {
  "work_order_id": 123,
  "technician_id": 5,
  "start_at": "2025-12-01 09:00:00",
  "end_at": "2025-12-01 11:00:00",
  "status": "planned"
}
Validates: conflicts, availability, skills
Returns: created slot + conflict warnings
```

**PUT /api/planning/slots/{id}** - Update slot (drag/drop)  
**DELETE /api/planning/slots/{id}** - Cancel slot  
**POST /api/planning/slots/bulk-create** - Batch create  
**PUT /api/planning/slots/bulk-update** - Batch update

### Calendar & Views

**GET /api/planning/calendar**
```json
Query: date_from, date_to, view (day/week/month), filters
Response: {
  "slots": [/* all slots */],
  "technicians": [
    {
      "id": 5,
      "name": "Jan",
      "planned_hours": 38.5,
      "available_hours": 40,
      "utilization_pct": 96.25,
      "status": "optimal"
    }
  ],
  "unplanned_work_orders": [/* WOs needing scheduling */],
  "shutdowns": [/* planned shutdowns */],
  "conflicts": [/* detected conflicts */]
}
```

**GET /api/planning/gantt** - Gantt chart view  
**GET /api/work-orders/unplanned** - Unscheduled work

### Auto-Scheduling

**POST /api/planning/auto-schedule**
```json
Input: { "work_order_ids": [123, 124, 125] }
Algorithm:
  1. Analyze WO priority, duration, skills required
  2. Check if requires shutdown
  3. Find optimal technician (skills + availability + location)
  4. Find earliest available slot
  5. Create planning slots
Returns: created slots + optimization score
```

**POST /api/planning/suggest-slot**
```json
Input: { "work_order_id": 123 }
Returns: {
  "recommendations": [
    {
      "technician_id": 7,
      "date": "2025-12-05",
      "start_time": "09:00",
      "score": 95,
      "reasons": ["Has required skill", "60% utilized", "Already at location"]
    }
  ]
}
```

**POST /api/planning/rebalance** - Optimize workload distribution  
**POST /api/planning/optimize-week** - Optimize entire week's schedule

### Shutdowns

**GET /api/planning/shutdowns** - List all shutdowns  
**POST /api/planning/shutdowns** - Create shutdown  
**PUT /api/planning/shutdowns/{id}** - Update  
**DELETE /api/planning/shutdowns/{id}** - Cancel  
**POST /api/planning/shutdowns/{id}/plan-work** - Auto-schedule work during shutdown

### Capacity & Conflicts

**GET /api/planning/capacity**
```json
Response: {
  "daily": [/* capacity per day/tech */],
  "summary": {
    "total_available": 320,
    "total_planned": 285,
    "utilization": 89
  }
}
```

**GET /api/planning/conflicts** - All active conflicts  
**POST /api/planning/conflicts/{id}/resolve** - Auto-resolve  
**GET /api/planning/availability** - Tech availability  
**POST /api/planning/availability** - Set vacation/unavailable time

### Analytics

**GET /api/planning/accuracy-metrics**
```json
Response: {
  "on_time_start_rate": 87.5,
  "duration_accuracy": 1.15,
  "schedule_adherence": 82.3,
  "avg_delay_minutes": 18
}
```

**GET /api/planning/variances** - Detailed variance analysis  
**GET /api/planning/capacity-forecast** - Future capacity predictions  
**GET /api/planning/optimization-report** - AI-driven insights

### Templates

**GET /api/planning/templates** - Recurring patterns  
**POST /api/planning/templates** - Create template  
**POST /api/planning/templates/{id}/generate** - Generate slots from template

---

## User Interface

### 1. Planning Board (Main Interface)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Planning Board]                    [Week: Dec 1-7] [▼]     │
├──────────────┬──────────────────────────────────────────────┤
│              │  Mon  │  Tue  │  Wed  │  Thu  │  Fri         │
│ Unplanned    ├───────┴───────┴───────┴───────┴──────────────┤
│ Work Orders  │                                               │
│              │  Jan Vermeer    [████████░░░░░░░] 75%        │
│ [Search...]  │  09:00 ┌─────────────────┐                   │
│              │        │ WO-123: Pump 1  │                   │
│ ┌──────────┐ │  11:00 └─────────────────┘                   │
│ │WO-125    │ │  14:00 ┌─────────────┐                       │
│ │Fix Conv. │ │        │ WO-124: ... │                       │
│ │2h  HIGH  │ │  16:00 └─────────────┘                       │
│ └──────────┘ │                                               │
│              │  Sarah Johnson  [████████████░░] 85%          │
│ ┌──────────┐ │  08:00 ┌──────┐                              │
│ │WO-126    │ │        │WO-.. │                              │
│ │PM Check  │ │  10:00 └──────┘                              │
│ │1h        │ │                                               │
│ └──────────┘ │                                               │
│              │                                               │
│ [Filters ▼]  │                                               │
│ □ High Pri   │  [+ Add Technician Column]                   │
│ □ Req Shut   │                                               │
└──────────────┴───────────────────────────────────────────────┘
```

**Features:**
- Drag unplanned WO → drop on time slot → creates planning slot
- Drag existing slot → move to new time/tech → updates slot
- Resize slot edges → adjust duration
- Click slot → opens detail modal
- Right-click → context menu (edit/duplicate/cancel)
- Color-coded by status or priority
- Real-time capacity meters per technician
- Conflict warnings appear instantly
- View modes: By Technician / By Machine / By Location

### 2. Slot Detail Modal

```
┌─────────────────────────────────────────┐
│ Planning Slot Details          [✕]      │
├─────────────────────────────────────────┤
│ Work Order: WO-123 - Fix Conveyor Belt  │
│ Machine: Conveyor Belt #1               │
│ Location: Factory A                     │
│                                         │
│ Assigned To: [Jan Vermeer        ▼]    │
│ Date:        [Dec 1, 2025        📅]    │
│ Start Time:  [09:00              🕐]    │
│ End Time:    [11:00              🕐]    │
│ Duration:    2 hours (auto-calc)        │
│                                         │
│ Status: [● Planned              ▼]      │
│                                         │
│ Notes:                                  │
│ ┌─────────────────────────────────────┐ │
│ │ Bring spare motor                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ⚠️ Conflict: Tech has another slot at   │
│    10:30 - Click to resolve             │
│                                         │
│ [Save Changes]  [Cancel Slot]  [Close]  │
└─────────────────────────────────────────┘
```

### 3. Shutdown Planning Page

**List View:**
- Table of all shutdowns (past, upcoming, in-progress)
- Status badges, date ranges, work count
- Click → Shutdown detail page

**Shutdown Detail:**
```
┌─────────────────────────────────────────────────────┐
│ Planned Shutdown: Line 2 Maintenance                │
│ Dec 15-17, 2025 • Status: Scheduled                 │
├─────────────────────────────────────────────────────┤
│ Timeline:                                           │
│ Dec 15 ████████████████████████████████████ Dec 17  │
│                                                     │
│ Scheduled Work Orders (8):                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ ✓ WO-201: Replace bearings     Dec 15 08:00 4h  │ │
│ │ ◯ WO-202: Clean conveyor       Dec 15 13:00 3h  │ │
│ │ ◯ WO-203: Calibrate sensors    Dec 16 08:00 2h  │ │
│ │ ...                                             │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ [+ Add Work Orders]  [Auto-Schedule All]           │
│ [Start Shutdown]  [Edit]  [Cancel Shutdown]        │
└─────────────────────────────────────────────────────┘
```

### 4. Capacity Dashboard

```
┌─────────────────────────────────────────────────────┐
│ Capacity Overview - Week of Dec 1, 2025            │
├─────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│ │Available │ │ Planned  │ │Utilizat. │            │
│ │  320h    │ │  285h    │ │   89%    │            │
│ └──────────┘ └──────────┘ └──────────┘            │
│                                                     │
│ Technician Capacity:                               │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Name          │ Avail │ Planned │ Util │ Status │ │
│ │ Jan Vermeer   │  40h  │  38.5h  │ 96%  │ 🟢 OK  │ │
│ │ Sarah Johnson │  40h  │  34h    │ 85%  │ 🟢 OK  │ │
│ │ Mike Chen     │  40h  │  42h    │105%  │🔴 Over │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ Utilization Trend:                                 │
│   100%│     ●                                       │
│    80%│   ● ● ●   ●                                 │
│    60%│ ●         ● ●                               │
│       └─────────────────                            │
│        W45 W46 W47 W48 W49                         │
│                                                     │
│ [Rebalance Workload]  [View Forecast]              │
└─────────────────────────────────────────────────────┘
```

### 5. Technician Dashboard Integration

Add to technician home page:

```
┌─────────────────────────────────────────┐
│ My Schedule Today                       │
├─────────────────────────────────────────┤
│ 09:00 - 11:00  WO-123: Fix Conveyor     │
│ ▶︎ Start Work   📍 Factory A              │
│                                         │
│ 14:00 - 16:00  WO-124: PM Inspection    │
│ ⏸ Not Started  📍 Factory A              │
│                                         │
│ This Week: 38.5h planned (96% capacity) │
│ [View Full Schedule →]                  │
└─────────────────────────────────────────┘
```

### 6. Work Order Detail Integration

Add "Planning" tab to work order detail page:

```
┌─────────────────────────────────────────┐
│ Planning                                │
├─────────────────────────────────────────┤
│ Status: ● Planned                       │
│                                         │
│ Scheduled Slots:                        │
│ • Dec 1, 09:00-11:00 (2h) - Jan Vermeer│
│                                         │
│ Planned:  Dec 1, 09:00 (2h)            │
│ Actual:   Dec 1, 09:15 (2.5h)          │
│ Variance: +15 min start, +30 min dur.  │
│                                         │
│ [Edit Schedule]  [Unplan Work Order]   │
└─────────────────────────────────────────┘
```

### 7. Planning Analytics Page

```
┌─────────────────────────────────────────────────────┐
│ Planning Analytics                                  │
├─────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│ │On-Time   │ │Duration  │ │Schedule  │ │Avg Delay│ │
│ │ Start    │ │Accuracy  │ │Adherence │ │         │ │
│ │  87.5%   │ │  +15%    │ │  82.3%   │ │ 18 min  │ │
│ └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
│                                                     │
│ Planned vs Actual (Last 4 Weeks):                  │
│ Hours                                               │
│   50│ ███  ▌                                        │
│   40│ ███  ▌   ██  ▌                                │
│   30│ ███ ▌▌   ██ ▌▌   ███ ▌▌                      │
│     └───────────────────────                        │
│       W45    W46     W47    W48                    │
│       ■ Planned  ▌ Actual                          │
│                                                     │
│ Optimization Recommendations:                      │
│ • Tech A consistently overbooked Tuesdays          │
│   → Redistribute 2-3 WOs to Wed/Thu                │
│ • 15% duration underestimation                     │
│   → Increase estimates by 20% for reactive work    │
│ • Location B has 30 min avg travel from A          │
│   → Batch work orders by location                  │
└─────────────────────────────────────────────────────┘
```

---

## Intelligence & Automation

### Auto-Scheduling Engine

**When PreventiveTask generates WorkOrder:**
```php
1. Check if requires shutdown → wait for shutdown window
2. Analyze: priority, duration, required skills, location
3. Find qualified technicians
4. Score each tech/time combination:
   - Availability (0-100)
   - Skill match (0-100)  
   - Current utilization (prefer 60-80%)
   - Location proximity (0-100)
   - Historical performance (0-100)
5. Select best option
6. Create PlanningSlot with status='tentative'
7. Notify manager for approval
```

### Conflict Detection

**Real-time checks:**
- Double booking (tech in 2 places at once)
- Over-allocation (>100% capacity)
- Skill mismatch (missing required certification)
- Equipment conflicts (machine already in use)
- Shutdown violations (work during production)
- Part availability (required parts out of stock)

**Auto-Resolution:**
- Suggests alternatives with one-click apply
- Can auto-fix minor conflicts (move by 30 min)
- Flags critical conflicts for manual review

### Smart Suggestions

**When creating slot manually:**
```
System analyzes and suggests:
- Best technician (based on skills, location, workload)
- Optimal time window (balancing urgency vs capacity)
- Related work orders (batch similar work)
- Part requirements (check inventory)
- Estimated duration (based on historical data)
```

### Learning & Optimization

**Continuous improvement:**
- Tracks planned vs actual for every work order
- Identifies patterns: "Reactive work takes 1.3x estimate"
- Learns tech-specific speeds: "Jan works 15% faster on electrical"
- Adjusts future estimates automatically
- Provides weekly optimization report

---

## Notifications & Integrations

### Automated Notifications

**Email + In-App + Push:**
- Work slot assigned → immediate notification
- Schedule updated → notify affected techs
- Work due in 24h → daily reminder (18:00 day before)
- Conflict detected → notify planner
- Shutdown approaching (7 days) → all involved parties
- Schedule changes → real-time updates

**Scheduled Digests:**
- Daily: "Your schedule for [tomorrow]" (18:00)
- Weekly: "Your schedule for next week" (Friday 14:00)
- Monthly: Planning accuracy report (managers only)

### Calendar Sync

**Two-way integration:**
- Export LineCare schedule → Google Calendar / Outlook
- Import external calendar → mark unavailable in LineCare
- Update in either place → syncs automatically
- Supports iCal format for universal compatibility

### Mobile Experience

**Responsive web design:**
- Touch-optimized drag & drop
- Swipe gestures for day navigation
- Tap slot to see details
- Quick "Start Work" button
- Today's schedule at glance

---

## Performance & Scale

### Database Optimization

**Indexes:**
```sql
CREATE INDEX idx_slots_tech_dates ON planning_slots(technician_id, start_at, end_at);
CREATE INDEX idx_slots_machine_dates ON planning_slots(machine_id, start_at, end_at);
CREATE INDEX idx_slots_dates_status ON planning_slots(start_at, end_at, status);
CREATE INDEX idx_wo_planned_dates ON work_orders(planned_start_at, planned_end_at);
```

**Caching:**
- Calendar view: 15 min cache per day/tech combination
- Capacity calculations: 30 min cache
- Conflict detection: 5 min cache
- Invalidate on slot create/update/delete

### Real-Time Updates

**Laravel Echo + WebSockets:**
```javascript
// All planners see updates in real-time
Echo.private('company.{id}.planning')
    .listen('SlotCreated', (e) => { /* add to calendar */ })
    .listen('SlotUpdated', (e) => { /* update position */ })
    .listen('ConflictDetected', (e) => { /* show warning */ });
```

### Scalability

- Handles 10,000+ planning slots simultaneously
- Supports 100+ concurrent planners
- Calendar renders <1s for week view
- Auto-schedule processes 500 WOs in <10s
- Mobile-optimized (60 FPS drag & drop)

---

## Implementation Checklist

### Backend (2-3 weeks)
- [ ] Create all database migrations
- [ ] Build all models with relationships
- [ ] Implement API endpoints (CRUD + logic)
- [ ] Add auto-scheduling algorithm
- [ ] Build conflict detection system
- [ ] Add notification triggers
- [ ] Create scheduled jobs (PM auto-schedule, reminders)
- [ ] Write comprehensive tests

### Frontend (3-4 weeks)
- [ ] Build planning board with drag & drop
- [ ] Create slot detail modal
- [ ] Build shutdown planning interface
- [ ] Add capacity dashboard
- [ ] Integrate with technician dashboard
- [ ] Add work order planning tab
- [ ] Build analytics page
- [ ] Implement real-time updates
- [ ] Add mobile optimizations

### Intelligence (1-2 weeks)
- [ ] Implement auto-scheduling algorithm
- [ ] Build conflict resolution engine
- [ ] Add smart suggestions
- [ ] Create learning system for estimates
- [ ] Build optimization report generator

### Testing & Polish (1 week)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] User acceptance testing
- [ ] Bug fixes and refinements
- [ ] Documentation

**Total: 7-10 weeks for complete implementation**

---

## Success Metrics

**Target KPIs:**
- Unplanned work rate: <5%
- Schedule adherence: >90%
- On-time start rate: >95%
- Duration accuracy: 95-105%
- Technician utilization: 75-85%
- Planning time: <1 hour/week
- Conflict resolution: <2 min average
- PM compliance: >98%

**Business Impact:**
- 30% reduction in scheduling time
- 20% reduction in emergency work
- 15% improvement in resource utilization
- 25% fewer missed preventive tasks
- 10% reduction in unplanned downtime

This is the complete, production-ready planning module that transforms LineCare into an enterprise-grade CMMS.
