# CMMS MVP - Environment Configuration Guide

## Overview

This guide explains all environment variables and configuration options for the CMMS system. Use this as a reference when deploying to different environments (development, staging, production).

---

## Table of Contents

1. [Environment File Basics](#environment-file-basics)
2. [Core Application Settings](#core-application-settings)
3. [Database Configuration](#database-configuration)
4. [Session & Cache](#session--cache)
5. [Mail Configuration](#mail-configuration)
6. [Security Settings](#security-settings)
7. [Logging Configuration](#logging-configuration)
8. [Queue Configuration](#queue-configuration)
9. [Filesystem & Storage](#filesystem--storage)
10. [Production Optimization](#production-optimization)
11. [Environment-Specific Examples](#environment-specific-examples)

---

## Environment File Basics

### Location

The environment configuration file is located at:
```
.env
```

**IMPORTANT**: Never commit `.env` to version control! It contains sensitive credentials.

### Creating from Template

```bash
# Copy the example file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Checking Current Environment

```bash
# View current environment
php artisan env

# Check specific config value
php artisan tinker
>>> config('app.env')
>>> config('database.default')
```

---

## Core Application Settings

### APP_NAME

**Purpose**: Application name displayed in UI and emails

**Values**:
```env
APP_NAME="LineCare"
APP_NAME="LineCare - Factory Maintenance"
APP_NAME="Acme Manufacturing - LineCare"
```

**Impact**: 
- Shown in page titles
- Used in email subjects
- Displayed in sidebar header

---

### APP_ENV

**Purpose**: Defines the current environment

**Values**:
```env
APP_ENV=local       # Development on your machine
APP_ENV=development # Development server
APP_ENV=staging     # Staging/testing server
APP_ENV=production  # Live production server
```

**Impact**:
- Controls debug output
- Affects error reporting
- Changes caching behavior
- Influences logging verbosity

---

### APP_KEY

**Purpose**: Encryption key for securing session data and encrypted values

**Format**:
```env
APP_KEY=base64:RANDOM_32_BYTE_STRING_HERE
```

**Generation**:
```bash
php artisan key:generate
```

**CRITICAL**: 
- ⚠️ Never share this key
- ⚠️ Never commit to version control
- ⚠️ Changing this invalidates all sessions and encrypted data
- ⚠️ Generate a new one for each environment

---

### APP_DEBUG

**Purpose**: Controls debug mode and error visibility

**Values**:
```env
APP_DEBUG=true   # Development: Show detailed errors
APP_DEBUG=false  # Production: Hide error details
```

**Impact**:
- When `true`: Shows full error traces, SQL queries, and debug info
- When `false`: Shows generic error pages only

**⚠️ SECURITY WARNING**: 
ALWAYS set to `false` in production! Debug mode exposes:
- Database credentials
- Environment variables
- Full file paths
- Source code snippets

---

### APP_TIMEZONE

**Purpose**: Default timezone for timestamp operations

**Values**:
```env
APP_TIMEZONE=UTC                    # Coordinated Universal Time (recommended)
APP_TIMEZONE=America/New_York       # Eastern Time
APP_TIMEZONE=Europe/London          # UK Time
APP_TIMEZONE=Asia/Tokyo             # Japan Time
APP_TIMEZONE=Africa/Johannesburg    # South Africa
```

**Impact**:
- Affects `now()` timestamps
- Work order start/end times
- Preventive task due dates
- Log timestamps

**Best Practice**: Use UTC in database, display in user's local timezone in UI

---

### APP_URL

**Purpose**: Base URL of your application

**Values**:
```env
APP_URL=http://localhost:8000        # Local development
APP_URL=http://cmms.local            # Local with Herd/Valet
APP_URL=https://staging.cmms.com     # Staging server
APP_URL=https://cmms.yourcompany.com # Production
```

**Impact**:
- Used in email links
- Asset URL generation
- CORS configuration
- Redirect URLs

---

### APP_LOCALE

**Purpose**: Default application language

**Values**:
```env
APP_LOCALE=en  # English (default)
```

**Note**: Multi-language support can be added later

---

## Database Configuration

### DB_CONNECTION

**Purpose**: Which database driver to use

**Values**:
```env
DB_CONNECTION=sqlite  # SQLite (default for this MVP)
DB_CONNECTION=mysql   # MySQL
DB_CONNECTION=pgsql   # PostgreSQL
```

**Recommendation**: 
- Development: SQLite (simple, no server needed)
- Production: MySQL or PostgreSQL (better for multi-user concurrent access)

---

### SQLite Configuration

**For SQLite** (default):
```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```

**Example**:
```env
# Linux/Mac
DB_DATABASE=/var/www/html/cmms/database/database.sqlite

# Windows
DB_DATABASE=C:\xampp\htdocs\cmms\database\database.sqlite
```

**Creating the database**:
```bash
touch database/database.sqlite
php artisan migrate
```

**Pros**:
- Zero configuration
- Perfect for single-server deployments
- No database server to manage

**Cons**:
- Limited concurrent write access
- Not ideal for high-traffic sites
- Harder to replicate/backup

---

### MySQL Configuration

**For MySQL**:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cmms
DB_USERNAME=cmms_user
DB_PASSWORD=your_secure_password
```

**Creating the database**:
```sql
CREATE DATABASE cmms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cmms_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON cmms.* TO 'cmms_user'@'localhost';
FLUSH PRIVILEGES;
```

**Then migrate**:
```bash
php artisan migrate
```

**Production Settings**:
```env
# Use unix socket for better performance if available
DB_SOCKET=/var/run/mysqld/mysqld.sock

# Or TCP connection
DB_HOST=db.internal.network
DB_PORT=3306
```

---

### PostgreSQL Configuration

**For PostgreSQL**:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=cmms
DB_USERNAME=cmms_user
DB_PASSWORD=your_secure_password
```

**Creating the database**:
```sql
CREATE DATABASE cmms;
CREATE USER cmms_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE cmms TO cmms_user;
```

---

## Session & Cache

### SESSION_DRIVER

**Purpose**: Where to store user session data

**Values**:
```env
SESSION_DRIVER=database  # Database (recommended for production)
SESSION_DRIVER=file      # File system (default, simple)
SESSION_DRIVER=redis     # Redis (best for scalability)
SESSION_DRIVER=memcached # Memcached
```

**Recommendation**:
- Development: `file` (simple)
- Production: `database` or `redis` (persistent, scalable)

**If using database sessions**:
```bash
# Create sessions table
php artisan session:table
php artisan migrate
```

---

### SESSION_LIFETIME

**Purpose**: How long sessions last (in minutes)

**Values**:
```env
SESSION_LIFETIME=120    # 2 hours (default)
SESSION_LIFETIME=480    # 8 hours (work day)
SESSION_LIFETIME=1440   # 24 hours
```

**Impact**: Users stay logged in for this duration of inactivity

---

### CACHE_STORE

**Purpose**: Where to store cached data

**Values**:
```env
CACHE_STORE=database  # Database (persistent)
CACHE_STORE=file      # File system (simple)
CACHE_STORE=redis     # Redis (fast, recommended for production)
CACHE_STORE=array     # Memory only (testing)
```

**Setup for database cache**:
```bash
php artisan cache:table
php artisan migrate
```

---

## Mail Configuration

### Mail Driver

**Purpose**: How to send emails (password resets, notifications)

**Values**:
```env
MAIL_MAILER=smtp      # SMTP server (most common)
MAIL_MAILER=log       # Log only (testing)
MAIL_MAILER=array     # Memory only (testing)
```

---

### SMTP Configuration

**For Gmail** (development):
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

**Note**: Gmail requires an "App Password", not your regular password. Enable 2FA and generate one at: https://myaccount.google.com/apppasswords

---

**For SendGrid** (production):
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=YOUR_SENDGRID_API_KEY
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourcompany.com
MAIL_FROM_NAME="${APP_NAME}"
```

---

**For Mailgun**:
```env
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=mg.yourcompany.com
MAILGUN_SECRET=your-mailgun-api-key
MAIL_FROM_ADDRESS=noreply@yourcompany.com
MAIL_FROM_NAME="${APP_NAME}"
```

---

**For AWS SES**:
```env
MAIL_MAILER=ses
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
MAIL_FROM_ADDRESS=noreply@yourcompany.com
MAIL_FROM_NAME="${APP_NAME}"
```

---

**For Testing** (don't send real emails):
```env
MAIL_MAILER=log  # Writes emails to storage/logs/laravel.log
```

---

## Security Settings

### BCRYPT_ROUNDS

**Purpose**: Password hashing strength

**Values**:
```env
BCRYPT_ROUNDS=12  # Default, good balance
BCRYPT_ROUNDS=10  # Faster, less secure
BCRYPT_ROUNDS=14  # Slower, more secure
```

**Impact**: Higher = more secure but slower login/registration

---

### CSRF Protection

**Purpose**: Enabled by default, protects against CSRF attacks

**Configuration**: Laravel Fortify handles this automatically

**Excluded URLs** (if needed):
Edit `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'stripe/*',  // Example: payment webhooks
    ]);
})
```

---

## Logging Configuration

### LOG_CHANNEL

**Purpose**: Where to write application logs

**Values**:
```env
LOG_CHANNEL=stack      # Multiple channels (default)
LOG_CHANNEL=single     # Single file
LOG_CHANNEL=daily      # Daily rotating files
LOG_CHANNEL=syslog     # System log
LOG_CHANNEL=errorlog   # PHP error log
```

**Recommendation**: 
- Development: `single` (simple)
- Production: `daily` (automatic rotation)

---

### LOG_LEVEL

**Purpose**: Minimum log level to record

**Values** (from most to least verbose):
```env
LOG_LEVEL=debug      # Everything (development)
LOG_LEVEL=info       # Informational messages
LOG_LEVEL=notice     # Normal but significant
LOG_LEVEL=warning    # Warnings
LOG_LEVEL=error      # Errors only (production)
LOG_LEVEL=critical   # Critical errors only
```

**Recommendation**:
- Development: `debug`
- Production: `error` or `warning`

---

### Log File Location

Logs are stored in:
```
storage/logs/laravel.log          # Single channel
storage/logs/laravel-YYYY-MM-DD.log  # Daily channel
```

**Viewing logs**:
```bash
# Tail the log file
tail -f storage/logs/laravel.log

# View last 100 lines
tail -n 100 storage/logs/laravel.log

# Search for errors
grep ERROR storage/logs/laravel.log
```

---

## Queue Configuration

### QUEUE_CONNECTION

**Purpose**: How to process background jobs (currently not used, but available)

**Values**:
```env
QUEUE_CONNECTION=sync      # Process immediately (default, simple)
QUEUE_CONNECTION=database  # Queue in database
QUEUE_CONNECTION=redis     # Queue in Redis (best for production)
```

**Note**: The current MVP doesn't use queues, but they're available for future features like:
- Email sending
- Report generation
- Batch imports

---

## Filesystem & Storage

### FILESYSTEM_DISK

**Purpose**: Default storage disk for file uploads

**Values**:
```env
FILESYSTEM_DISK=local   # Local storage (default)
FILESYSTEM_DISK=public  # Public storage
FILESYSTEM_DISK=s3      # AWS S3
```

**Storage Locations**:
- `local`: `storage/app/`
- `public`: `storage/app/public/` (accessible via `/storage/` URL)

**Creating public link**:
```bash
php artisan storage:link
```

**Note**: File upload features (work order attachments, machine photos) will use this in future versions.

---

## Production Optimization

### Recommended Production .env

```env
# === Core Settings ===
APP_NAME="LineCare"
APP_ENV=production
APP_KEY=base64:GENERATE_NEW_KEY_HERE
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=https://linecare.yourcompany.com
APP_LOCALE=en

# === Database ===
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cmms_prod
DB_USERNAME=cmms_user
DB_PASSWORD=SECURE_PASSWORD_HERE

# === Session & Cache ===
SESSION_DRIVER=database
SESSION_LIFETIME=480
CACHE_STORE=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# === Mail (SendGrid example) ===
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=YOUR_SENDGRID_KEY
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourcompany.com
MAIL_FROM_NAME="${APP_NAME}"

# === Security ===
BCRYPT_ROUNDS=12

# === Logging ===
LOG_CHANNEL=daily
LOG_LEVEL=error

# === Queue ===
QUEUE_CONNECTION=redis

# === Filesystem ===
FILESYSTEM_DISK=local
```

---

## Environment-Specific Examples

### Local Development (Laravel Herd / Valet)

```env
APP_NAME=LineCare
APP_ENV=local
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://linecare.test
APP_LOCALE=en

DB_CONNECTION=sqlite
DB_DATABASE=/Users/you/Sites/cmms/database/database.sqlite

SESSION_DRIVER=file
SESSION_LIFETIME=120

CACHE_STORE=file

MAIL_MAILER=log

LOG_CHANNEL=single
LOG_LEVEL=debug

QUEUE_CONNECTION=sync

FILESYSTEM_DISK=local
```

---

### Staging Server

```env
APP_NAME="LineCare Staging"
APP_ENV=staging
APP_KEY=base64:STAGING_KEY_HERE
APP_DEBUG=true  # Can keep debug on for staging
APP_TIMEZONE=UTC
APP_URL=https://staging.linecare.com
APP_LOCALE=en

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cmms_staging
DB_USERNAME=cmms_staging
DB_PASSWORD=STAGING_DB_PASSWORD

SESSION_DRIVER=database
SESSION_LIFETIME=480

CACHE_STORE=database

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io  # Mailtrap for testing
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=staging@cmms.com
MAIL_FROM_NAME="${APP_NAME}"

LOG_CHANNEL=daily
LOG_LEVEL=debug

QUEUE_CONNECTION=sync

FILESYSTEM_DISK=local
```

---

### Production Server

```env
APP_NAME="LineCare"
APP_ENV=production
APP_KEY=base64:PRODUCTION_KEY_HERE
APP_DEBUG=false  # CRITICAL: Always false in production
APP_TIMEZONE=America/New_York
APP_URL=https://linecare.factory.com
APP_LOCALE=en

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cmms_production
DB_USERNAME=cmms_prod
DB_PASSWORD=VERY_SECURE_PASSWORD

SESSION_DRIVER=redis
SESSION_LIFETIME=480

CACHE_STORE=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=REDIS_PASSWORD_HERE
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.XXXXXXXXXXXXX
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@factory.com
MAIL_FROM_NAME="${APP_NAME}"

BCRYPT_ROUNDS=12

LOG_CHANNEL=daily
LOG_LEVEL=warning

QUEUE_CONNECTION=redis

FILESYSTEM_DISK=local
```

---

## Verification Commands

### Check Configuration

```bash
# View all config
php artisan config:show

# View specific config section
php artisan config:show database
php artisan config:show mail

# Check environment
php artisan env
```

### Test Database Connection

```bash
# Try a simple query
php artisan tinker
>>> DB::connection()->getPdo();
>>> DB::table('users')->count();
```

### Test Mail Configuration

```bash
# Send test email
php artisan tinker
>>> Mail::raw('Test email', function($msg) {
    $msg->to('test@example.com')->subject('Test');
});
```

### Test Cache

```bash
# Test cache operations
php artisan tinker
>>> Cache::put('test', 'value', 60);
>>> Cache::get('test');
>>> Cache::forget('test');
```

---

## Security Checklist

Before deploying to production, verify:

- [ ] `APP_ENV=production`
- [ ] `APP_DEBUG=false`
- [ ] `APP_KEY` is unique and secure (never shared)
- [ ] Database password is strong and unique
- [ ] `.env` file is NOT in version control
- [ ] `.env` file has restricted permissions (chmod 600)
- [ ] `APP_URL` uses HTTPS
- [ ] Mail credentials are secured
- [ ] Redis password is set (if using Redis)
- [ ] `LOG_LEVEL` is not `debug`
- [ ] CSRF protection is enabled (default)
- [ ] SSL/TLS certificates are valid

---

## Troubleshooting

### Config Cache Issues

If changes to `.env` aren't taking effect:

```bash
# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Or clear everything at once
php artisan optimize:clear
```

In production, after changes:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Permission Issues

```bash
# Fix storage and cache permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Database Connection Errors

Check:
1. Database server is running
2. Credentials are correct
3. Database exists
4. User has proper permissions
5. Firewall allows connection

```bash
# Test MySQL connection manually
mysql -u cmms_user -p -h 127.0.0.1 cmms_production
```

---

## Additional Resources

- [Laravel Configuration Documentation](https://laravel.com/docs/11.x/configuration)
- [Laravel Environment Configuration](https://laravel.com/docs/11.x/configuration#environment-configuration)
- [Laravel Deployment](https://laravel.com/docs/11.x/deployment)

---

**Version**: 1.0  
**Last Updated**: 2025-01-20  
**System**: CMMS MVP
