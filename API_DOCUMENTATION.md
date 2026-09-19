# API Documentation & Endpoint Specifications

This document provides complete technical specifications for the **Financial Analytics Platform REST API**, including authentication protocols, query parameters, request/response bodies, status codes, and the RFC 4180 CSV export schema.

---

## Base URL & General Conventions

- **Base URL**: `http://localhost:5000/api`
- **Data Format**: `application/json` (except `/transactions/export` which returns `text/csv`)
- **Authentication**: JWT Bearer Token passed via HTTP Header:
  ```http
  Authorization: Bearer <your_jwt_token>
  ```
- **Standard Success Response Envelope**:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- **Standard Error Response Envelope**:
  ```json
  {
    "success": false,
    "message": "Human-readable error description"
  }
  ```

---

## Table of Endpoints

| Category | Method | Endpoint | Auth | Purpose |
| :--- | :--- | :--- | :---: | :--- |
| **System** | `GET` | `/health` | No | Server heartbeat & status check |
| **System** | `GET` | `/` | No | Root endpoint index discovery |
| **Auth** | `POST` | `/auth/login` | No | Authenticate user & issue JWT |
| **Auth** | `POST` | `/auth/register` | No | Register new user account |
| **Auth** | `GET` | `/auth/me` | Yes | Get authenticated user profile |
| **Transactions**| `GET` | `/transactions` | Yes | Paginated, filtered, sorted ledger |
| **Transactions**| `GET` | `/transactions/:id`| Yes | Get single transaction by ID |
| **Transactions**| `POST` | `/transactions/export`| Yes | Generate configurable RFC 4180 CSV |
| **Analytics** | `GET` | `/analytics` | Yes | Aggregated financial metrics & trends |
| **Analytics** | `GET` | `/analytics/summary` | Yes | Fast KPI totals (revenue, expenses, margin)|
| **Analytics** | `GET` | `/analytics/trends` | Yes | Monthly cash flow trajectories |

---

## 1. System Endpoints

### 1.1 Health Check
- **Endpoint**: `GET /api/health`
- **Authentication**: None
- **Response `200 OK`**:
  ```json
  {
    "status": "online",
    "timestamp": "2026-09-19T09:41:07.379Z",
    "service": "Financial Analytics Dashboard API",
    "version": "1.0.0"
  }
  ```

---

## 2. Authentication Endpoints

### 2.1 Login
- **Endpoint**: `POST /api/auth/login`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "admin@crackit.com",
    "password": "password123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Authentication successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "673cf8...",
      "name": "Senior Financial Analyst",
      "email": "admin@crackit.com",
      "role": "admin",
      "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing email or password.
  - `401 Unauthorized`: Invalid credentials.

### 2.2 Register
- **Endpoint**: `POST /api/auth/register`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@example.com",
    "password": "securePassword123"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "673cf9...",
      "name": "Alex Mercer",
      "email": "alex@example.com",
      "role": "analyst"
    }
  }
  ```

### 2.3 Get Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Authentication**: Bearer Token required
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "user": {
      "_id": "673cf8...",
      "name": "Senior Financial Analyst",
      "email": "admin@crackit.com",
      "role": "admin",
      "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    }
  }
  ```

---

## 3. Transaction Endpoints

### 3.1 Get Paginated & Filtered Transactions
- **Endpoint**: `GET /api/transactions`
- **Authentication**: Bearer Token required
- **Query Parameters**:

| Parameter | Type | Default | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `page` | `integer` | `1` | Page number | `page=2` |
| `limit` | `integer` | `10` | Records per page (max 100) | `limit=25` |
| `search` | `string` | — | Text search across ID, User, Category, Status | `search=user_001` |
| `category` | `string` | — | Filter by category (single or comma-separated) | `category=Revenue` |
| `status` | `string` | — | Filter by status (`Paid`, `Pending`, `Failed`) | `status=Paid` |
| `user_id` | `string` | — | Filter by User ID | `user_id=user_003` |
| `startDate` | `string` | — | ISO date lower bound | `startDate=2024-01-01` |
| `endDate` | `string` | — | ISO date upper bound | `endDate=2024-12-31` |
| `minAmount` | `number` | — | Minimum transaction amount | `minAmount=500` |
| `maxAmount` | `number` | — | Maximum transaction amount | `maxAmount=3000` |
| `sortBy` | `string` | `date` | Sort field (`id`, `date`, `amount`, `category`, `status`, `user_id`) | `sortBy=amount` |
| `sortOrder` | `string` | `desc` | Sort direction (`asc` or `desc`) | `sortOrder=asc` |

- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "6aae2fa30f3dc8a3c58089f2",
        "id": 24,
        "date": "2024-12-23T17:05:03.000Z",
        "amount": 2100,
        "category": "Expense",
        "status": "Paid",
        "user_id": "user_004",
        "user_profile": "https://thispersondoesnotexist.com/",
        "createdAt": "2026-09-19T06:45:55.169Z",
        "updatedAt": "2026-09-19T06:45:55.169Z"
      }
    ],
    "pagination": {
      "total": 300,
      "page": 1,
      "limit": 10,
      "totalPages": 30
    },
    "availableUsers": ["user_001", "user_002", "user_003", "user_004"],
    "summary": {
      "totalRevenue": 339803.25,
      "totalExpense": 206605,
      "netBalance": 133198.25,
      "paidCount": 186,
      "pendingCount": 114
    }
  }
  ```

### 3.2 Get Single Transaction
- **Endpoint**: `GET /api/transactions/:id`
- **Authentication**: Bearer Token required
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "date": "2024-01-15T09:20:00.000Z",
      "amount": 1450.50,
      "category": "Revenue",
      "status": "Paid",
      "user_id": "user_001",
      "user_profile": "https://thispersondoesnotexist.com/"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Invalid transaction ID format.
  - `404 Not Found`: Transaction with given ID does not exist.

---

## 4. Configurable CSV Export Endpoint

### 4.1 Export Transactions as CSV
- **Endpoint**: `POST /api/transactions/export`
- **Authentication**: Bearer Token required
- **Request Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer <token>
  ```
- **Request Body Parameters**:

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `columns` | `string[]` | Yes | List of column keys to include in output |
| `filters` | `object` | No | Matching filters (e.g. `category`, `status`, `startDate`, etc.) |
| `exportAll`| `boolean` | No | If `true`, ignores pagination and exports full matching dataset |
| `fileName` | `string` | No | Custom name for the generated file (without `.csv`) |

#### Available Export Columns:
- `id` -> `"Transaction ID"` (Integer)
- `date` -> `"Date"` (ISO 8601 Timestamp: `YYYY-MM-DDTHH:mm:ss.sssZ`)
- `amount` -> `"Amount ($)"` (Formatted 2-decimal floating point number: `1250.00`)
- `category` -> `"Category"` (String: `Revenue`, `Expense`)
- `status` -> `"Status"` (String: `Paid`, `Pending`, `Failed`)
- `user_id` -> `"User ID"` (String: `user_001` - `user_004`)
- `user_profile` -> `"User Profile URL"` (URL String)

- **Example Request Body**:
  ```json
  {
    "columns": ["id", "date", "amount", "category", "status", "user_id"],
    "filters": {
      "category": "Revenue",
      "status": "Paid"
    },
    "exportAll": true,
    "fileName": "q4_revenue_audit"
  }
  ```

- **Response Headers**:
  ```http
  HTTP/1.1 200 OK
  Content-Type: text/csv; charset=utf-8
  Content-Disposition: attachment; filename="q4_revenue_audit.csv"
  ```

- **Response Body (RFC 4180 Formatted CSV)**:
  ```csv
  "Transaction ID","Date","Amount ($)","Category","Status","User ID"
  247,"2024-11-29T08:36:15.000Z","2700.00","Revenue","Paid","user_003"
  112,"2024-11-25T14:12:00.000Z","3400.50","Revenue","Paid","user_001"
  94,"2024-11-20T11:05:45.000Z","1850.00","Revenue","Paid","user_002"
  ```

---

## 5. Analytics Endpoints

### 5.1 Comprehensive Financial Analytics
- **Endpoint**: `GET /api/analytics`
- **Authentication**: Bearer Token required
- **Query Parameters**: Accepts identical filter parameters as `/api/transactions` (`category`, `status`, `startDate`, `endDate`, `search`, etc.) to return dynamically scoped analytics.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "summary": {
        "totalRevenue": 339803.25,
        "totalExpense": 206605,
        "netBalance": 133198.25,
        "profitMarginPercent": 39.2,
        "totalTransactions": 300,
        "paidAmount": 341105.25,
        "pendingAmount": 205303,
        "paidCount": 186,
        "pendingCount": 114,
        "paidRatioPercent": 62
      },
      "monthlyTrends": [
        {
          "key": "2024-01",
          "label": "Jan 2024",
          "revenue": 28450.00,
          "expense": 17200.00,
          "net": 11250.00,
          "paidCount": 16,
          "pendingCount": 9,
          "totalTransactions": 25
        }
      ],
      "categoryBreakdown": [
        {
          "category": "Revenue",
          "amount": 339803.25,
          "count": 150,
          "avgAmount": 2265.36
        },
        {
          "category": "Expense",
          "amount": 206605.00,
          "count": 150,
          "avgAmount": 1377.37
        }
      ],
      "userDistribution": [
        { "id": "user_001", "count": 77 },
        { "id": "user_002", "count": 77 },
        { "id": "user_003", "count": 74 },
        { "id": "user_004", "count": 72 }
      ]
    }
  }
  ```

---

## 6. Proper CSV Formatting Standard (RFC 4180)

All CSV files exported by the system adhere strictly to the **RFC 4180 specification**:

1. **Header Line**: The first line consists of human-readable column labels corresponding exactly to the selected fields in order.
2. **Quotation Rules**:
   - Every string, date, or label containing commas, spaces, or special characters is safely wrapped in double quotes (`"`).
   - Any embedded quotes inside values are escaped by doubling them (`""`).
3. **Record Separation**: Each record is terminated by a CRLF/newline (`\r\n` or `\n`).
4. **Data Formatting Consistency**:
   - **Amounts**: Always serialized to 2 fixed decimal places (`1250.00`).
   - **Dates**: Standardized ISO 8601 UTC representation (`YYYY-MM-DDTHH:mm:ss.sssZ`).
   - **Identifiers**: Numeric IDs are clean integers without trailing decimals.
