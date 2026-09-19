# Financial Analytics Platform

An enterprise-grade full-stack financial intelligence application featuring interactive data visualizations, multi-criteria transaction filtering, instant search, column sorting, pagination, JWT authentication, and a state-of-the-art **CSV Export Studio** with dynamic schema presets and live spreadsheet preview.

---

## Quick Reference Commands

| Action | Command | Details |
| :--- | :--- | :--- |
| **Backend API** | `cd backend && npm run dev` | Runs Express API on **http://localhost:5000** |
| **Frontend UI** | `cd frontend && npm start` | Runs Vite React app on **http://localhost:3000** |
| **Full Stack (Concurrent)** | `npm run dev` | Starts both backend and frontend concurrently from project root |
| **Seed Database** | `npm run seed` | Seeds 300 transactions and demo accounts into MongoDB |
| **Verify Builds** | `npm run build` | Compiles backend (`tsc`) & frontend (`vite build`) with 0 errors |
| **API Smoke Test** | `cd backend && node test_api.js` | Runs automated smoke tests across all endpoints |

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Recharts, Lucide Icons, Custom CSS Design System (Theme-aware Light/Dark modes)
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`), `json2csv`
- **Data Standard**: RFC 4180 CSV export compliance

---

## Project Architecture

```text
Loopr AI - Technical Assignment/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB database connection (db.ts)
│   │   ├── controllers/     # Auth, Transaction, and Analytics controllers
│   │   ├── data/            # 300 source transactions (transactions.json)
│   │   ├── middleware/      # JWT authentication guard & global error handler
│   │   ├── models/          # Mongoose models (Transaction, User) with compound indexing
│   │   ├── routes/          # Express API route definitions
│   │   ├── scripts/         # Standalone database seed script (seed.ts)
│   │   └── server.ts        # Express entry point & middleware configuration
│   ├── .env                 # Environment variables
│   ├── .env.example         # Template environment configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── test_api.js          # Automated endpoint smoke test suite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppLayout/           # Sidebar with Loopr logo & TopBar header
│   │   │   ├── MetricCards/         # 6 Financial KPI summary cards
│   │   │   ├── ChartsSection/       # Revenue vs Expense Trend, Donut & Bar charts
│   │   │   ├── FilterBar/           # Multi-criteria filtering controls
│   │   │   ├── TransactionTable/    # Paginated ledger, column sorter, status badges
│   │   │   ├── ExportModal/         # Advanced CSV Export Studio with live preview
│   │   │   ├── ProtectedRoute/      # Route guard for authenticated views
│   │   │   └── PublicRoute/         # Redirects authenticated users from /login
│   │   ├── context/                 # AuthContext (JWT handling) & AlertContext
│   │   ├── pages/
│   │   │   ├── LoginPage/           # Authentication portal with 1-click demo fill
│   │   │   ├── DashboardPage/       # Interactive charts & executive summary
│   │   │   ├── TransactionsPage/    # Ledger view with search, filters & export
│   │   │   ├── ReportsPage/         # Dedicated reporting studio
│   │   │   ├── SettingsPage/        # Analyst profile & system diagnostics
│   │   │   └── NotFoundPage/        # Branded 404 handler
│   │   ├── services/                # Axios API client & endpoints integration
│   │   ├── styles/                  # Royal Navy dark mode & light theme design tokens
│   │   ├── types/                   # Shared TypeScript interfaces
│   │   ├── App.tsx                  # React Router setup
│   │   └── main.tsx                 # React entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts               # Bundler config with reverse-proxy
├── API_DOCUMENTATION.md             # Complete endpoint specifications
├── transactions.json                # Source dataset (300 transactions)
├── package.json                     # Root monorepo orchestration
└── README.md                        # Documentation & setup guide
```

---

## Setup & Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Community Server running locally at `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

### Step 1: Install Dependencies
Run the install command from the root directory to install all dependencies across monorepo packages:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 2: Configure Environment Variables
Backend environment configuration is located in `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/financial_analytics_db
JWT_SECRET=super_secret_financial_dashboard_jwt_key_2024
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```
*(Frontend uses automatic Vite proxying to `http://localhost:5000` via `vite.config.ts`)*

### Step 3: Seed MongoDB Database
Populate the database with the full 300-record dataset and pre-configured analyst accounts:
```bash
npm run seed
```
*(The server also auto-seeds automatically upon startup if connected to an empty database).*

### Step 4: Run the Application

**Option A — Concurrent Dev Server (Recommended)**:
```bash
npm run dev
```
Starts both backend (`http://localhost:5000`) and frontend (`http://localhost:3000`) simultaneously.

**Option B — Independent Terminals**:
- **Backend Terminal**:
  ```bash
  cd backend
  npm run dev
  ```
- **Frontend Terminal**:
  ```bash
  cd frontend
  npm start
  ```

---

## Demo Credentials

You can sign in using pre-seeded accounts or click the **1-Click Demo Fill** buttons on the login page:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@crackit.com` | `password123` | Full dashboard, ledger, export & settings access |
| **Analyst** | `analyst@crackit.com` | `password123` | Operational dashboard and export access |

---

## Application Usage Guide

### 1. Login & JWT Handling
- Navigate to `http://localhost:3000/login`.
- Click **"Admin Demo"** or **"Analyst Demo"** to prefill credentials, then click **Sign In**.
- The JWT token is securely saved in `localStorage`.
- All requests automatically pass `Authorization: Bearer <token>` through Axios interceptors.
- Session expiry (HTTP 401) immediately triggers a clean logout with a floating notification.

### 2. Executive Dashboard
- **Summary Metrics**: Real-time KPI cards displaying Total Revenue, Total Expenses, Net Cash Flow, Completed Transactions, Profit Margin %, and Average Transaction Value.
- **Revenue vs Expenses Trend**: Monthly multi-area trajectory chart (`AreaChart`) tracking cash inflows and outflows across all 12 months with interactive tooltips and time range selector (`7D`, `30D`, `90D`, `1Y`).
- **Category Breakdown**: Proportional donut chart (`PieChart`) displaying revenue versus expense distribution.
- **Team Activity Breakdown**: Per-user comparison (`BarChart`) highlighting transactions generated by each team member (`user_001` through `user_004`).

### 3. Advanced Filtering & Search
- Go to the **Transactions** ledger tab.
- **Instant Search**: Type in any keyword to filter across descriptions, user IDs, categories, and amounts with instant debounced updates.
- **Filter Bar**:
  - Filter by **Category** (`Revenue` / `Expense`).
  - Filter by **Status** (`Paid` / `Pending`).
  - Filter by **User ID** (`user_001` to `user_004`).
  - Filter by **Date Range** (Start Date and End Date pickers).
  - Filter by **Amount Bounds** (Min $ and Max $).
- **Sortable Columns**: Click table column headers (`Date`, `Amount`, `Category`, `Status`, `User`) to toggle ascending/descending sorting.
- **Pagination**: Jump across pages or adjust page size between 10, 25, 50, or 100 rows.

### 4. Advanced CSV Export Studio
- Click the **"Export CSV"** button located on the Transactions or Reports pages.
- **1-Click Schema Presets**:
  - ⚡ **Full Audit Ledger**: Selects all 7 available columns.
  - 📊 **Executive Brief**: Curated high-level fields (`date`, `amount`, `category`, `status`, `description`).
  - 👥 **Team & Accounts**: Focuses on user audit trails (`id`, `date`, `amount`, `user_id`).
- **Fields & Scope Tab**:
  - Choose between exporting **Filtered Results** (`N` records) or the **Full Database** (`300` records).
  - Select individual columns with schema type tags (`Integer`, `Timestamp`, `Decimal`, `Enum`, `Status`, `String`).
  - Set custom file name with a 1-click `+ Add Today's Date` button.
- **Live CSV Preview Tab**:
  - **Spreadsheet Grid View**: Real-time table showing live sample rows formatted with currently chosen columns.
  - **Raw Terminal View**: Dark-themed monospace code block displaying the exact comma-separated text representation.
  - **Dynamic Size Indicator**: Computes estimated file size (e.g., `~18.2 KB`).
- Click **"Export CSV"**: Directly downloads the RFC 4180 file to the browser.

---

## Proper CSV Formatting with Headers

All CSV exports generated by the application strictly follow the **RFC 4180 Standard**:

### 1. Header Row
The first line of the CSV always contains human-readable, descriptive column titles corresponding to the selected columns in sequential order:

```csv
"Transaction ID","Date","Amount ($)","Category","Status","User ID"
```

### 2. Data Types & Formatting Rules

| Field Key | Output Header | Format / Type | Example Value |
| :--- | :--- | :--- | :--- |
| `id` | `"Transaction ID"` | Integer | `89` |
| `date` | `"Date"` | ISO 8601 UTC string | `"2024-12-02T08:52:11.000Z"` |
| `amount` | `"Amount ($)"` | Fixed 2-decimal string | `"1100.00"` |
| `category` | `"Category"` | Quoted string | `"Revenue"` |
| `status` | `"Status"` | Quoted string | `"Pending"` |
| `user_id` | `"User ID"` | Quoted string | `"user_004"` |
| `user_profile`| `"User Profile URL"` | Quoted URL string | `"https://thispersondoesnotexist.com/"` |

### 3. Quoting and Escaping
- Every field containing commas, quotes, or whitespace is enclosed in standard double quotes (`"`).
- Any double quotes appearing inside values are escaped by doubling them (`""`).
- Rows terminate with standard newline delimiters (`\n`).

### 4. Sample Generated CSV Output

```csv
"Transaction ID","Date","Amount ($)","Category","Status","User ID"
89,"2024-12-02T08:52:11.000Z","1100.00","Revenue","Pending","user_004"
77,"2024-12-01T10:45:12.000Z","1500.00","Revenue","Pending","user_004"
247,"2024-11-29T08:36:15.000Z","2700.00","Revenue","Paid","user_003"
112,"2024-11-25T14:12:00.000Z","3400.50","Revenue","Paid","user_001"
94,"2024-11-20T11:05:45.000Z","1850.00","Revenue","Paid","user_002"
```

---

## API Documentation Summary

For complete endpoint specifications including request/response examples and status codes, see [API_DOCUMENTATION.md](file:///c:/Users/shruti%20shitole/Downloads/Loopr%20AI%20-%20Technical%20Assignment/API_DOCUMENTATION.md).

### Endpoint Overview

| Method | Endpoint | Auth | Purpose |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/health` | No | API heartbeat check |
| `POST` | `/api/auth/login` | No | Authenticate user & issue JWT |
| `POST` | `/api/auth/register` | No | Register new user account |
| `GET` | `/api/auth/me` | Yes | Get authenticated analyst profile |
| `GET` | `/api/transactions` | Yes | Paginated, filtered, and sorted ledger |
| `GET` | `/api/transactions/:id` | Yes | Get transaction by numeric ID |
| `POST` | `/api/transactions/export` | Yes | Download configurable CSV file |
| `GET` | `/api/analytics` | Yes | Comprehensive KPI aggregations & chart data |
| `GET` | `/api/analytics/summary` | Yes | High-speed KPI totals |
| `GET` | `/api/analytics/trends` | Yes | Monthly trajectory data |

---

## Verification & Build Validation

Confirm that both services build cleanly with 0 TypeScript and bundling errors:
```bash
npm run build
```

Run automated endpoint smoke testing:
```bash
cd backend && node test_api.js
```
Expected output:
```text
1. Testing /api/health...
Health: { status: 'online', service: 'Financial Analytics Dashboard API', version: '1.0.0' }

2. Testing /api/auth/login...
Login Status: 200 User: admin@crackit.com

3. Testing /api/transactions (page=1, limit=5)...
Transactions Total in DB: 300
Returned transactions count: 5

4. Testing /api/analytics...
Analytics Summary: { totalRevenue: 339803.25, totalExpense: 206605, netBalance: 133198.25, profitMarginPercent: 39.2 }

5. Testing /api/transactions/export (CSV)...
Export Status: 200 Content-Type: text/csv; charset=utf-8

✅ ALL BACKEND APIS TESTED SUCCESSFULLY!
```
