# LoadSaathi – Smart Logistics Marketplace
> **"Your Goods, Our Responsibility."**

LoadSaathi is a modern, responsive, full-stack logistics web marketplace designed for the Indian freight and road transport ecosystem. It seamlessly connects businesses needing cargo transported with fleet owners, transport agencies, and commercial drivers.

---

## 🚀 Key Highlights & Architectural Features

- **Full-Stack Architecture**: Built with React 18, TypeScript, Vite, Tailwind CSS, and powered by Supabase PostgreSQL with Row Level Security (RLS).
- **Role-Based Portals**:
  1. **Business Owner**: Post shipments, evaluate transporter bids, accept/reject quotations, track cargo milestones, and analyze logistics expenditure.
  2. **Transporter / Fleet Owner**: Browse open cargo demands across key corridors, submit bids with vehicle allocation, manage fleet vehicles, and track net earnings.
  3. **Driver (Mobile-First)**: Direct tap-to-call consignees, navigate via Leaflet OpenStreetMap, 1-tap milestone progression (`BOOKED` &rarr; `CONFIRMED` &rarr; `PICKED UP` &rarr; `IN TRANSIT` &rarr; `OUT FOR DELIVERY` &rarr; `DELIVERED`), and upload Proof of Delivery (POD).
  4. **Platform Admin**: Superadmin control room with platform revenue audit (10% commission), vehicle RTO fitness approvals, user KYC verification, dispute resolution, and cross-corridor analytics.
- **Interactive Geospatial Mapping**: Leaflet and OpenStreetMap integration showing pickup coordinates, drop locations, and real-time highway transit waypoint tracking.
- **Data Analytics**: Recharts visualizations for monthly freight spending, transporter payouts, and corridor shipment volumes.
- **Dual Backend Resilience**:
  - Automatically communicates with **live Supabase PostgreSQL & Auth** when credentials are configured in `.env`.
  - Also includes a reactive in-memory / local sandbox persistence engine with pre-seeded realistic Indian transport corridor records for instant 1-click evaluation without requiring immediate third-party setup.
  - Clearly labelled status badge and setup guide modal so users always know the exact backend state.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Icons & UI** | Lucide React, Custom SVG DivIcons |
| **Maps & GIS** | Leaflet, OpenStreetMap, React Leaflet |
| **Analytics** | Recharts (AreaCharts, BarCharts, PieCharts) |
| **State & Router** | React Router v6, Context API, Reactive Persistence Engine |
| **Database & Auth** | Supabase (PostgreSQL, Row Level Security, Auth, Realtime) |

---

## 🗄️ Database Design (Supabase PostgreSQL)

The database schema is defined in [`supabase/schema.sql`](file:///c:/Users/1611j/OneDrive/Desktop/business%20app/supabase/schema.sql) and contains 12 core relational tables with foreign keys, indexes, and Row Level Security (RLS) policies:

1. `profiles`: Extends `auth.users` with user roles (`business`, `transporter`, `driver`, `admin`), phone, active status.
2. `businesses`: Enterprise name, GSTIN, registered address, business type.
3. `transporters`: Company fleet name, fleet size, verification status, rating.
4. `drivers`: Transporter linkage, commercial driving license number, availability.
5. `vehicles`: Registration plate (RTO), vehicle type, payload capacity, approval status.
6. `shipments`: Origin/destination coordinates, cargo type, weight, package count, budget, status.
7. `quotations`: Freight bids submitted by transporters with estimated transit duration and vehicle allocation.
8. `bookings`: Confirmed contract linking shipment, transporter, driver, and vehicle.
9. `tracking_updates`: Real-time milestone events, GPS waypoint coordinates, timestamped logs, and POD proof links.
10. `payments`: Gross freight amount, 10% platform fee, escrow status, and transaction reference.
11. `reviews`: Shipper-transporter ratings (1–5 stars) and feedback comments.
12. `notifications`: In-app event dispatches and unread counter badges.

---

## 📦 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or later (Tested on Node v24)
- **NPM**: v9 or later

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Contents of `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_NAME=LoadSaathi
VITE_APP_TAGLINE=Your Goods, Our Responsibility
```

> **Note**: If left with placeholder credentials, LoadSaathi will automatically run in the **Interactive Sandbox Database Mode** so all buttons, forms, status updates, and bookings function end-to-end immediately.

### 4. Supabase Setup (Optional for Live DB)
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Navigate to the **SQL Editor** tab in your Supabase dashboard.
3. Paste and run the entire script from [`supabase/schema.sql`](file:///c:/Users/1611j/OneDrive/Desktop/business%20app/supabase/schema.sql).
4. Copy your **Project URL** and **Anon API Key** from **Project Settings &rarr; API** into your `.env` file.
5. Restart Vite dev server (`npm run dev`).

### 5. Running the Application
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🔑 Demo Accounts (1-Click Evaluation Sign-In)

For instant testing of all 4 roles, the login screen provides **1-Click Demo Evaluation Buttons**:

| Role | Demo Email | Full Name / Organization | Landing Page |
|---|---|---|---|
| **Business Owner** | `rajesh.sharma@delhitechexports.in` | Rajesh Sharma (Delhi Tech Exports) | `/dashboard/business` |
| **Transporter** | `vikram.singh@singhlogistics.com` | Vikramjit Singh (Singh Express Roadways) | `/dashboard/transporter` |
| **Driver** | `ramesh.yadav@singhlogistics.com` | Ramesh Yadav (Commercial Driver) | `/dashboard/driver` |
| **Platform Admin** | `admin@loadsaathi.com` | Amitabh Sen (Superadmin) | `/dashboard/admin` |

*(Password for any demo account: any 6+ characters e.g. `password123`)*

---

## 💼 Business Model & Monetisation

LoadSaathi operates on a sustainable multi-stream monetization strategy:
- **8–12% Transaction Fee**: Collected on completed shipments via secure platform escrow.
- **SaaS Subscriptions**:
  - *Starter*: Free (up to 5 bookings/mo)
  - *Business*: ₹999/month (up to 50 active dispatches, priority transporter broadcast, advanced corridor reporting)
  - *Enterprise*: Custom SLA (dedicated key account management, bulk CSV/ERP API import)
- **Promoted Fleet Listings**: Premium search placement for fleet operators on high-density freight corridors.

---

## 🛡️ License
Copyright &copy; 2026 LoadSaathi Technologies Pvt Ltd. All rights reserved.

