# Preventive Maintenance - Automatic Work Order Generation

## Overview

The system automatically generates work orders for preventive maintenance tasks based on their scheduled due dates. This ensures that preventive maintenance doesn't get forgotten and technicians always have upcoming tasks in their work order queue.

## How It Works

### 1. Scheduled Command
- **Command:** `preventive:generate-work-orders`
- **Schedule:** Runs daily at 6:00 AM (configured in `routes/console.php`)
- **Look-ahead:** By default, generates work orders for tasks due within the next 3 days

### 2. Work Order Generation Logic

The command:
1. Finds all **active** preventive tasks where `next_due_date` is within the look-ahead window
2. Checks if each task already has an open or in-progress work order
3. Creates a new work order if none exists:
   - Type: `PREVENTIVE`
   - Status: `OPEN`
   - Title: Uses the preventive task's title
   - Description: Includes the task description + auto-generated note
   - Assigned to: Uses the preventive task's assigned technician

### 3. Completion Flow

When a preventive work order is completed (via `WorkOrderController@complete`):
1. Work order status → `COMPLETED`
2. Maintenance log is created with work details
3. The linked preventive task is updated:
   - `last_completed_at` → work order completion time
   - `next_due_date` → automatically calculated based on schedule interval

Example:
- Task scheduled every 30 days
- Completed on 2025-11-20
- Next due date automatically set to 2025-12-20

## Manual Testing

You can manually run the command to test it:

```bash
# Generate work orders for tasks due in the next 3 days (default)
php artisan preventive:generate-work-orders

# Generate work orders for tasks due in the next 7 days
php artisan preventive:generate-work-orders --days-ahead=7

# Generate work orders for tasks due today only
php artisan preventive:generate-work-orders --days-ahead=0
```

## Example Output

```
Checking for preventive tasks due on or before: 2025-11-23

Found 2 preventive task(s) due for work order generation.

✓ Created work order #15 for task #3 (Quarterly lubrication check) on machine Injection Molder A
⚠ Skipping task #5 (Belt tension inspection) - already has an open work order

Summary:
- Generated: 1 work order(s)
- Skipped: 1 task(s) (already have open work orders)
```

## Setting Up Cron (Production)

For the scheduled command to run automatically, you need to add Laravel's scheduler to your server's cron:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

This single cron entry will run every minute and Laravel will determine which scheduled commands should actually execute.

### Windows Task Scheduler (For Herd/Local Development)

If using Windows with Herd, you can set up a scheduled task:

1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 6:00 AM
4. Action: Start a program
5. Program: `C:\Program Files\Herd\resources\app.asar.unpacked\resources\php\php.exe`
6. Arguments: `artisan preventive:generate-work-orders`
7. Start in: `C:\Users\steyn\Herd\line-care`

## Database Schema

The system uses existing fields on the `preventive_tasks` table:

- `next_due_date` - When the next work order should be generated
- `last_completed_at` - When the task was last completed (updated automatically)
- `is_active` - Only active tasks generate work orders
- `schedule_interval_value` & `schedule_interval_unit` - Used to calculate next due dates

## Benefits

✅ **Never miss preventive maintenance** - Tasks automatically appear as work orders  
✅ **No manual work order creation** - System handles it based on schedule  
✅ **Smart duplicate prevention** - Won't create multiple work orders for the same task  
✅ **Automatic rescheduling** - Next due date calculated when work order is completed  
✅ **Flexible look-ahead** - Can adjust how far in advance work orders are created

## Future Enhancements

Potential improvements for future versions:
- Email/SMS notifications when work orders are auto-generated
- Different lead times per task (some need 7 days notice, others need 1 day)
- Batch scheduling optimization (group tasks by area/technician)
- Holiday/weekend handling (skip or reschedule)
- Escalation for overdue tasks without completed work orders
