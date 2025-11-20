# CMMS MVP - Deployment Guide

## Table of Contents
1. [Server Requirements](#server-requirements)
2. [Installation Steps](#installation-steps)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Scheduler Configuration](#scheduler-configuration)
6. [Production Optimizations](#production-optimizations)
7. [Security Checklist](#security-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Server Requirements

### Minimum Requirements
- **PHP**: 8.2 or higher
- **Database**: MySQL 8.0+ or PostgreSQL 13+ or SQLite 3.35+
- **Node.js**: 18.x or higher (for asset compilation)
- **Composer**: 2.x
- **Web Server**: Apache 2.4+ or Nginx 1.18+

### PHP Extensions Required
- BCMath
- Ctype
- cURL
- DOM
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PCRE
- PDO
- Tokenizer
- XML

### Recommended Server Specs
- **CPU**: 2 cores minimum
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 20GB minimum
- **Network**: Stable internet connection for updates

---

## Installation Steps

### 1. Clone Repository

```bash
cd /var/www
git clone https://github.com/your-org/line-care.git
cd line-care
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Install Node dependencies
npm ci

# Build frontend assets
npm run build
```

### 3. Set Permissions

```bash
# Set proper ownership (adjust user/group for your server)
chown -R www-data:www-data /var/www/line-care

# Set directory permissions
chmod -R 755 /var/www/line-care
chmod -R 775 /var/www/line-care/storage
chmod -R 775 /var/www/line-care/bootstrap/cache
```

### 4. Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Edit .env file with your settings
nano .env
```

---

## Environment Configuration

### Essential .env Settings

```env
# Application
APP_NAME="CMMS"
APP_ENV=production
APP_KEY=base64:GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cmms_production
DB_USERNAME=cmms_user
DB_PASSWORD=secure_password_here

# Session & Cache
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

# Security
BCRYPT_ROUNDS=12

# Mail (for notifications - optional)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@your-domain.com"
MAIL_FROM_NAME="${APP_NAME}"

# Queue (for background jobs)
QUEUE_CONNECTION=database

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error
```

### Security Best Practices

**⚠️ IMPORTANT - Production Security:**

```env
APP_DEBUG=false                    # Never true in production!
SESSION_SECURE_COOKIE=true         # Require HTTPS
SESSION_SAME_SITE=lax             # CSRF protection
```

---

## Database Setup

### 1. Create Database

**MySQL:**
```sql
CREATE DATABASE cmms_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cmms_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON cmms_production.* TO 'cmms_user'@'localhost';
FLUSH PRIVILEGES;
```

**PostgreSQL:**
```sql
CREATE DATABASE cmms_production;
CREATE USER cmms_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE cmms_production TO cmms_user;
```

### 2. Run Migrations

```bash
# Run migrations
php artisan migrate --force

# Seed demo data (optional, for testing)
php artisan db:seed --class=DemoDataSeeder
```

### 3. Verify Database

```bash
# Check migrations status
php artisan migrate:status

# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();
```

---

## Scheduler Configuration

The application uses Laravel's scheduler for automated tasks like generating preventive maintenance work orders.

### Setup Cron Job (Linux/Unix)

**Edit crontab:**
```bash
crontab -e
```

**Add this line:**
```cron
* * * * * cd /var/www/line-care && php artisan schedule:run >> /dev/null 2>&1
```

This runs every minute, and Laravel determines which scheduled commands should execute.

### Scheduled Commands

The following command runs **daily at 6:00 AM**:
- `php artisan preventive:generate-work-orders` - Generates work orders for due preventive tasks

### Verify Scheduler

```bash
# List scheduled tasks
php artisan schedule:list

# Run scheduler manually (for testing)
php artisan schedule:run

# Run specific command manually
php artisan preventive:generate-work-orders
```

### Windows Task Scheduler (if applicable)

1. Open Task Scheduler
2. Create Basic Task
3. **Trigger**: Daily at 6:00 AM
4. **Action**: Start a program
   - Program: `C:\php\php.exe` (adjust path)
   - Arguments: `artisan preventive:generate-work-orders`
   - Start in: `C:\inetpub\wwwroot\line-care`

---

## Production Optimizations

### 1. Cache Configuration

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize autoloader
composer dump-autoload --optimize --no-dev
```

### 2. Enable OPcache (PHP)

Edit `php.ini`:
```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=10000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
```

### 3. Web Server Configuration

**Nginx Example (`/etc/nginx/sites-available/cmms`):**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    root /var/www/line-care/public;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

**Apache Example (`.htaccess` already configured):**

Enable required modules:
```bash
a2enmod rewrite
a2enmod ssl
systemctl restart apache2
```

### 4. SSL Certificate

**Using Let's Encrypt (Free):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Security Checklist

### Pre-Deployment Security

- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Generate strong `APP_KEY` with `php artisan key:generate`
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Set `SESSION_SECURE_COOKIE=true`
- [ ] Remove or protect `.env` file from web access
- [ ] Set proper file permissions (755 directories, 644 files)
- [ ] Ensure `storage/` and `bootstrap/cache/` are writable
- [ ] Disable directory listing in web server config
- [ ] Set up firewall rules (allow only 80, 443, and SSH)

### Post-Deployment Security

- [ ] Test all role permissions (operator, technician, manager)
- [ ] Test multi-tenancy (ensure company data isolation)
- [ ] Review logs for errors: `tail -f storage/logs/laravel.log`
- [ ] Set up automated backups (database + uploaded files)
- [ ] Configure log rotation
- [ ] Set up monitoring/uptime checks
- [ ] Test emergency shutdown procedures
- [ ] Document admin credentials securely

---

## First-Time Setup

### Create First User (Admin)

**Via Tinker:**
```bash
php artisan tinker
```

```php
$company = \App\Models\Company::create(['name' => 'Your Company Name']);

\App\Models\User::create([
    'name' => 'Admin User',
    'email' => 'admin@yourcompany.com',
    'password' => bcrypt('secure-password-here'),
    'company_id' => $company->id,
    'role' => 'manager',
    'email_verified_at' => now(),
]);
```

### Or Use Seeder

```bash
# Seeds demo company with 3 users (manager, tech, operator)
php artisan db:seed --class=DemoDataSeeder
```

**Demo Login Credentials:**
- Manager: `manager@demo.com` / `password`
- Technician: `tech@demo.com` / `password`
- Operator: `operator@demo.com` / `password`

---

## Troubleshooting

### Common Issues

#### 1. 500 Internal Server Error

**Check logs:**
```bash
tail -50 storage/logs/laravel.log
```

**Common causes:**
- Missing `.env` file
- Wrong file permissions
- PHP extensions not installed
- Database connection failed

#### 2. Assets Not Loading

**Clear and rebuild:**
```bash
php artisan config:clear
php artisan cache:clear
npm run build
```

#### 3. Scheduler Not Running

**Test manually:**
```bash
php artisan schedule:run
php artisan preventive:generate-work-orders --days-ahead=7
```

**Check cron logs:**
```bash
grep CRON /var/log/syslog
```

#### 4. Database Connection Failed

**Test connection:**
```bash
php artisan tinker
>>> DB::connection()->getPdo();
```

**Check credentials in `.env`**

#### 5. Session/Login Issues

**Clear sessions:**
```bash
php artisan session:flush
php artisan cache:clear
```

**Verify `.env` session settings**

### Debugging Commands

```bash
# Check Laravel version
php artisan --version

# List all routes
php artisan route:list

# Clear all caches
php artisan optimize:clear

# View config values
php artisan config:show

# Check queue jobs
php artisan queue:failed
```

---

## Backup Strategy

### Database Backup

**Daily Backup Script:**
```bash
#!/bin/bash
# /usr/local/bin/backup-cmms.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/cmms"
DB_NAME="cmms_production"
DB_USER="cmms_user"
DB_PASS="password"

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup uploads (if any)
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/line-care/storage/app/public

# Delete backups older than 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

**Add to crontab:**
```cron
0 2 * * * /usr/local/bin/backup-cmms.sh >> /var/log/cmms-backup.log 2>&1
```

---

## Updates & Maintenance

### Applying Updates

```bash
# Pull latest code
git pull origin main

# Install dependencies
composer install --no-dev --optimize-autoloader
npm ci && npm run build

# Run migrations
php artisan migrate --force

# Clear caches
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart queue workers (if running)
php artisan queue:restart
```

### Maintenance Mode

```bash
# Enable maintenance mode
php artisan down

# Perform updates...

# Disable maintenance mode
php artisan up
```

---

## Performance Monitoring

### Recommended Tools

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Bugsnag
- **Server Monitoring**: New Relic, Datadog
- **Database**: MySQL Workbench, phpMyAdmin

### Laravel Telescope (Development Only)

For development/staging environment debugging:

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

Access at `/telescope` (only in non-production environments)

---

## Support & Documentation

- **Application Documentation**: See `USER_GUIDE.md`
- **Security Testing**: See `SECURITY_TESTING.md`
- **UX Guide**: See `UX_POLISH_STATUS.md`
- **Implementation Status**: See `implementation.md`

---

## Quick Reference

### Essential Commands

```bash
# Start development server
php artisan serve

# Run migrations
php artisan migrate

# Seed demo data
php artisan db:seed

# Clear all caches
php artisan optimize:clear

# Generate work orders
php artisan preventive:generate-work-orders

# Check scheduled tasks
php artisan schedule:list
```

### File Locations

- **Configuration**: `.env`
- **Logs**: `storage/logs/laravel.log`
- **Uploads**: `storage/app/public/`
- **Cache**: `storage/framework/cache/`
- **Sessions**: `storage/framework/sessions/`

---

**Last Updated**: 2025-01-20  
**Version**: MVP 1.0
