# CMMS Setup Instructions

## Database Setup

The application is now fully configured, but you need to run the database migrations to create all the required tables.

### Steps to Complete Setup:

1. **Run migrations** to create all database tables:
   ```bash
   php artisan migrate
   ```
   
   This will create:
   - companies table
   - users table with company_id and role fields
   - locations table
   - machines table
   - work_orders table
   - maintenance_logs table
   - cause_categories table
   - preventive_tasks table

2. **Create your first user** (optional - you can also register through the UI):
   ```bash
   php artisan tinker
   ```
   
   Then in tinker:
   ```php
   $company = App\Models\Company::create(['name' => 'Your Company Name']);
   
   $user = App\Models\User::create([
       'name' => 'Your Name',
       'email' => 'your@email.com',
       'password' => Hash::make('your-password'),
       'company_id' => $company->id,
       'role' => App\Enums\Role::MANAGER,
   ]);
   ```

3. **Access the application**:
   - Navigate to your local development URL (e.g., http://line-care.test)
   - Login with your credentials
   - You should now see the dashboard with all navigation items

## Navigation Structure

After setup, you'll have access to:

- **Dashboard** - View metrics and quick actions
- **Machines** - Browse and manage machines
- **Work Orders** - View and manage work orders
- **Report Breakdown** - Quick form to report machine breakdowns

## Default Roles

The system has three roles:
- **Operator** - Can report breakdowns and view own work orders
- **Technician** - Can view and complete all work orders
- **Manager** - Full access to all features

## Scheduled Tasks

The system includes a scheduled job that runs daily at 6:00 AM to generate preventive maintenance work orders. To enable this, add to your scheduler:

```bash
# In your cron (production)
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

Or run manually for testing:
```bash
php artisan preventive:generate-work-orders
```

## Troubleshooting

### "Cannot read properties of undefined (reading 'role')" Error

This error occurs when:
1. Migrations haven't been run (missing `role` column in users table)
2. Existing users don't have a role set

**Solution**: Run migrations and update existing users to have a role.

### "NOT NULL constraint failed: machines.company_id" Error

This error occurs when the logged-in user doesn't have a company assigned.

**Solution**: Assign the user to a company using tinker:

```bash
php artisan tinker
```

Then run:
```php
// Create a company if you don't have one
$company = App\Models\Company::create(['name' => 'My Company']);

// Update your existing user
$user = App\Models\User::find(1); // Replace 1 with your user ID
$user->company_id = $company->id;
$user->role = App\Enums\Role::MANAGER; // or TECHNICIAN, OPERATOR
$user->save();
```

### API Endpoints Not Working

Make sure you're authenticated. All API endpoints require a valid Sanctum token. Web routes handle authentication automatically through Laravel session middleware.
