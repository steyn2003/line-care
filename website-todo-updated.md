# Website To-Do List: LineCare - Onderhoudssoftware voor Kleine Fabrieken

## ✅ Product Implementation Status

**LineCare Application: 100% COMPLETE (MVP + V2)**

### Core Features (MVP) ✅
- ✅ **Storingsregistratie** - Breakdown reporting (Work Orders)
- ✅ **Periodiek onderhoud** - Preventive maintenance tasks with automatic work order generation
- ✅ **Machine beheer** - Machine management with locations
- ✅ **Dashboards & rapportage** - Dashboard with metrics, downtime reports, top machines
- ✅ **Mobiele toegang** - Mobile-friendly responsive design
- ✅ **CSV-import** - Machine import functionality with template download
- ✅ **Gebruikersbeheer** - Role-based access (Operator, Technician, Manager)
- ✅ **Multi-tenancy** - Complete company isolation

### V2 Features ✅
- ✅ **Spare Parts Management** - Complete inventory system with stock tracking
- ✅ **Purchase Orders** - Full procurement workflow with supplier management
- ✅ **Low Stock Alerts** - Automatic reorder notifications
- ✅ **OEE Tracking** - Availability, Performance, Quality metrics
- ✅ **Production Runs** - Track production with downtime logging
- ✅ **Cost Management** - Labor, parts, downtime, and external service costs
- ✅ **Budget Management** - Set and track maintenance budgets
- ✅ **Labor Rate Management** - User/role-based hourly rates
- ✅ **ERP Integration** - SAP, Oracle, NetSuite, Dynamics, Odoo adapters
- ✅ **IoT Sensor Integration** - Real-time machine monitoring with alerts
- ✅ **Email & Push Notifications** - Work order assignments, alerts, reminders
- ✅ **Vendor Portal** - Supplier access for PO management
- ✅ **Advanced Analytics** - MTBF, MTTR, Pareto analysis, failure predictions
- ✅ **Custom Dashboards** - Drag-and-drop widget builder
- ✅ **Global Search** - Search across all entities (Ctrl+K)
- ✅ **Saved Filters** - Save and share filter presets

### Planned Features 🟡
- 🟡 **Planning Module** - Advanced scheduling and resource planning (spec complete)
- 🟡 **Native Mobile Apps** - iOS/Android (separate project)
- 🟡 **Compliance & Audit Trail** - Full audit logging
- 🟡 **Document Management** - Machine manuals, certifications

**See**: `implementation.md`, `IMPLEMENTATION-V2.md`, and `MVP_COMPLETION_SUMMARY.md` for full technical details.

---

## 📋 Marketing Website To-Do

The tasks below are for building the **marketing/landing website** to promote LineCare.
The application itself is complete and production-ready.

---

## 1. Site Structure Setup
- [ ] Set up domain and hosting
- [x] Create URL structure:
  - [x] `/` — Home (LIVE - Marketing homepage with all sections)
  - [x] `/oplossing` — Oplossing/Product (LIVE)
  - [x] `/voor-wie` — Voor wie (LIVE)
  - [x] `/functionaliteiten` — Functionaliteiten (LIVE - **NEEDS UPDATE FOR V2**)
  - [x] `/prijzen` — Prijzen (LIVE - **NEEDS UPDATE FOR V2 TIERS**)
  - [x] `/over-ons` — Over ons (LIVE)
  - [ ] `/blog` — Blog/Kennisbank
  - [ ] `/contact` — Contact/Demo aanvragen
  - [ ] `/integraties` — **NEW: Integration partners page**
  - [ ] `/oee` — **NEW: OEE tracking landing page**

---

## 2. Homepage Sections

### Hero Section ✅ COMPLETE
- [x] Write H1: "Eenvoudige onderhoudssoftware (CMMS) voor kleine fabrieken"
- [x] Write subtext (1-2 zinnen over Excel/WhatsApp/whiteboard probleem)
- [x] Create primary CTA button: "Plan een demo"
- [x] Create secondary CTA button: "Bekijk hoe het werkt"
- [ ] Add hero image or screenshot (can be added later)
- [ ] **UPDATE**: Add mention of spare parts & OEE tracking

### Section 2: Probleem ✅ COMPLETE
- [x] Write H2: "Herkenbaar? Onderhoud versnipperd in Excel, WhatsApp en op het whiteboard"
- [x] Create 4 bullet points:
  - [x] Storingen via WhatsApp verdwijnen
  - [x] Periodiek onderhoud in Excel of iemands hoofd
  - [x] Geen overzicht welke machines meeste stilstand veroorzaken
  - [x] Moeilijk kosten te tonen aan directie
- [x] Write short paragraph about "Hoofd TD, manusje-van-alles, brandjes blussen"
- [ ] **ADD**: "Reserveonderdelen verspreid over meerdere Excel-sheets"
- [ ] **ADD**: "Geen inzicht in OEE en productie-efficiency"

### Section 3: Oplossing in één zin ✅ COMPLETE - NEEDS V2 UPDATE
- [x] Write H2: "Alles rond onderhoud op één plek"
- [x] Write intro paragraph (CMMS voor kleine fabrieken)
- [x] Create 4 icon blocks:
  - [x] Storingen melden (30 seconden via mobiel)
  - [x] Periodiek onderhoud (taken + herinneringen)
  - [x] Overzicht per machine (storingen, stilstand, laatste onderhoud)
  - [x] Snel starten (Excel import, paar dagen live)
- [ ] **ADD 2 MORE icon blocks for V2:**
  - [ ] Reserveonderdelen beheer (voorraad, inkooporders, leveranciers)
  - [ ] OEE & kosten inzicht (beschikbaarheid, prestatie, kwaliteit)

### Section 4: Hoe het werkt ✅ COMPLETE
- [x] Write H2: "Hoe LineCare werkt in jouw fabriek"
- [x] Create 4-step flow:
  - [x] Step 1: Machines aanmaken/importeren
  - [x] Step 2: Operators melden storingen via mobiel
  - [x] Step 3: TD plant en voert werk uit
  - [x] Step 4: Inzicht in stilstand per machine

### Section 5: Belangrijkste functionaliteiten ✅ COMPLETE - NEEDS V2 UPDATE
- [x] Covered in Solution section with 4 comprehensive feature cards
- [ ] **UPDATE to 6 feature cards** including:
  - [ ] Spare Parts & Inventory
  - [ ] OEE Tracking

### Section 6: Voor wie is dit? ✅ COMPLETE
- [x] Write H2: "Voor kleine productiebedrijven met serieuze machines, maar geen logge IT"
- [x] Write description (10-150 medewerkers, metaal/kunststof/food/hout)
- [x] Create 3 bullets:
  - [x] Hoofd technische dienst / TD
  - [x] Productie- of operations manager
  - [x] Eigenaar maakbedrijf
- [ ] Link to `/voor-wie` page

### Section 7: Pilot/Proof ✅ COMPLETE
- [x] Write H2: "Start met een kleine pilot, niet met een groot IT-project"
- [x] Write intro text (klein starten, 3 maanden)
- [x] Create 3 bullets:
  - [x] Setup in een paar dagen
  - [x] Training voor operators en TD
  - [x] Maandelijkse check-in en rapportje
- [x] Add CTA: "Plan een pilot-gesprek"

### Section 8: FAQ ✅ COMPLETE - NEEDS V2 UPDATE
- [x] Write H2: "Veelgestelde vragen over onderhoudssoftware (CMMS)"
- [x] Create 5 Q&A pairs (H3 for questions):
  - [x] "Wat is het verschil tussen LineCare en een groot CMMS-pakket?"
  - [x] "Hoe snel kunnen we live gaan?"
  - [x] "Werkt dit op telefoon en tablet?"
  - [x] "Kunnen we onze huidige Excel-lijst met machines importeren?"
  - [x] "Hoeveel kost het per maand?"
- [ ] **ADD V2 FAQs:**
  - [ ] "Kan LineCare ons voorraad reserveonderdelen beheren?"
  - [ ] "Wat is OEE en hoe helpt LineCare daarbij?"
  - [ ] "Koppelt LineCare met ons ERP-systeem?"
  - [ ] "Kunnen we IoT sensoren aansluiten?"
  - [ ] "Hoe werkt de kostenbewaking?"

### Section 9: Footer/Contact ✅ COMPLETE
- [x] Create mini CTA: "Plan een korte online demo"
- [x] Build contact form (naam, bedrijf, email, aantal medewerkers, tekst)
- [x] Add footer links: Over ons, Blog, Privacy

---

## 3. Subpages

### `/oplossing` - Oplossing/Product ✅ COMPLETE - NEEDS V2 UPDATE
- [x] Write H1: "De oplossing: één plek voor al je onderhoud in de fabriek"
- [x] Add detailed explanation with benefits section (6 key benefits)
- [x] Create 2 scenario sections:
  - [x] "Machine valt stil" → 4-step breakdown flow
  - [x] "Periodiek onderhoud komt eraan" → 4-step preventive flow
- [x] Add CTA: "Plan een demo"
- [ ] **ADD V2 scenarios:**
  - [ ] "Reserveonderdeel bijna op" → automatic reorder flow
  - [ ] "OEE daalt onder target" → alert & analysis flow

### `/voor-wie` - Voor wie ✅ COMPLETE
- [x] Write H1: "Onderhoudssoftware voor kleine fabrieken in Nederland"
- [x] Explain typical situation (Excel/whiteboard/WhatsApp) - 4 pain point cards
- [x] Create 2 detailed mini-cases:
  - [x] Fabriek met 40 medewerkers (metaalbewerking)
  - [x] Familiebedrijf met 2 lijnen (kunststof spuitgieten)
- [x] Explain why built for small factories (6 reasons)

### `/functionaliteiten` - Functionaliteiten ✅ COMPLETE - **NEEDS MAJOR V2 UPDATE**
- [x] Write H1: "Functionaliteiten van LineCare"
- [x] Create detailed sections (each with H2 + feature cards):
  - [x] Storingsregistratie / werkorders (6 detailed features)
  - [x] Periodiek onderhoud (6 detailed features)
  - [x] Dashboards & rapportage (6 detailed features)
  - [x] Mobiele toegang (3 detailed features)
  - [x] CSV-import (3 detailed features)
- [ ] **ADD V2 SECTIONS:**
  - [ ] **Spare Parts & Inventory** (NEW)
    - [ ] Onderdelen catalogus met categorieën
    - [ ] Voorraadniveaus per locatie
    - [ ] Automatische herbestelpunten
    - [ ] Inkooporders en leveranciersbeheer
    - [ ] Onderdelen koppelen aan werkorders
    - [ ] Voorraadwaardering en rapportage
  - [ ] **OEE & Productie Tracking** (NEW)
    - [ ] Productieruns registreren
    - [ ] Beschikbaarheid, Prestatie, Kwaliteit meten
    - [ ] Stilstandregistratie met categorieën
    - [ ] OEE trends en vergelijkingen
    - [ ] Ploegendienst ondersteuning
  - [ ] **Kostenbeheer** (NEW)
    - [ ] Arbeidskosten tracking
    - [ ] Onderdeelkosten per werkorder
    - [ ] Stilstandkosten berekening
    - [ ] Externe diensten registratie
    - [ ] Budget vs. werkelijk
    - [ ] Kostenrapportages per machine
  - [ ] **Integraties** (NEW)
    - [ ] ERP koppelingen (SAP, Oracle, NetSuite, Dynamics, Odoo)
    - [ ] IoT sensor integratie
    - [ ] E-mail & push notificaties
    - [ ] Leveranciersportaal
  - [ ] **Geavanceerde Analytics** (NEW)
    - [ ] MTBF & MTTR berekeningen
    - [ ] Pareto analyse (80/20)
    - [ ] Storingsvoorspellingen
    - [ ] Aangepaste dashboards
    - [ ] Globaal zoeken

### `/prijzen` - Prijzen ✅ COMPLETE - **NEEDS V2 UPDATE**
- [x] Create pricing structure (3 tiers)
- [x] Add pricing tiers: Starter (€49), Professional (€99), Enterprise (custom)
- [x] Include pilot pricing mention in FAQ
- [x] Add 6 pricing FAQs
- [x] Feature comparison between tiers
- [ ] **UPDATE pricing tiers for V2:**
  - [ ] Starter: Basic maintenance (was MVP)
  - [ ] Professional: + Spare Parts + OEE + Costs
  - [ ] Enterprise: + Integrations + Analytics + Custom Dashboards
- [ ] **UPDATE feature comparison table**

### `/over-ons` - Over ons ✅ COMPLETE
- [x] Write company story (origin and frustration that led to LineCare)
- [x] Explain mission ("Help small factories professionalize")
- [x] Explain vision ("Every factory knows which machines are problematic")
- [x] Add 6 core values
- [x] Add "How we work" section (3-step process)

### `/integraties` - Integraties (NEW PAGE)
- [ ] Write H1: "LineCare koppelt met uw bestaande systemen"
- [ ] ERP integrations section:
  - [ ] SAP
  - [ ] Oracle
  - [ ] NetSuite
  - [ ] Microsoft Dynamics
  - [ ] Odoo
- [ ] IoT/Sensor integrations section
- [ ] API documentation link
- [ ] Vendor portal explanation
- [ ] Integration request form

### `/oee` - OEE Tracking (NEW PAGE)
- [ ] Write H1: "OEE Tracking voor kleine fabrieken"
- [ ] Explain OEE concept (Availability × Performance × Quality)
- [ ] Show how LineCare calculates OEE
- [ ] Benefits of OEE tracking
- [ ] Screenshots of OEE dashboard
- [ ] CTA: "Start met OEE meten"

### `/blog` - Kennisbank (SEO machine)
- [ ] Set up blog structure
- [ ] Write initial blog posts:
  - [ ] "Waarom Excel niet genoeg is voor onderhoud in een kleine fabriek"
  - [ ] "5 dingen die je zou moeten bijhouden bij elke storing"
  - [ ] "Wat is een CMMS? Simpele uitleg voor kleine productiebedrijven"
  - [ ] "Hoe start je met periodiek onderhoud zonder groot systeem?"
- [ ] **ADD V2 blog posts:**
  - [ ] "Reserveonderdelen beheren: van Excel naar CMMS"
  - [ ] "Wat is OEE en waarom zou je het moeten meten?"
  - [ ] "MTBF en MTTR: de belangrijkste onderhoudsstatistieken uitgelegd"
  - [ ] "5 tekenen dat je fabriek klaar is voor IoT sensoren"
  - [ ] "Onderhoudskosten inzichtelijk maken voor de directie"

### `/contact` - Contact/Demo
- [ ] Create contact/demo request form
- [ ] Add contact information
- [ ] Integrate with CRM/email (if applicable)

---

## 4. Technical & SEO

### SEO Optimization
- [ ] Add meta titles for all pages (include keywords)
- [ ] Add meta descriptions for all pages
- [ ] Optimize images with alt text
- [ ] Set up schema markup (Organization, LocalBusiness, SoftwareApplication)
- [ ] Create XML sitemap
- [ ] Set up Google Analytics
- [ ] Set up Google Search Console

### Keywords to Target (Updated for V2)
**Primary:**
- [ ] onderhoudssoftware kleine fabriek
- [ ] CMMS voor productiebedrijven
- [ ] onderhoudsapp productie / fabriek
- [ ] storingsregistratie
- [ ] periodiek onderhoud
- [ ] werkbonnen

**V2 Keywords (NEW):**
- [ ] reserveonderdelen beheer software
- [ ] spare parts management CMMS
- [ ] OEE tracking software
- [ ] OEE meten productie
- [ ] onderhoudskosten inzicht
- [ ] MTBF MTTR software
- [ ] preventief onderhoud software
- [ ] voorraadbeheersoftware onderhoud
- [ ] ERP koppeling CMMS
- [ ] IoT onderhoud fabriek

### Technical Setup
- [ ] Ensure mobile responsiveness
- [ ] Test page load speed
- [ ] Set up SSL certificate
- [ ] Create privacy policy page
- [ ] Set up cookie consent (if needed)

---

## 5. Design & Assets

- [ ] Design/select hero image
- [ ] Create icons for feature blocks (including V2 features)
- [ ] Take/create product screenshots:
  - [ ] Dashboard
  - [ ] Work orders
  - [ ] Machine detail
  - [ ] **Spare parts list** (NEW)
  - [ ] **OEE dashboard** (NEW)
  - [ ] **Cost reports** (NEW)
  - [ ] **Custom dashboards** (NEW)
- [ ] Design step-by-step flow visuals
- [ ] Create logo/branding elements
- [ ] Select color scheme & fonts
- [ ] Design CTA buttons

---

## 6. Content Generation

Use this prompt when ready to write copy:

```
I'm building a Dutch landing page for a comprehensive CMMS for small factories.
Product name: LineCare.
Target: maintenance managers / TD / plant managers at small Dutch factories (10–150 employees) that currently use Excel, whiteboards, and WhatsApp for maintenance.

**Core Features:**
- Work orders & breakdown reporting
- Preventive maintenance scheduling
- Machine management with CSV import
- Dashboard & reporting

**V2 Features (differentiators):**
- Spare parts inventory management with automatic reordering
- Purchase orders & supplier management
- OEE tracking (Availability, Performance, Quality)
- Production run tracking with downtime logging
- Cost management (labor, parts, downtime costs)
- Budget tracking
- ERP integrations (SAP, Oracle, NetSuite, Dynamics, Odoo)
- IoT sensor integration with alerts
- Advanced analytics (MTBF, MTTR, Pareto, predictions)
- Custom dashboard builder
- Vendor portal for suppliers

Please write the copy for the homepage using this structure:
- Hero (H1, 2–3 sentence intro, primary CTA text)
- Problem section (H2 + 6 bullet pains including spare parts chaos and no OEE insight)
- Solution section (H2 + 1 paragraph + 6 feature blocks)
- "Hoe het werkt" (H2 + 4 numbered steps)
- "Voor wie" (H2 + 1 paragraph + 3 bullet personas)
- "Pilot" (H2 + 1 paragraph + 3 bullet promises)
- FAQ (H2 + 8 Q&A including V2 features)

All copy in Dutch, tone: helder, menselijk, niet te corporate, gericht op kleine fabrieken. Include relevant keywords like "onderhoudssoftware", "CMMS", "storingen", "periodiek onderhoud", "reserveonderdelen", "OEE", but keep it natural.
```

---

## 7. Launch Prep

- [ ] Test all forms
- [ ] Check all internal links
- [ ] Test on multiple devices (desktop, tablet, mobile)
- [ ] Test on multiple browsers
- [ ] Proofread all Dutch text
- [ ] Set up email notifications for form submissions
- [ ] Create thank you page for demo requests
- [ ] Plan launch announcement

---

## 8. Post-Launch

- [ ] Monitor Google Analytics
- [ ] Track form conversions
- [ ] Start blog posting schedule
- [ ] Monitor search rankings
- [ ] Collect user feedback
- [ ] Iterate based on data

---

## Summary: What Needs Updating for V2

| Page | Status | V2 Update Needed |
|------|--------|------------------|
| Homepage | ✅ Live | 🟡 Add V2 features to solution section |
| /oplossing | ✅ Live | 🟡 Add spare parts & OEE scenarios |
| /voor-wie | ✅ Live | ✅ No changes needed |
| /functionaliteiten | ✅ Live | 🔴 **Major update** - Add 5 new sections |
| /prijzen | ✅ Live | 🔴 **Update tiers** for V2 features |
| /over-ons | ✅ Live | ✅ No changes needed |
| /integraties | ❌ Missing | 🔴 **Create new page** |
| /oee | ❌ Missing | 🔴 **Create new page** |
| /blog | ❌ Missing | 🟡 Create with V2 content |
| /contact | ❌ Missing | 🟡 Create |
