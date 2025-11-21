# LineCare - User Guide

## Quick Start Guide

Welcome to **LineCare**! This simple CMMS (Computerized Maintenance Management System) helps you manage maintenance operations in your factory. This guide will help you get started based on your role.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [For Operators](#for-operators)
3. [For Technicians](#for-technicians)
4. [For Managers](#for-managers)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Logging In

1. Open your web browser and navigate to your company's CMMS URL
2. Enter your email and password
3. Click "Sign In"

**Demo Credentials** (if using demo data):
- Manager: `manager@demo.com` / `password`
- Technician: `tech@demo.com` / `password`
- Operator: `operator@demo.com` / `password`

### Navigation

The sidebar on the left contains all main sections:
- **Dashboard** - Overview of system status
- **Work Orders** - View and manage maintenance work
- **Machines** - View machine inventory
- **Preventive Tasks** - Scheduled maintenance (Manager/Technician only)
- **Locations** - Factory locations
- **Cause Categories** - Breakdown cause tracking (Manager only)
- **Users** - User management (Manager only)
- **Reports** - Analytics and downtime reports

---

## For Operators

As an operator, your main task is to report breakdowns when they occur.

### Reporting a Breakdown

1. Click **"Work Orders"** in the sidebar
2. Click the **"Create Work Order"** button (top right)
3. Fill in the form:
   - **Machine**: Select the machine that broke down
   - **Type**: Select "Breakdown"
   - **Priority**: Choose based on urgency (Low/Medium/High/Critical)
   - **Title**: Brief description (e.g., "Motor won't start")
   - **Description**: Detailed explanation of the problem
   - **Cause Category** (optional): Select if you know the cause
   - **Started At** (optional): When the breakdown occurred
4. Click **"Create Work Order"**

### Viewing Your Work Orders

1. Go to **Work Orders**
2. Use filters to find specific orders:
   - Filter by **Status**: Open, In Progress, Completed
   - Filter by **Type**: Breakdown, Corrective, Preventive
   - Filter by **Machine**: Select specific machine
   - Filter by **Priority**: Low to Critical
3. Click on any work order to view details

### What You Can Do

- ✅ Create breakdown work orders
- ✅ View work orders for machines you operate
- ✅ Add comments to work orders
- ❌ Cannot change work order status
- ❌ Cannot complete work orders
- ❌ Cannot create or manage preventive tasks

---

## For Technicians

As a technician, you handle and complete work orders.

### Viewing Your Work Queue

1. Click **"Work Orders"** in the sidebar
2. Your work queue shows all work orders
3. Use filters to prioritize:
   - **Status: Open** - New work orders waiting to be started
   - **Status: In Progress** - Work orders you're currently working on
   - **Priority: Critical/High** - Urgent items
   - **Type: Breakdown** - Reactive maintenance
   - **Type: Preventive** - Scheduled maintenance

### Working on a Work Order

1. Find the work order in your queue
2. Click on it to open details
3. Click **"Start Work"** button
   - This changes status to "In Progress"
4. Work on the machine and document your actions

### Completing a Work Order

1. Open the work order
2. Click **"Complete"** button
3. Fill in the completion form:
   - **Completed At**: When work was finished
   - **Work Done**: What repairs/actions you performed
   - **Parts Used** (optional): List of parts/materials used
   - **Notes** (optional): Additional observations
   - **Cause Category**: Root cause of the issue
4. Click **"Complete Work Order"**

The system will automatically record:
- Total downtime (time between start and completion)
- A maintenance log entry
- Update machine history

### Managing Preventive Tasks

1. Go to **"Preventive Tasks"**
2. View upcoming and overdue tasks
3. When a preventive task generates a work order:
   - It appears in your work order queue
   - Complete it like any other work order
   - The system tracks PM compliance automatically

### What You Can Do

- ✅ View all work orders
- ✅ Start work orders (change to "In Progress")
- ✅ Complete work orders
- ✅ Add maintenance logs
- ✅ View preventive tasks
- ✅ View machines and their history
- ❌ Cannot create/edit preventive tasks
- ❌ Cannot manage users
- ❌ Limited management features

---

## For Managers

As a manager, you have full access to configure and monitor the system.

### Dashboard Overview

The dashboard shows key metrics:
- **Open Work Orders**: Current workload
- **In Progress**: Active maintenance work
- **Overdue Preventive Tasks**: PM tasks past due date
- **Recent Breakdowns**: Breakdowns in last 7/30 days
- **Top Problem Machines**: Machines with most downtime

**Using Date Range Filters**:
1. Set "Date From" and "Date To" at the top of dashboard
2. Click **"Apply"** to filter metrics
3. Click **"Clear"** to reset to default (last 30 days)

### Managing Machines

#### Adding a New Machine

1. Go to **"Machines"**
2. Click **"Create Machine"** (top right)
3. Fill in machine details:
   - **Name**: Machine name (e.g., "CNC Mill 01")
   - **Code**: Unique identifier (e.g., "CNC-001")
   - **Location**: Where it's located
   - **Manufacturer** (optional)
   - **Model** (optional)
   - **Serial Number** (optional)
   - **Installation Date** (optional)
   - **Criticality**: Low/Medium/High/Critical
4. Click **"Create Machine"**

#### Importing Multiple Machines (CSV)

1. Go to **"Machines"**
2. Click **"Import Machines"** button
3. Download the **CSV template** (link on import page)
4. Fill in your machine data in Excel/CSV:
   ```csv
   name,code,location,manufacturer,model,serial_number,installation_date,criticality
   CNC Mill 01,CNC-001,Production Floor A,Haas,VF-2,SN12345,2020-01-15,high
   Press 01,PRESS-001,Production Floor A,Schuler,SPR250,SN67890,2019-06-20,critical
   ```
5. Upload the completed CSV file
6. Review the preview
7. Click **"Import"** to create all machines

### Setting Up Preventive Maintenance

#### Creating a Preventive Task

1. Go to **"Preventive Tasks"**
2. Click **"Create Preventive Task"**
3. Fill in the form:
   - **Machine**: Select which machine
   - **Title**: Task name (e.g., "Quarterly Lubrication")
   - **Description**: Detailed instructions for technician
   - **Frequency Type**: Time-based (or counter-based in future)
   - **Frequency Value**: Number (e.g., 90 for 90 days)
   - **Frequency Unit**: Days, Weeks, or Months
   - **Last Completed At**: When last performed (optional)
   - **Next Due Date**: When next due
   - **Assignee** (optional): Default technician
   - **Estimated Duration** (optional): Expected time in minutes
4. Click **"Create Preventive Task"**

#### How Preventive Tasks Work

- The system runs a **scheduled check every day at 6:00 AM**
- It looks for tasks due within the next 3 days
- Automatically creates a work order for each due task
- Work orders appear in technician queues
- When completed, the system:
  - Marks the task as completed
  - Calculates and sets the next due date
  - Creates a maintenance log

**Manual Work Order Generation**:
If you need to generate PM work orders immediately:
```bash
php artisan preventive:generate-work-orders
```

### Managing Users

1. Go to **"Users"**
2. Click **"Create User"**
3. Fill in:
   - **Name**: Full name
   - **Email**: Login email
   - **Password**: Initial password (user should change later)
   - **Role**: Operator, Technician, or Manager
4. Click **"Create User"**

**User Roles Explained**:
- **Operator**: Can report breakdowns only
- **Technician**: Can manage all work orders
- **Manager**: Full system access

### Managing Locations

1. Go to **"Locations"**
2. Click **"Create Location"**
3. Enter:
   - **Name**: Location name (e.g., "Production Floor A")
   - **Description** (optional)
4. Click **"Create Location"**

Locations help you:
- Organize machines by area
- Filter work orders by location
- Track downtime by production area

### Managing Cause Categories

1. Go to **"Cause Categories"**
2. Click **"Create Cause Category"**
3. Enter:
   - **Name**: Category name (e.g., "Electrical Failure")
   - **Description** (optional)
4. Click **"Create Cause Category"**

**Recommended Categories**:
- Electrical Failure
- Mechanical Wear
- Operator Error
- Material Defect
- Preventive Maintenance
- External Factor

### Viewing Reports

#### Downtime Report

1. Go to **"Reports"** → **"Downtime Report"**
2. Use filters:
   - **Date Range**: Set custom date range
   - **Location**: Filter by specific location
   - **Machine**: Filter by specific machine
3. Click **"Apply Filters"**

The report shows:
- **Total Breakdowns**: Count of breakdown work orders
- **Total Downtime**: Sum of all downtime (in hours/days)
- **Average Downtime per Breakdown**: Mean downtime
- **Machine List**: Ranked by total downtime
  - Machine name and location
  - Number of breakdowns
  - Total downtime in hours
  - Percentage of total downtime

**Using This Data**:
- Identify problem machines for replacement/upgrade
- Justify maintenance budget increases
- Plan preventive maintenance priorities
- Track improvement over time

### What You Can Do

- ✅ Full access to all features
- ✅ Create and manage all entities
- ✅ View all reports and analytics
- ✅ Manage users and permissions
- ✅ Configure preventive maintenance
- ✅ Import bulk data via CSV
- ✅ Access dashboard with date filtering

---

## Common Tasks

### Filtering Work Orders

Use the filter panel at the top of the Work Orders page:

1. **Status Filter**: Open, In Progress, Completed, Cancelled
2. **Type Filter**: Breakdown, Corrective, Preventive
3. **Priority Filter**: Low, Medium, High, Critical
4. **Machine Filter**: Select specific machine
5. **Date Range**: Filter by creation date
6. **Clear All Filters**: Reset all filters at once

### Viewing Machine History

1. Go to **"Machines"**
2. Click on a machine name
3. View:
   - Machine details
   - Recent work orders
   - Breakdown count (last 90 days)
   - Preventive maintenance count (last 90 days)
   - Associated preventive tasks

### Cancelling a Work Order

1. Open the work order
2. Click **"Cancel"** button
3. Confirm the action
4. Status changes to "Cancelled"

**Note**: Only managers can cancel work orders after they're in progress.

### Editing a Machine

1. Go to **"Machines"**
2. Click on machine name
3. Click **"Edit"** button
4. Update fields
5. Click **"Update Machine"**

### Deactivating a Preventive Task

1. Go to **"Preventive Tasks"**
2. Click on the task
3. Click **"Edit"**
4. Toggle **"Is Active"** to OFF
5. Click **"Update"**

The task will no longer generate work orders.

---

## Troubleshooting

### I can't log in

- Check your email and password are correct
- Passwords are case-sensitive
- Contact your manager to reset your password
- Clear your browser cache and try again

### I don't see the sidebar menu

- Your screen might be too narrow
- Click the hamburger menu icon (☰) in the top-left
- Use a larger screen or rotate your mobile device

### I can't create a work order

- Check you have the right permissions (Operator role minimum)
- Ensure all required fields are filled (Machine and Title)
- Check your internet connection
- Refresh the page and try again

### Preventive work orders aren't being created

**For Managers**:
1. Check the task is marked as "Active"
2. Verify the "Next Due Date" is in the past or within 3 days
3. Check the server cron job is running:
   ```bash
   php artisan schedule:list
   ```
4. Manually trigger generation:
   ```bash
   php artisan preventive:generate-work-orders
   ```

### CSV import is failing

- Check your CSV file matches the template format exactly
- Ensure no special characters in machine codes
- Verify location names exist in the system first
- Check for duplicate machine codes
- Ensure date format is YYYY-MM-DD
- Save the file as CSV UTF-8 format

### I can't complete a work order

- Make sure you've filled all required fields:
  - Completed At date/time
  - Work Done description
  - Cause Category
- Check you have technician or manager role
- Ensure work order is in "In Progress" status first
- Try refreshing the page

### Reports show no data

- Check your date range isn't too restrictive
- Ensure work orders have been completed (not just created)
- Verify machines are properly assigned to work orders
- Check location filter isn't excluding all data
- Try clicking "Clear Filters" and reapply

### Mobile display issues

- The system is mobile-friendly but works best on tablets or larger
- Try rotating your device to landscape mode
- Use the desktop version for complex tasks like CSV imports
- Reporting breakdowns works well on mobile

---

## Best Practices

### For All Users

1. **Keep descriptions clear and detailed**
   - Future technicians will thank you
   - Helps identify patterns

2. **Select cause categories accurately**
   - Enables better reporting
   - Helps prevent future breakdowns

3. **Log out when done**
   - Especially on shared computers

### For Operators

1. **Report breakdowns immediately**
   - Accurate downtime tracking
   - Faster response from technicians

2. **Include as much detail as possible**
   - What happened just before the breakdown?
   - Any unusual sounds, smells, or behavior?

### For Technicians

1. **Start work orders when you begin**
   - Accurate time tracking
   - Managers can see workload

2. **Complete work orders promptly**
   - Document while fresh in your mind
   - Keeps records accurate

3. **Be thorough in "Work Done" field**
   - Helps future troubleshooting
   - Creates knowledge base

4. **Always select a cause category**
   - Critical for identifying trends
   - Helps managers prioritize improvements

### For Managers

1. **Review the dashboard weekly**
   - Identify problem machines early
   - Track improvement trends

2. **Set up preventive tasks for critical machines**
   - Reduces unexpected breakdowns
   - Extends machine life

3. **Use date range filters for analysis**
   - Compare month-over-month
   - Measure impact of improvements

4. **Keep cause categories simple**
   - Too many = inconsistent use
   - 5-10 categories is ideal

5. **Review downtime reports monthly**
   - Present to leadership
   - Justify maintenance investments

---

## Getting Help

### Within the System

- Hover over field labels for hints
- Required fields are marked with an asterisk (*)
- Error messages explain what needs to be fixed

### Support

- Contact your system administrator
- Check with your manager for training
- Refer to this guide for common tasks

---

## Appendix: Keyboard Shortcuts

**Coming in future versions**

---

## Appendix: System Limits

- **Work Order Title**: Max 255 characters
- **Description**: Max 65,000 characters (plenty of space)
- **CSV Import**: Max 1000 machines per file
- **Attachments**: Not yet implemented (coming soon)

---

**Version**: 1.0  
**Last Updated**: 2025-01-20  
**System**: CMMS MVP
