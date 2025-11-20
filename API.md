# CMMS API Documentation

**Base URL:** `/api`  
**Authentication:** Bearer Token (Laravel Sanctum)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Machines](#machines)
3. [Work Orders](#work-orders)
4. [Preventive Tasks](#preventive-tasks)
5. [Locations](#locations)
6. [Cause Categories](#cause-categories)
7. [Users](#users)
8. [Dashboard & Analytics](#dashboard--analytics)
9. [Machine Import](#machine-import)

---

## Authentication

### Register User + Company
**POST** `/auth/register`

Creates a new company and manager user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "company_name": "ABC Factory"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "manager",
    "company_id": 1,
    "company": { "id": 1, "name": "ABC Factory" }
  },
  "token": "1|abc123..."
}
```

---

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "manager" },
  "token": "2|xyz789..."
}
```

---

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "manager",
    "company": { "id": 1, "name": "ABC Factory" }
  }
}
```

---

### Logout
**POST** `/auth/logout`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

## Machines

### List Machines
**GET** `/machines`

**Query Parameters:**
- `location_id` (integer, optional) - Filter by location
- `status` (string, optional) - Filter by status: `active`, `archived`

**Response:** `200 OK`
```json
{
  "machines": [
    {
      "id": 1,
      "name": "CNC Mill 1",
      "code": "CNC-001",
      "location_id": 1,
      "location": { "id": 1, "name": "Production Floor A" },
      "criticality": "high",
      "status": "active"
    }
  ]
}
```

---

### Create Machine
**POST** `/machines`

**Permissions:** Technician, Manager

**Body:**
```json
{
  "name": "CNC Mill 1",
  "code": "CNC-001",
  "location_id": 1,
  "criticality": "high"
}
```

**Response:** `201 Created`

---

### Get Machine
**GET** `/machines/{id}`

**Response:** `200 OK`
```json
{
  "machine": {
    "id": 1,
    "name": "CNC Mill 1",
    "code": "CNC-001",
    "location": { "id": 1, "name": "Production Floor A" },
    "criticality": "high",
    "status": "active",
    "work_orders": [ /* last 10 work orders */ ]
  }
}
```

---

### Update Machine
**PUT** `/machines/{id}`

**Permissions:** Technician, Manager

**Body:**
```json
{
  "name": "CNC Mill 1 - Updated",
  "status": "active"
}
```

**Response:** `200 OK`

---

### Archive Machine
**DELETE** `/machines/{id}`

**Permissions:** Manager only

**Response:** `200 OK`
```json
{
  "message": "Machine archived successfully"
}
```

---

### Get Machine Analytics
**GET** `/machines/{id}/analytics`

**Query Parameters:**
- `date_from` (date, optional) - Default: 90 days ago
- `date_to` (date, optional) - Default: today

**Response:** `200 OK`
```json
{
  "breakdown_count": 5,
  "preventive_count": 3,
  "total_downtime_minutes": 240,
  "avg_resolution_time_minutes": 48,
  "breakdowns_by_cause": [
    { "cause": "Mechanical", "count": 3 },
    { "cause": "Electrical", "count": 2 }
  ]
}
```

---

## Work Orders

### List Work Orders
**GET** `/work-orders`

**Query Parameters:**
- `status` (string) - `open`, `in_progress`, `completed`, `cancelled`
- `type` (string) - `breakdown`, `preventive`
- `machine_id` (integer)
- `assigned_to` (integer) - User ID
- `date_from` (date)
- `date_to` (date)

**Response:** `200 OK` (paginated)
```json
{
  "data": [
    {
      "id": 1,
      "title": "Motor not starting",
      "type": "breakdown",
      "status": "open",
      "machine": { "id": 1, "name": "CNC Mill 1" },
      "creator": { "id": 2, "name": "Jane Operator" },
      "assignee": null,
      "created_at": "2024-11-20T10:30:00Z"
    }
  ],
  "current_page": 1,
  "per_page": 20,
  "total": 45
}
```

---

### Create Work Order
**POST** `/work-orders`

**Body:**
```json
{
  "machine_id": 1,
  "type": "breakdown",
  "title": "Motor not starting",
  "description": "Machine won't power on after lunch break",
  "cause_category_id": 3,
  "started_at": "2024-11-20T14:15:00Z"
}
```

**Note:** Operators can only create `breakdown` type work orders.

**Response:** `201 Created`

---

### Get Work Order
**GET** `/work-orders/{id}`

**Response:** `200 OK`
```json
{
  "work_order": {
    "id": 1,
    "title": "Motor not starting",
    "type": "breakdown",
    "status": "in_progress",
    "machine": { "id": 1, "name": "CNC Mill 1", "location": { "name": "Floor A" } },
    "creator": { "id": 2, "name": "Jane Operator" },
    "assignee": { "id": 3, "name": "John Technician" },
    "cause_category": { "id": 3, "name": "Electrical" },
    "description": "Machine won't power on",
    "started_at": "2024-11-20T14:15:00Z",
    "completed_at": null,
    "maintenance_logs": []
  }
}
```

---

### Update Work Order
**PUT** `/work-orders/{id}`

**Permissions:** Technician, Manager

**Body:**
```json
{
  "title": "Motor failure - resolved",
  "status": "completed",
  "assigned_to": 3
}
```

**Response:** `200 OK`

---

### Complete Work Order
**POST** `/work-orders/{id}/complete`

**Permissions:** Technician, Manager

**Body:**
```json
{
  "completed_at": "2024-11-20T16:45:00Z",
  "cause_category_id": 3,
  "notes": "Replaced faulty motor relay",
  "work_done": "Diagnosed electrical issue, replaced relay switch, tested machine",
  "parts_used": "Relay switch (RS-205)"
}
```

**Response:** `200 OK`

Creates a MaintenanceLog entry and updates the work order status to `completed`.

---

### Assign Work Order
**POST** `/work-orders/{id}/assign`

**Permissions:** Technician (assign to self), Manager (assign to anyone)

**Body:**
```json
{
  "assigned_to": 3
}
```

**Response:** `200 OK`

---

### Update Work Order Status
**PATCH** `/work-orders/{id}/status`

**Permissions:** Technician, Manager

**Body:**
```json
{
  "status": "in_progress"
}
```

**Note:** To mark as completed, use the `/complete` endpoint instead.

**Response:** `200 OK`

---

## Preventive Tasks

### List Preventive Tasks
**GET** `/preventive-tasks`

**Permissions:** Technician, Manager

**Query Parameters:**
- `machine_id` (integer)
- `is_active` (boolean) - Default: `true`
- `overdue` (boolean) - Show only overdue tasks

**Response:** `200 OK`
```json
{
  "preventive_tasks": [
    {
      "id": 1,
      "title": "Quarterly lubrication",
      "machine": { "id": 1, "name": "CNC Mill 1" },
      "schedule_interval_value": 3,
      "schedule_interval_unit": "months",
      "next_due_date": "2024-12-15",
      "is_active": true
    }
  ]
}
```

---

### Create Preventive Task
**POST** `/preventive-tasks`

**Permissions:** Manager only

**Body:**
```json
{
  "machine_id": 1,
  "title": "Quarterly lubrication",
  "description": "Lubricate all moving parts and check for wear",
  "schedule_interval_value": 3,
  "schedule_interval_unit": "months",
  "assigned_to": 3
}
```

**Response:** `201 Created`

---

### Get Preventive Task
**GET** `/preventive-tasks/{id}`

**Response:** `200 OK`
```json
{
  "preventive_task": {
    "id": 1,
    "title": "Quarterly lubrication",
    "machine": { "id": 1, "name": "CNC Mill 1" },
    "schedule_interval_value": 3,
    "schedule_interval_unit": "months",
    "next_due_date": "2024-12-15",
    "last_completed_at": "2024-09-15T10:00:00Z",
    "work_orders": [ /* generated work orders */ ]
  }
}
```

---

### Update Preventive Task
**PUT** `/preventive-tasks/{id}`

**Permissions:** Manager only

**Body:**
```json
{
  "title": "Monthly lubrication",
  "schedule_interval_value": 1,
  "schedule_interval_unit": "months"
}
```

**Note:** Changing the schedule automatically recalculates `next_due_date`.

**Response:** `200 OK`

---

### Deactivate Preventive Task
**DELETE** `/preventive-tasks/{id}`

**Permissions:** Manager only

Sets `is_active` to `false`.

**Response:** `200 OK`

---

### Get Upcoming Preventive Tasks
**GET** `/preventive-tasks-upcoming`

**Query Parameters:**
- `days` (integer, optional) - Default: 7

Shows tasks due within the next X days.

**Response:** `200 OK`

---

### Get Overdue Preventive Tasks
**GET** `/preventive-tasks-overdue`

Shows tasks past their due date.

**Response:** `200 OK`

---

## Locations

### List Locations
**GET** `/locations`

**Response:** `200 OK`
```json
{
  "locations": [
    { "id": 1, "name": "Production Floor A" },
    { "id": 2, "name": "Warehouse B" }
  ]
}
```

---

### Create Location
**POST** `/locations`

**Permissions:** Manager only

**Body:**
```json
{
  "name": "Production Floor C"
}
```

**Response:** `201 Created`

---

### Update/Delete Location
**PUT/DELETE** `/locations/{id}`

**Permissions:** Manager only

---

## Cause Categories

### List Cause Categories
**GET** `/cause-categories`

**Response:** `200 OK`
```json
{
  "cause_categories": [
    { "id": 1, "name": "Mechanical", "description": "Mechanical failures" },
    { "id": 2, "name": "Electrical", "description": "Electrical issues" }
  ]
}
```

---

### Create Cause Category
**POST** `/cause-categories`

**Permissions:** Manager only

**Body:**
```json
{
  "name": "Mechanical",
  "description": "Mechanical failures and wear"
}
```

**Response:** `201 Created`

---

## Users

### List Users
**GET** `/users`

**Permissions:** Manager only

**Query Parameters:**
- `role` (string) - Filter by role

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "manager",
      "created_at": "2024-11-01T10:00:00Z"
    }
  ]
}
```

---

### Create User
**POST** `/users`

**Permissions:** Manager only

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "technician"
}
```

**Response:** `201 Created`

---

### Update User
**PUT** `/users/{id}`

**Permissions:** Own profile, or Manager for all users

**Body:**
```json
{
  "name": "Jane Smith Updated",
  "role": "manager"
}
```

**Note:** Only managers can change roles.

**Response:** `200 OK`

---

### Delete User
**DELETE** `/users/{id}`

**Permissions:** Manager only

**Response:** `200 OK`

---

## Dashboard & Analytics

### Get Dashboard Metrics
**GET** `/dashboard/metrics`

**Permissions:** Technician, Manager

**Query Parameters:**
- `date_from` (date, optional) - Default: 30 days ago
- `date_to` (date, optional) - Default: today
- `location_id` (integer, optional)

**Response:** `200 OK`
```json
{
  "open_work_orders_count": 12,
  "overdue_preventive_tasks_count": 3,
  "breakdowns_last_7_days": 8,
  "breakdowns_last_30_days": 25,
  "top_machines": [
    {
      "machine_id": 1,
      "machine_name": "CNC Mill 1",
      "machine_code": "CNC-001",
      "breakdown_count": 5
    }
  ]
}
```

---

### Get Downtime Report by Machine
**GET** `/reports/downtime-by-machine`

**Query Parameters:**
- `date_from` (date, optional) - Default: 30 days ago
- `date_to` (date, optional) - Default: today
- `location_id` (integer, optional)

**Response:** `200 OK`
```json
{
  "downtime_by_machine": [
    {
      "machine_id": 1,
      "machine_name": "CNC Mill 1",
      "breakdown_count": 5,
      "total_downtime_minutes": 240,
      "total_downtime_hours": 4.0
    }
  ]
}
```

---

### Get Completion Time Metrics
**GET** `/reports/completion-time-metrics`

**Query Parameters:**
- `date_from` (date, optional)
- `date_to` (date, optional)
- `type` (string, optional) - `breakdown`, `preventive`

**Response:** `200 OK`
```json
{
  "avg_completion_time_minutes": 48.5,
  "median_completion_time_minutes": 45,
  "longest_completion_time_minutes": 180
}
```

---

## Machine Import

### Upload CSV
**POST** `/machines/import/upload`

**Permissions:** Manager only

**Body:** `multipart/form-data`
- `file` - CSV file (max 2MB)

**Response:** `200 OK`
```json
{
  "file_id": "abc123.csv",
  "headers": ["Name", "Code", "Location", "Criticality"],
  "detected_columns": {
    "name": "Name",
    "code": "Code",
    "location": "Location",
    "criticality": "Criticality"
  },
  "preview": [
    { "Name": "CNC Mill 1", "Code": "CNC-001", "Location": "Floor A", "Criticality": "high" }
  ]
}
```

---

### Validate Import
**POST** `/machines/import/validate`

**Body:**
```json
{
  "file_id": "abc123.csv",
  "column_mapping": {
    "name": "Name",
    "code": "Code",
    "location": "Location",
    "criticality": "Criticality"
  }
}
```

**Response:** `200 OK`
```json
{
  "valid_count": 45,
  "invalid_count": 2,
  "valid_rows": [ /* preview */ ],
  "invalid_rows": [
    {
      "row": 10,
      "data": { "name": "", "code": "TEST-01" },
      "errors": ["The name field is required"]
    }
  ],
  "total_rows": 47
}
```

---

### Execute Import
**POST** `/machines/import/confirm`

**Body:**
```json
{
  "file_id": "abc123.csv",
  "column_mapping": {
    "name": "Name",
    "code": "Code",
    "location": "Location"
  },
  "location_handling": "create"
}
```

**`location_handling` options:**
- `create` - Auto-create locations from CSV
- `skip` - Skip location assignment

**Response:** `200 OK`
```json
{
  "message": "Import completed successfully",
  "created_count": 45,
  "skipped_count": 2,
  "locations_created": ["Floor A", "Floor B", "Warehouse"],
  "errors": ["Skipped: Machine with code 'DUP-01' already exists"]
}
```

---

## Error Responses

All endpoints may return the following error responses:

**401 Unauthorized**
```json
{
  "message": "Unauthenticated."
}
```

**403 Forbidden**
```json
{
  "message": "Forbidden. You do not have permission to access this resource."
}
```

**404 Not Found**
```json
{
  "message": "Resource not found."
}
```

**422 Unprocessable Entity** (Validation errors)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

**500 Internal Server Error**
```json
{
  "message": "An error occurred.",
  "error": "Detailed error message"
}
```

---

## Rate Limiting

API endpoints are rate limited to prevent abuse. Default limits apply per user.

---

## Scheduled Jobs

### Generate Preventive Work Orders

**Command:** `php artisan preventive:generate-work-orders`

**Schedule:** Daily at 6:00 AM

**Behavior:**
- Finds active preventive tasks due within 3 days
- Creates work orders if they don't already exist
- Prevents duplicate work order generation

---

## Testing the API

Use tools like:
- **Postman** - Import the endpoints
- **Insomnia** - REST client
- **cURL** - Command line

Example cURL request:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

---

**End of API Documentation**
