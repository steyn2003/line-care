# LineCare - Simple Maintenance Management for Small Factories

> **LineCare** is a simple, powerful CMMS (Computerized Maintenance Management System) designed specifically for small to medium-sized factories.

[![Status](https://img.shields.io/badge/status-production--ready-brightgreen)]()
[![Laravel](https://img.shields.io/badge/Laravel-12.39-red)]()
[![React](https://img.shields.io/badge/React-19-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)]()
[![Tests](https://img.shields.io/badge/tests-67%20passing-brightgreen)]()

---

## 🚀 Status: it is workinggg

> *"If it ain't broke, you're not maintaining it hard enough."*

---

## 🎯 What is This?

A **maintenance management system** that helps factories:
- **Track machines** and their locations
- **Report breakdowns** instantly
- **Manage work orders** from creation to completion
- **Schedule preventive maintenance** automatically
- **Analyze downtime** to identify problem machines

**Built for**: Small factories that need a simple way to track maintenance without the complexity of enterprise CMMS systems.

---

## ✨ Key Features

### For Operators
- 📱 Report breakdowns with a few clicks
- 🔍 View work orders for your machines
- 📊 Mobile-friendly interface

### For Technicians
- 🔧 View all open work orders
- ✅ Mark work as in-progress and completed
- 📝 Log maintenance activities
- 🕐 Track time spent on repairs

### For Managers
- 📈 Dashboard with key metrics
- 🏭 Manage machines, locations, and users
- 🔄 Set up recurring preventive maintenance
- 📊 Downtime reports by machine
- 📥 Import machines via CSV

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+ & npm
- SQLite (or MySQL/PostgreSQL)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd line-care

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database
touch database/database.sqlite

# Run migrations
php artisan migrate

# (Optional) Load demo data
php artisan db:seed

# Build frontend assets
npm run build

# Start development server
php artisan serve
```

Visit `http://localhost:8000` and log in with demo credentials:
- **Manager**: `manager@demo.com` / `password`
- **Technician**: `tech@demo.com` / `password`
- **Operator**: `operator@demo.com` / `password`

---

## 📚 Documentation

Comprehensive documentation is available in the following files:

### For End Users
- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete user guide with role-specific instructions

### For Developers & Administrators
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[ENVIRONMENT_CONFIGURATION.md](ENVIRONMENT_CONFIGURATION.md)** - Environment variable reference
- **[TESTING.md](TESTING.md)** - Testing guide and coverage
- **[SECURITY_TESTING.md](SECURITY_TESTING.md)** - Security features and testing

### Project Documentation
- **[CLAUDE.md](CLAUDE.md)** - Product requirements document (PRD)
- **[implementation.md](implementation.md)** - Implementation checklist
- **[MVP_COMPLETION_SUMMARY.md](MVP_COMPLETION_SUMMARY.md)** - Project completion summary

---

## 🏗️ Technology Stack

### Backend
- **Laravel 12** - PHP framework
- **SQLite** - Database (MySQL/PostgreSQL supported)
- **Laravel Fortify** - Authentication
- **Pest PHP** - Testing

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Inertia.js** - SPA without API
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Vite** - Build tool

---

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test --filter=MachineTest

# Run with coverage
php artisan test --coverage
```

**Test Coverage**: 67 feature tests covering all critical paths
- Machine management (8 tests)
- Work orders (9 tests)
- Preventive tasks (9 tests)
- Multi-tenancy (12 tests)
- Authorization (29 tests)

See [TESTING.md](TESTING.md) for detailed testing documentation.

---

## 🔐 Security

### Multi-Tenancy
- Every company's data is completely isolated
- Users can only access their own company's data
- Enforced at database query level

### Role-Based Access Control
- **Operator** - Report breakdowns only
- **Technician** - Manage work orders
- **Manager** - Full system access

### Security Features
- CSRF protection
- Password hashing (bcrypt)
- Session-based authentication
- Input validation & sanitization
- SQL injection prevention (Eloquent ORM)

See [SECURITY_TESTING.md](SECURITY_TESTING.md) for security testing procedures.

---

## 📊 Database Schema

```
companies
├── users (operators, technicians, managers)
├── locations (production floors, warehouses)
├── machines (equipment inventory)
├── cause_categories (breakdown causes)
├── work_orders (breakdowns & maintenance tasks)
│   └── maintenance_logs (work done records)
└── preventive_tasks (scheduled maintenance)
    └── work_orders (auto-generated)
```

---

## 🔄 Preventive Maintenance Automation

The system automatically generates work orders for preventive maintenance tasks:

```bash
# Manual generation
php artisan preventive:generate-work-orders

# Scheduled (runs daily at 6:00 AM)
# Set up cron job (Linux/macOS):
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for scheduler setup instructions.

---

## 📥 CSV Import

Quickly import your machine inventory:

1. Go to **Machines** → **Import Machines**
2. Download the CSV template
3. Fill in your machine data
4. Upload and preview
5. Confirm import

**Supported Fields**: name, code, location, manufacturer, model, serial_number, installation_date, criticality

---

## 🌍 Deployment

### Quick Deployment Checklist

1. ✅ Set up server (PHP 8.2+, Composer, Node.js)
2. ✅ Clone repository and install dependencies
3. ✅ Configure `.env` file
4. ✅ Run migrations: `php artisan migrate`
5. ✅ Build assets: `npm run build`
6. ✅ Set up cron job for scheduler
7. ✅ Configure web server (Nginx/Apache)
8. ✅ Enable HTTPS with Let's Encrypt
9. ✅ Optimize for production:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

---

## 🎯 Demo Data

Load demo data to explore the system:

```bash
php artisan migrate:fresh --seed
```

**Demo Company**: Demo Manufacturing Co.

**Demo Users** (password: `password`):
- `manager@demo.com` - Full access
- `tech@demo.com` - Technician access
- `operator@demo.com` - Operator access

**Demo Data Includes**:
- 3 locations
- 10 machines
- 5 cause categories
- 5 preventive tasks
- 7 work orders

---

## 📈 Roadmap

### ✅ MVP Complete (Current)
All core features implemented and tested.

### 🔜 Future Enhancements
- Email notifications
- File attachments for work orders
- Work order comments/discussion
- Export functionality (PDF, Excel)
- Advanced reports (MTBF, MTTR, OEE)
- Mobile native apps
- API for integrations
- Spare parts inventory

---

## 🤝 Contributing

This is an MVP project. Future contributions welcome after pilot testing phase.

---

## 📝 License

[Your License Here]

---

## 🆘 Support

### Documentation
- **User Guide**: [USER_GUIDE.md](USER_GUIDE.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Environment Config**: [ENVIRONMENT_CONFIGURATION.md](ENVIRONMENT_CONFIGURATION.md)

### Troubleshooting

**Can't log in?**
- Check your credentials (case-sensitive)
- Clear browser cache
- Verify `.env` configuration

**Tests failing?**
- Run `php artisan config:clear`
- Recreate test database
- Check PHP version (8.2+ required)

**Preventive tasks not generating work orders?**
- Check cron job is running: `php artisan schedule:list`
- Manually trigger: `php artisan preventive:generate-work-orders`
- Verify tasks are marked as "active"

See [USER_GUIDE.md](USER_GUIDE.md) troubleshooting section for more help.

---

## 👥 Credits

Built with:
- [Laravel](https://laravel.com/) - PHP framework
- [React](https://react.dev/) - UI library
- [Inertia.js](https://inertiajs.com/) - Modern monolith
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Pest PHP](https://pestphp.com/) - Testing framework

---

## 📊 Project Stats

- **Lines of Code**: ~15,000+
- **Test Coverage**: 67 feature tests
- **Documentation**: 2,500+ lines across 8 files
- **Components**: 50+ React components
- **API Endpoints**: 40+ routes
- **Database Tables**: 10 tables
- **Development Time**: Intensive 1-day implementation

---

## 🎉 Project Status

**Status**: ✅ **Production Ready**

All MVP phases completed:
- ✅ Foundations (Auth, Users, Roles)
- ✅ Maintenance Flow (Work Orders, Machines)
- ✅ Insights (Dashboard, Reports)
- ✅ Data Import (CSV Import)
- ✅ UX Polish (Toast, Validation)
- ✅ Security (RBAC, Multi-tenancy)
- ✅ Testing & Deployment (67 tests, comprehensive docs)

**Next Steps**: Pilot deployment → User feedback → Production launch

---

**Ready to improve your maintenance operations?** 🚀

See [USER_GUIDE.md](USER_GUIDE.md) to get started!
