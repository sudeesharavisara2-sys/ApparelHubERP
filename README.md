# ApparelHub ERP

A cloud-based clothing retail ERP prototype managing inventory variants, suppliers, and employee operations using React, ASP.NET Core, and Azure.

---

## 🚀 Tech Stack & Azure Architecture

The application is architected to run entirely on cloud infrastructure using **Microsoft Azure**:

| Component | Technology | Azure Cloud Service |
| :--- | :--- | :--- |
| **Frontend UI** | React, Vite, Tailwind CSS | **Azure Static Web Apps** (Free Tier) |
| **Backend API** | ASP.NET Core Web API (**.NET 10**) | Azure App Service |
| **Database** | Microsoft SQL Server | Azure SQL Database |
| **Security** | JSON Web Tokens (JWT) | Role-Based Access Control (RBAC) |

---

## 📦 Core Features

* **Secure JWT Authentication:** Secure login functionality generating cryptographically signed tokens.
* **Role-Based Access Control:** Separate system viewpoints and strict permission barriers for **Admin** and **Employee** screens.
* **Inventory & Variant Management:** Deep tracking of clothing items broken down by unique Size, Color, SKU, and Stock levels.
* **Supplier Management:** Centralized hub to manage fashion vendors, product supply feeds, and communication details.
* **Employee & Shift Management:** Comprehensive tracking of labor shifts, active clock-ins, and cashier assignments.
* **Dashboard & Reporting:** Analytics view containing total sales metrics, low stock alerts, and ongoing operations tailored per role.

---

## 📁 Project Structure

The project strictly follows a clean, decoupled architecture separating the client app and the layered enterprise backend:

```text
ApparelHubERP/
├── backend/
│   ├── ApparelHubERP.API/              # API controllers, CORS setup, routing, and app entry point.
│   │   └── Controllers/
│   │
│   ├── ApparelHubERP.Core/             # Pure business logic, core DTOs, domain entities, and service interfaces.
│   │   ├── DTOs/
│   │   │   ├── Auth/
│   │   │   ├── Inventory/
│   │   │   └── POS/
│   │   ├── Entities/
│   │   ├── Interfaces/
│   │   │   ├── Repositories/
│   │   │   └── Services/
│   │   └── Services/
│   │
│   └── ApparelHubERP.Infrastructure/   # Database access, repository patterns, and Entity Framework migrations.
│       ├── Data/
│       │   └── Migrations/
│       └── Repositories/
│
└── frontend/                           # React Single Page Application (SPA)
    └── src/
        ├── assets/                     # Static assets, logos, and images.
        ├── components/                 # Reusable UI layout elements (Sidebar, Navbar, ProtectedRoute).
        ├── context/                    # Global state engines (AuthContext, CartContext).
        ├── pages/                      # Feature-based system views.
        │   ├── Dashboard/
        │   ├── Employees/
        │   ├── Inventory/
        │   ├── Login/
        │   ├── POS/
        │   └── Suppliers/
        └── services/                   # Dedicated API communication layer (Axios clients).

--- 
```
# 🛠️ Local Setup Instructions

## Prerequisites

Before running the project locally, make sure the following software is installed:

* **.NET 10 SDK** (Latest)
* **Node.js** (v18 or higher)
* **Microsoft SQL Server** (SQLEXPRESS or LocalDB)

---

# 1. Database Configuration

> **No manual database creation is required.**

The application is configured to automatically create the database and apply all migrations during the first run.

Open the following file:

```text
backend/ApparelHubERP.API/appsettings.json
```

Verify or update the connection string if necessary.

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.\\SQLEXPRESS;Database=apparelhub_db;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

---

# 2. Running the Backend API

## Option A — Visual Studio (Recommended)

1. Open **ApparelHubERP.slnx** in Visual Studio.
2. Right-click **ApparelHubERP.API**.
3. Select **Set as Startup Project**.
4. Press **Ctrl + F5** (or click **Start**).

The application will:

* Create the database automatically
* Apply EF Core migrations
* Seed initial data (if available)
* Launch Swagger UI in your default browser

---

## Option B — Command Line (CLI)

From the project root directory, run:

```bash
dotnet run --project backend/ApparelHubERP.API/ApparelHubERP.API.csproj
```

If everything is configured correctly, the application will automatically:

* Create the database
* Apply migrations
* Start the API server

Swagger UI will be available at:

```text
https://localhost:<port>/
```

---

# 3. Running the Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The React application will be available at:

```text
http://localhost:5173
```

*(Port may vary depending on your local configuration.)*

---

# Project Structure

```text
ApparelHubERP
│
├── backend
│   └── ApparelHubERP.API
│
├── frontend
│
└── README.md
```

---

# Notes

* Ensure SQL Server (**SQLEXPRESS** or **LocalDB**) is running before starting the backend.
* No manual database or table creation is required.
* On the first run, the application automatically creates the database and applies all Entity Framework Core migrations.
* If you change the connection string, restart the backend application.
