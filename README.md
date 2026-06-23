# ApparelHub ERP

A cloud-based clothing retail ERP prototype managing inventory variants, suppliers, and employee operations using React, ASP.NET Core, and Azure.

---

## 🚀 Tech Stack & Azure Architecture

The application is architected to run entirely on cloud infrastructure using **Microsoft Azure**:

| Component | Technology | Azure Cloud Service |
| :--- | :--- | :--- |
| **Frontend UI** | React, Vite, Tailwind CSS | **Azure Static Web Apps** (Free Tier) |
| **Backend API** | ASP.NET Core Web API (.NET 8) | **Azure App Service** (Linux Runtime) |
| **Database** | MySQL | **Azure Database for MySQL Flexible Server** |
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
