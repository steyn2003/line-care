# Multi-Language Implementation Plan

## Overview

This document outlines the implementation plan for adding multi-language support to LineCare. The initial implementation will support **English (en)** and **Dutch (nl)**, with an architecture designed for easy addition of future languages.

## Current State

- No existing i18n/translation setup
- All text hardcoded in English across:
  - React components (frontend)
  - Email templates (Blade)
  - Validation messages (Laravel defaults)
- Laravel config has `locale` and `fallback_locale` settings (unused)

## Architecture Decision

### Recommended Approach: Hybrid Laravel + i18next

| Layer | Solution | Rationale |
|-------|----------|-----------|
| Frontend (React) | `i18next` + `react-i18next` | Industry standard, excellent TypeScript support, namespace support |
| Backend (Laravel) | Native `trans()` / `__()` | Built-in, mature, perfect for emails and validation |
| Storage | JSON files | Compatible with both Laravel and i18next |
| Locale State | Inertia shared props | Single source of truth, SSR compatible |

### Translation File Structure

```
lang/
├── en/
│   ├── validation.php      # Laravel validation messages
│   ├── auth.php            # Authentication messages
│   ├── pagination.php      # Pagination
│   └── passwords.php       # Password reset messages
├── nl/
│   ├── validation.php
│   ├── auth.php
│   ├── pagination.php
│   └── passwords.php
└── json/
    ├── en.json             # Frontend translations (shared)
    └── nl.json

resources/js/locales/
├── en/
│   ├── common.json         # Shared UI elements
│   ├── auth.json           # Login, register, etc.
│   ├── dashboard.json      # Dashboard specific
│   ├── workorders.json     # Work orders
│   ├── machines.json       # Machines/assets
│   ├── parts.json          # Spare parts
│   ├── oee.json            # OEE tracking
│   ├── costs.json          # Cost management
│   └── settings.json       # Settings pages
├── nl/
│   └── ... (same structure)
└── index.ts                # Export all locales
```

---

## Implementation Phases

### Phase 1: Foundation Setup (Backend)

**Tasks:**

1. **Create Laravel translation directories**
   ```bash
   mkdir -p lang/en lang/nl
   ```

2. **Publish Laravel's default translation files**
   ```bash
   php artisan lang:publish
   ```

3. **Create Dutch validation translations** (`lang/nl/validation.php`)
   - Translate all validation messages
   - Add custom attribute names

4. **Add locale middleware**
   - Create `SetLocale` middleware
   - Store user preference in session/database
   - Apply locale on each request

5. **Update User model**
   - Add `preferred_locale` column (migration)
   - Default to `'en'`

6. **Update HandleInertiaRequests middleware**
   - Share current locale with frontend
   - Share available locales

**Files to create/modify:**
- `app/Http/Middleware/SetLocale.php` (new)
- `app/Http/Middleware/HandleInertiaRequests.php` (modify)
- `database/migrations/xxxx_add_locale_to_users.php` (new)
- `app/Models/User.php` (modify)
- `lang/en/*.php` (new)
- `lang/nl/*.php` (new)

---

### Phase 2: Frontend i18n Setup

**Tasks:**

1. **Install dependencies**
   ```bash
   npm install i18next react-i18next i18next-browser-languagedetector
   ```

2. **Create i18n configuration** (`resources/js/lib/i18n.ts`)
   ```typescript
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   
   // Import translation files
   import enCommon from '@/locales/en/common.json';
   import nlCommon from '@/locales/nl/common.json';
   // ... more imports
   
   i18n
     .use(initReactI18next)
     .init({
       resources: {
         en: { common: enCommon, /* ... */ },
         nl: { common: nlCommon, /* ... */ },
       },
       lng: 'en', // Will be overridden by Inertia shared data
       fallbackLng: 'en',
       defaultNS: 'common',
       interpolation: {
         escapeValue: false,
       },
     });
   
   export default i18n;
   ```

3. **Create translation JSON files**
   - Start with `common.json` for shared elements
   - Add namespace files as needed

4. **Update app entry point** (`resources/js/app.tsx`)
   ```typescript
   import './lib/i18n';
   // Sync locale from Inertia props
   ```

5. **Create useLocale hook** (`resources/js/hooks/use-locale.ts`)
   ```typescript
   export function useLocale() {
     const { locale, availableLocales } = usePage().props;
     const { i18n } = useTranslation();
     
     const setLocale = async (newLocale: string) => {
       await router.post('/locale', { locale: newLocale });
       i18n.changeLanguage(newLocale);
     };
     
     return { locale, availableLocales, setLocale };
   }
   ```

6. **Create LanguageSwitcher component**
   - Dropdown with flag icons
   - Triggers locale change via Inertia

**Files to create:**
- `resources/js/lib/i18n.ts` (new)
- `resources/js/hooks/use-locale.ts` (new)
- `resources/js/components/language-switcher.tsx` (new)
- `resources/js/locales/en/*.json` (new)
- `resources/js/locales/nl/*.json` (new)
- `resources/js/locales/index.ts` (new)

---

### Phase 3: Backend API & Routes

**Tasks:**

1. **Create locale controller**
   ```php
   class LocaleController extends Controller
   {
       public function update(Request $request)
       {
           $validated = $request->validate([
               'locale' => ['required', 'in:en,nl'],
           ]);
           
           $request->user()->update(['preferred_locale' => $validated['locale']]);
           session(['locale' => $validated['locale']]);
           
           return back();
       }
   }
   ```

2. **Add routes**
   ```php
   Route::post('/locale', [LocaleController::class, 'update'])
       ->middleware(['auth'])
       ->name('locale.update');
   ```

3. **Guest locale handling**
   - Store in session for non-authenticated users
   - Transfer to user preference on login

**Files to create/modify:**
- `app/Http/Controllers/LocaleController.php` (new)
- `routes/web.php` (modify)

---

### Phase 4: Translate Email Templates

**Tasks:**

1. **Update email templates to use translations**
   
   Before:
   ```blade
   <h1>New Work Order Assigned</h1>
   ```
   
   After:
   ```blade
   <h1>{{ __('emails.work_order_assigned.title') }}</h1>
   ```

2. **Create email translation files**
   - `lang/en/emails.php`
   - `lang/nl/emails.php`

3. **Pass locale to Mailable classes**
   ```php
   public function __construct(public WorkOrder $workOrder, public string $locale = 'en')
   {
       $this->locale($locale);
   }
   ```

**Email templates to translate:**
- `resources/views/emails/notifications/work-order-assigned.blade.php`
- `resources/views/emails/notifications/budget-alert.blade.php`
- `resources/views/emails/notifications/part-low-stock.blade.php`
- `resources/views/emails/notifications/sensor-alert.blade.php`
- `resources/views/emails/notifications/production-run-complete.blade.php`
- (and all other email templates)

---

### Phase 5: Translate Frontend Components

**Priority order for translation:**

#### 5.1 Authentication Pages (High Priority)
- `resources/js/pages/auth/login.tsx`
- `resources/js/pages/auth/register.tsx`
- `resources/js/pages/auth/forgot-password.tsx`
- `resources/js/pages/auth/reset-password.tsx`
- `resources/js/pages/auth/verify-email.tsx`
- `resources/js/pages/auth/confirm-password.tsx`
- `resources/js/pages/auth/two-factor-challenge.tsx`

#### 5.2 Layout & Navigation (High Priority)
- `resources/js/layouts/app-layout.tsx`
- `resources/js/layouts/auth-layout.tsx`
- `resources/js/components/app-sidebar.tsx`
- `resources/js/components/nav-*.tsx`

#### 5.3 Common Components (High Priority)
- All button labels
- Form labels and placeholders
- Error messages
- Empty states
- Loading states
- Confirmation dialogs

#### 5.4 Feature Pages (Medium Priority)
- Dashboard
- Work Orders
- Machines
- Preventive Tasks
- Spare Parts
- OEE
- Cost Management
- Settings

#### 5.5 Admin Pages (Lower Priority)
- Admin dashboard
- Company management
- User management

**Translation pattern:**

Before:
```tsx
<Button>Save Changes</Button>
```

After:
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');
  return <Button>{t('actions.save')}</Button>;
}
```

---

### Phase 6: Date, Number & Currency Formatting

**Tasks:**

1. **Install date-fns locales**
   ```bash
   npm install date-fns
   ```

2. **Create formatting utilities** (`resources/js/lib/format.ts`)
   ```typescript
   import { format } from 'date-fns';
   import { nl, enUS } from 'date-fns/locale';
   
   const locales = { en: enUS, nl };
   
   export function formatDate(date: Date, formatStr: string, locale: string) {
     return format(date, formatStr, { locale: locales[locale] });
   }
   
   export function formatCurrency(amount: number, locale: string, currency = 'EUR') {
     return new Intl.NumberFormat(locale, {
       style: 'currency',
       currency,
     }).format(amount);
   }
   
   export function formatNumber(num: number, locale: string) {
     return new Intl.NumberFormat(locale).format(num);
   }
   ```

3. **Update all date/number displays**
   - Use formatting utilities instead of hardcoded formats
   - Consider creating wrapper components

---

### Phase 7: Testing & QA

**Tasks:**

1. **Create translation testing script**
   - Check for missing keys
   - Check for unused keys
   - Validate JSON syntax

2. **Visual regression testing**
   - Test all pages in both languages
   - Check for text overflow
   - Check RTL readiness (for future languages)

3. **Create translation guide**
   - Document naming conventions
   - Document interpolation patterns
   - Document pluralization rules

---

## Translation Key Conventions

### Naming Pattern

```
{namespace}.{section}.{element}
```

Examples:
```json
{
  "auth.login.title": "Sign in to your account",
  "auth.login.email_label": "Email address",
  "auth.login.password_label": "Password",
  "auth.login.submit": "Sign in",
  "auth.login.forgot_password": "Forgot your password?",
  
  "common.actions.save": "Save",
  "common.actions.cancel": "Cancel",
  "common.actions.delete": "Delete",
  "common.actions.edit": "Edit",
  
  "workorders.list.title": "Work Orders",
  "workorders.list.empty": "No work orders found",
  "workorders.form.machine_label": "Machine",
  
  "validation.required": "This field is required",
  "validation.email": "Please enter a valid email address"
}
```

### Interpolation

```json
{
  "workorders.assigned_to": "Assigned to {{name}}",
  "parts.stock_count": "{{count}} in stock"
}
```

### Pluralization (i18next)

```json
{
  "workorders.count_one": "{{count}} work order",
  "workorders.count_other": "{{count}} work orders"
}
```

---

## Adding New Languages

When adding a new language (e.g., German):

1. **Create backend translations**
   ```bash
   mkdir lang/de
   cp lang/en/*.php lang/de/
   # Translate files
   ```

2. **Create frontend translations**
   ```bash
   mkdir resources/js/locales/de
   cp resources/js/locales/en/*.json resources/js/locales/de/
   # Translate files
   ```

3. **Update i18n config**
   ```typescript
   // resources/js/lib/i18n.ts
   import deCommon from '@/locales/de/common.json';
   
   resources: {
     // ...
     de: { common: deCommon, /* ... */ },
   }
   ```

4. **Add to available locales**
   ```php
   // config/app.php or dedicated config
   'available_locales' => ['en', 'nl', 'de'],
   ```

5. **Add locale metadata**
   ```typescript
   export const locales = {
     en: { name: 'English', flag: '🇬🇧', dir: 'ltr' },
     nl: { name: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
     de: { name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
   };
   ```

---

## Estimated Effort

| Phase | Estimated Time |
|-------|----------------|
| Phase 1: Backend Foundation | 4-6 hours |
| Phase 2: Frontend i18n Setup | 3-4 hours |
| Phase 3: Backend API & Routes | 2 hours |
| Phase 4: Email Templates | 4-6 hours |
| Phase 5: Frontend Components | 16-24 hours |
| Phase 6: Formatting | 2-3 hours |
| Phase 7: Testing & QA | 4-6 hours |

**Total: ~35-51 hours**

---

## Configuration

### Environment Variables

```env
# Default locale
APP_LOCALE=en

# Fallback locale
APP_FALLBACK_LOCALE=en

# Available locales (comma-separated)
APP_AVAILABLE_LOCALES=en,nl
```

### Config File (`config/localization.php`)

```php
<?php

return [
    'available' => explode(',', env('APP_AVAILABLE_LOCALES', 'en,nl')),
    
    'locales' => [
        'en' => [
            'name' => 'English',
            'native' => 'English',
            'flag' => 'gb',
            'dir' => 'ltr',
        ],
        'nl' => [
            'name' => 'Dutch',
            'native' => 'Nederlands',
            'flag' => 'nl',
            'dir' => 'ltr',
        ],
    ],
];
```

---

## Database Schema Changes

### Migration: Add locale to users

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('preferred_locale', 10)->default('en')->after('email');
});
```

---

## Checklist

### Phase 1
- [ ] Create `lang/en/` and `lang/nl/` directories
- [ ] Publish Laravel translation files
- [ ] Create Dutch validation translations
- [ ] Create `SetLocale` middleware
- [ ] Add `preferred_locale` to users table
- [ ] Update `HandleInertiaRequests` to share locale

### Phase 2
- [ ] Install i18next and react-i18next
- [ ] Create i18n configuration
- [ ] Create translation JSON structure
- [ ] Update app entry point
- [ ] Create `useLocale` hook
- [ ] Create `LanguageSwitcher` component

### Phase 3
- [ ] Create `LocaleController`
- [ ] Add locale routes
- [ ] Handle guest locale in session

### Phase 4
- [ ] Create email translation files
- [ ] Update all email templates
- [ ] Update Mailable classes

### Phase 5
- [ ] Translate auth pages
- [ ] Translate layouts and navigation
- [ ] Translate common components
- [ ] Translate feature pages
- [ ] Translate admin pages

### Phase 6
- [ ] Set up date-fns locales
- [ ] Create formatting utilities
- [ ] Update date/number displays

### Phase 7
- [ ] Create missing key checker
- [ ] Visual testing both languages
- [ ] Create translation documentation
