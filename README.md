# NexaERP System — Frontend UI

A modern Enterprise Resource Planning (ERP) frontend built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**, integrated with a **Spring Boot REST API**.

## 📖 Table of Contents
- Key Features
- Tech Stack
- Folder Structure
- Prerequisites
- Installation
- Environment Configuration
- Application Modules
- Backend Connection
- Available Scripts

## 🚀 Key Features
- JWT Authentication
- Role-Based Access Control (RBAC)
- Dashboard with KPIs & Activity Feed
- Finance, HR, Inventory, Sales, Purchasing, Manufacturing, CRM, Projects & Assets Modules
- Responsive UI
- Reusable Components
- REST API Integration

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| HTTP Client | Axios |
| Forms | React Hook Form |
| Charts | Recharts |
| Icons | Lucide React |
| UI Components | Radix UI |
| Package Manager | pnpm |

## 📂 Project Structure

```text
erp-system-ui/
├── public/                           # Static assets (favicon, images, etc.)
├── src/
│   ├── main.tsx                      # Application entry point
│   ├── app/
│   │   ├── App.tsx                   # Root component and router setup
│   │   ├── routes.ts                 # Application route definitions
│   │   ├── components/
│   │   │   ├── Layout.tsx            # Main application layout
│   │   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   │   └── ui/                   # Reusable UI components
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx         # Dashboard page
│   │   │   ├── Login.tsx             # Login page
│   │   │   ├── finance/              # Finance Management Module
│   │   │   ├── hr/                   # Human Resource & Payroll Module
│   │   │   ├── inventory/            # Inventory & Warehouse Module
│   │   │   ├── sales/                # Sales & CRM Module
│   │   │   ├── purchasing/           # Purchasing Module
│   │   │   ├── manufacturing/        # Production Module
│   │   │   ├── projects/             # Project Management Module
│   │   │   ├── assets/               # Asset Management Module
│   │   │   └── system/               # User Management & System Settings
│   │   └── types/
│   │       └── erp.ts                # Global TypeScript type definitions
│   ├── context/
│   │   └── AuthContext.tsx           # Authentication context provider
│   ├── services/
│   │   ├── api.ts                    # Axios configuration & interceptors
│   │   ├── authService.ts            # Authentication API
│   │   ├── dashboardService.ts       # Dashboard API
│   │   ├── salesOrderService.ts      # Sales Order API
│   │   └── ...                       # Additional module services
│   ├── data/
│   │   └── mockData.ts               # Mock data for development/testing
│   └── styles/
│       ├── index.css                 # Global styles
│       ├── tailwind.css              # Tailwind CSS imports
│       └── theme.css                 # Theme customization
├── .env.local                        # Local environment variables (not committed)
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```


## Prerequisites
Ensure you have installed:
- **Node.js** v18 or newer
- **pnpm** v8 or newer — `npm install -g pnpm`
- Backend Spring Boot running at `http://localhost:8081`

## Installation & Running
```bash
# 1. Clone the repository
git clone <repository-url>
cd erp-system-ui

# 2. Install dependencies
pnpm install

# 3. Create environment file
# Create .env.local and fill with your local configuration (see Environment Configuration section)

# 4. Run development server
pnpm dev
```
## ⚙️ Environment Configuration

Create a `.env.local` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

> **Note:** All Vite environment variables must start with `VITE_`.


## 📦 Application Modules

| Module | Path | Description |
|--------|------|-------------|
| Dashboard | `/` | KPIs, activity feed, quick navigation |
| Finance | `/finance` | Accounts, Journal, AP/AR, Budget |
| Human Resources | `/hr` | Employees, Leave, Payroll, Recruitment |
| Inventory | `/inventory` | Products, Warehouses, Stock Management |
| Sales | `/sales` | Customers, Orders, Invoices |
| Purchasing | `/purchasing` | Vendors, Purchase Orders, Invoices |
| Manufacturing | `/manufacturing` | BOM, Production, Work Orders |
| Projects | `/projects` | Projects, Tasks, Time Tracking |
| CRM | `/crm` | Leads, Opportunities, Campaigns |
| Assets | `/assets` | Assets, Maintenance, Depreciation |
| System | `/system` | Users, Roles, Settings, Audit Logs |

## 🔗 Backend Connection

The frontend communicates with the Spring Boot backend using **Axios** (`src/services/api.ts`).

- Uses `VITE_API_BASE_URL` as the API base URL.
- Automatically attaches the JWT token to requests.
- Redirects users to the login page on `401 Unauthorized` responses.

**Backend:** Spring Boot (Port `8081`)
```
# ERP System — Backend API

A RESTful backend for the Enterprise Resource Planning (ERP) system built with **Spring Boot**, **PostgreSQL**, **JWT Authentication**, and **Flyway** for database migrations.

## 📖 Table of Contents
- Tech Stack
- Prerequisites
- Database Configuration
- Application Configuration
- Running the Application
- API Documentation
- Package Structure
- API Modules
- JWT Authentication

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Spring Boot 4 |
| Language | Java 17 |
| Database | PostgreSQL |
| ORM | Spring Data JPA & Hibernate |
| Security | Spring Security & JWT |
| Database Migration | Flyway |
| API Documentation | Swagger (SpringDoc OpenAPI) |
| Validation | Jakarta Bean Validation |
| Boilerplate | Lombok |
| Build Tool | Maven |

## 🗄️ Database Configuration

Configure your PostgreSQL database in `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ABC
spring.datasource.username=postgres
spring.datasource.password=YOUR_DATABASE_PASSWORD
```
## ⚙️ Application Configuration

> **Note:** Do not commit real credentials. Use `application-example.properties` as the template.

Copy the template file:

```bash
copy src\main\resources\application-example.properties src\main\resources\application.properties
```
Update `application.properties` with your local configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ABC
spring.datasource.username=postgres
spring.datasource.password=YOUR_DATABASE_PASSWORD

app.jwt.secret=YOUR_JWT_SECRET
app.jwt.expiration-ms=86400000

app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
server.port=8081
```
## ▶️ Running the Application

### Using Maven Wrapper (Recommended)

**Windows**
```bash
.\mvnw.cmd clean install -DskipTests
.\mvnw.cmd spring-boot:run
```

**macOS / Linux**
```bash
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```

### Using Maven

```bash
mvn clean install -DskipTests
mvn spring-boot:run
```

The application will be available at:

```text
http://localhost:8081
```

## 📚 API Documentation

| URL | Description |
|-----|-------------|
| `http://localhost:8081/api/v1` | REST API Base URL |
| `http://localhost:8081/swagger-ui/index.html` | Swagger UI |
| `http://localhost:8081/v3/api-docs` | OpenAPI Specification |

## 📂 Project Structure

```text
src/main/java/com/ERP/
├── FullErpSystemProjectApplication.java   # Application entry point
├── config/                                # Security & application configuration
├── controller/                            # REST controllers
├── dto/                                   # Request & response DTOs
├── entity/                                # JPA entities
├── exception/                             # Global exception handling
├── repository/                            # JPA repositories
├── security/                              # JWT & authentication
└── service/                               # Business logic

src/main/resources/
├── application.properties                 # Application configuration
└── db/migration/                          # Flyway migration scripts
    ├── V1__create_foundation.sql
    ├── V2__create_hr_foundation.sql
    ├── V3__create_hr_operational.sql
    ├── V4__create_finance.sql
    ├── V5__create_inventory.sql
    ├── V6__create_sales_crm.sql
    ├── V7__create_purchasing.sql
    ├── V8__create_manufacturing.sql
    ├── V9__create_projects_assets.sql
    └── V10__seed_data.sql
```
## 🔌 API Modules

All endpoints use the `/api/v1` prefix and require:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

| Module | Base Path |
|--------|-----------|
| Auth | `/api/v1/auth` |
| Dashboard | `/api/v1/dashboard` |
| Finance | `/api/v1/finance` |
| Human Resources | `/api/v1/hr` |
| Inventory | `/api/v1/inventory` |
| Sales | `/api/v1/sales` |
| Purchasing | `/api/v1/purchasing` |
| Manufacturing | `/api/v1/manufacturing` |
| Projects | `/api/v1/projects` |
| CRM | `/api/v1/crm` |
| Assets | `/api/v1/assets` |
| System | `/api/v1/system` |

## 🔐 JWT Authentication

Authenticate using the login endpoint:

```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

Include the returned JWT in all protected requests:

```http
Authorization: Bearer <your-jwt-token>
```

> **Note:** JWT tokens expire after **24 hours (86400000 ms)**.

## ✅ Verification

After starting the application, verify that it is running successfully:

- Server starts without errors.
- Application is available at **http://localhost:8081**.
- Swagger UI is accessible at **http://localhost:8081/swagger-ui/index.html**.

> **Default Server Port:** `8081`
