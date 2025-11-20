# CMMS MVP - Implementation Plan

This document breaks down the tasks from `claude.md` into actionable implementation items.

## Current Status
- [ ] Phase 1 - Foundations
- [ ] Phase 2 - Maintenance Flow  
- [ ] Phase 3 - Insights
- [ ] Phase 4 - Pilot-ready

---

## Phase 1: Foundations

### 1.1 Database Schema & Models
- [ ] Create Company model and migration
- [ ] Create User model with company relationship
- [ ] Create Role enum/table (operator, technician, manager)
- [ ] Create Location model with company relationship
- [ ] Set up foreign keys and indexes

### 1.2 Authentication & Authorization
- [ ] Implement user registration (with company creation)
- [ ] Implement user login
- [ ] Set up role-based middleware/guards
- [ ] Create authorization policies for roles
- [ ] Test authentication flow

### 1.3 User Management UI
- [ ] Create login page
- [ ] Create registration page
- [ ] Create user profile page
- [ ] Create user list page (manager only)
- [ ] Create add/edit user form (manager only)

---

## Phase 2: Maintenance Flow

### 2.1 Machine Management
- [ ] Create Machine model and migration
  - Fields: name, code, location_id, company_id, criticality
- [ ] Machine list page with filters (location)
- [ ] Add/edit machine form
- [ ] Machine detail page (basic info)
- [ ] API endpoints for CRUD operations

### 2.2 Work Order System - Core
- [ ] Create WorkOrder model and migration
  - Fields: company_id, machine_id, created_by, assigned_to, type, status, description, started_at, completed_at
- [ ] Create WorkOrderType enum (breakdown, corrective, preventive)
- [ ] Create Status enum (open, in_progress, completed, cancelled)
- [ ] Create MaintenanceLog model and migration
- [ ] Create CauseCategory model and migration

### 2.3 Breakdown Reporting (Operator View)
- [ ] "Report breakdown" form
  - Machine selection
  - Description field
  - Optional: cause category, photo upload, breakdown start time
- [ ] Create breakdown WorkOrder endpoint
- [ ] Operator work order list (own machines only)

### 2.4 Work Order Management (Technician View)
- [ ] Work order list page with filters
  - Status filter
  - Type filter (breakdown/preventive)
  - Machine filter
  - Date range filter
- [ ] Work order detail page
  - View all work order info
  - Update status (open → in_progress → completed)
  - Add completion details (actual times, cause, notes)
- [ ] Create/update MaintenanceLog when completing work order
- [ ] Work order assignment functionality

### 2.5 Preventive Maintenance
- [ ] Create PreventiveTask model and migration
  - Fields: company_id, machine_id, title, description, schedule_type, schedule_value, assigned_to, next_due_date
- [ ] Preventive task list page (manager)
- [ ] Add/edit preventive task form
- [ ] Schedule logic for generating WorkOrders
  - Background job/scheduler to create WorkOrders from PreventiveTasks
  - Generate work orders when due date is near (e.g., 3 days before)
- [ ] Link generated WorkOrders to PreventiveTask
- [ ] Show upcoming and overdue preventive tasks

---

## Phase 3: Insights

### 3.1 Dashboard - Manager View
- [ ] Dashboard layout/page structure
- [ ] Card: Open work orders count
- [ ] Card: Overdue preventive tasks count
- [ ] Card: Breakdowns in last 7 days
- [ ] Card: Breakdowns in last 30 days
- [ ] Top 5 machines by breakdown count (with date range filter)
- [ ] Date range filter component
- [ ] Location filter component

### 3.2 Machine Analytics
- [ ] Enhanced machine detail page
  - Latest work orders list
  - Breakdown vs preventive count (last 90 days)
  - Total downtime calculation
- [ ] Breakdowns by cause category report/chart
- [ ] Machine comparison view (optional)

### 3.3 Work Order Reporting
- [ ] Work order list with advanced filtering
- [ ] Export work orders to CSV/PDF (optional for MVP)
- [ ] Downtime per machine report
- [ ] Work order completion time metrics

---

## Phase 4: Pilot-Ready

### 4.1 Data Import
- [ ] CSV import page/modal
- [ ] CSV parser for machines
- [ ] Column mapping UI
- [ ] Import preview functionality
- [ ] Validation during import
- [ ] Bulk insert machines from CSV
- [ ] Error handling and reporting for failed imports

### 4.2 UX Polish & Validation
- [ ] Form validation on all input forms
- [ ] Error messages and user feedback
- [ ] Loading states and spinners
- [ ] Success/confirmation messages
- [ ] Mobile-responsive layout for key screens:
  - Breakdown reporting
  - Work order list
  - Work order detail
  - Dashboard
- [ ] Consistent styling across application
- [ ] Help text/tooltips for complex fields

### 4.3 Permissions & Security
- [ ] Verify role-based access on all endpoints
- [ ] Test operator can only see/create breakdowns
- [ ] Test technician can manage work orders
- [ ] Test manager has full access
- [ ] Company data isolation (users can only see their company's data)
- [ ] Prevent unauthorized access to other companies' data

### 4.4 Testing & Deployment Prep
- [ ] Write unit tests for key models and business logic
- [ ] Write integration tests for critical flows
- [ ] Manual QA testing checklist
- [ ] Seed database with sample data
- [ ] Environment configuration (.env setup)
- [ ] Deployment documentation
- [ ] User documentation/guide

---

## Additional Considerations

### Future Enhancements (Post-MVP)
- Photo attachments for work orders
- Priority levels for work orders
- Spare parts tracking
- Time tracking for technicians
- Email notifications
- Advanced analytics and OEE
- Mobile native apps
- ERP integrations

### Technical Stack Notes
Based on the Laravel project structure:
- Backend: Laravel (PHP)
- Frontend: Blade templates or Vue.js/React
- Database: MySQL/PostgreSQL
- Queue system: Laravel Queue for scheduled task generation

---

## Getting Started

To begin implementation:
1. Review this plan and confirm scope with stakeholders
2. Start with Phase 1, Task 1.1 (Database Schema)
3. Work through tasks sequentially within each phase
4. Test each feature before moving to the next
5. Regularly commit code and document changes

---

## Progress Tracking

Update the checkboxes above as tasks are completed. Move completed phases to a "Completed" section at the bottom of this document.
