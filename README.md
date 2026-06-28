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

# 🔐 Authentication & Authorization System

A secure authentication and authorization system built with **ASP.NET Core**, featuring **JWT Authentication**, **Role-Based Access Control**, **Email OTP Verification**, and **Password Recovery**.

---

## ✨ Features

* ✅ User Registration with Email OTP Verification
* ✅ JWT Token Authentication
* ✅ Role-Based Access Control (5 Roles)
* ✅ Forgot Password using Email OTP
* ✅ Reset Password
* ✅ Email Notifications with Priority Headers

---

## 👥 Available Roles

| Role           | Description               | Dashboard URL              |
| -------------- | ------------------------- | -------------------------- |
| `StoreManager` | Store Manager Dashboard   | `/dashboard/store-manager` |
| `HR`           | Human Resources Dashboard | `/dashboard/hr`            |
| `ManagerBoard` | Manager Board Dashboard   | `/dashboard/manager-board` |
| `Supplier`     | Supplier Dashboard        | `/dashboard/supplier`      |
| `Customer`     | Customer Dashboard        | `/dashboard/customer`      |

---

# 📌 API Endpoints

| Method | Endpoint                     | Description                 |
| ------ | ---------------------------- | --------------------------- |
| `POST` | `/api/Auth/register`         | Register a new user         |
| `POST` | `/api/Auth/verify-otp`       | Verify email using OTP      |
| `POST` | `/api/Auth/login`            | Login and receive JWT token |
| `POST` | `/api/Auth/forgot-password`  | Request password reset OTP  |
| `POST` | `/api/Auth/verify-reset-otp` | Verify password reset OTP   |
| `POST` | `/api/Auth/reset-password`   | Reset password              |

---

# 📝 API Documentation

## 1️⃣ Register User

**Endpoint**

```http
POST /api/Auth/register
```

### Request Body

```json
{
  "username": "john_doe",
  "password": "SecurePass123",
  "role": "StoreManager",
  "email": "john.doe@gmail.com",
  "phone": "0712345678",
  "fullName": "John Doe"
}
```

### Success Response (200 OK)

```json
{
  "message": "Registration successful! Please verify your email to login."
}
```

### Error Response (400 Bad Request)

```json
{
  "message": "Username or Email already exists, or invalid role"
}
```

---

## 2️⃣ Verify Email OTP

**Endpoint**

```http
POST /api/Auth/verify-otp
```

### Request Body

```json
{
  "email": "john.doe@gmail.com",
  "otpCode": "123456"
}
```

### Success Response (200 OK)

```json
{
  "message": "Email verified successfully! You can now login."
}
```

### Error Response (400 Bad Request)

```json
{
  "message": "Invalid OTP code or OTP expired"
}
```

---

## 3️⃣ Login

**Endpoint**

```http
POST /api/Auth/login
```

### Request Body

```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

### Success Response (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "john_doe",
  "role": "StoreManager",
  "dashboardUrl": "/dashboard/store-manager"
}
```

### Error Response (401 Unauthorized)

```json
{
  "message": "Invalid username, password, or email not verified"
}
```

---

## 4️⃣ Forgot Password

**Endpoint**

```http
POST /api/Auth/forgot-password
```

### Request Body

```json
{
  "email": "john.doe@gmail.com"
}
```

### Success Response (200 OK)

```json
{
  "message": "Password reset OTP sent to your email. Please check your inbox."
}
```

### Error Response (400 Bad Request)

```json
{
  "message": "Email not found or OTP sending failed"
}
```

---

## 5️⃣ Verify Reset OTP

**Endpoint**

```http
POST /api/Auth/verify-reset-otp
```

### Request Body

```json
{
  "email": "john.doe@gmail.com",
  "otpCode": "654321"
}
```

### Success Response (200 OK)

```json
{
  "message": "OTP verified successfully. You can now reset your password."
}
```

### Error Response (400 Bad Request)

```json
{
  "message": "Invalid OTP code or OTP expired"
}
```

---

## 6️⃣ Reset Password

**Endpoint**

```http
POST /api/Auth/reset-password
```

### Request Body

```json
{
  "email": "john.doe@gmail.com",
  "newPassword": "NewSecurePass456"
}
```

### Success Response (200 OK)

```json
{
  "message": "Password reset successfully! You can now login with your new password."
}
```

### Error Response (400 Bad Request)

```json
{
  "message": "Email not found or password reset failed"
}
```

---

# 📧 Email Configuration

Add the following configuration to your **appsettings.json** file.

```json
"EmailSettings": {
  "SmtpServer": "smtp.gmail.com",
  "SmtpPort": 587,
  "SenderEmail": "your-email@gmail.com",
  "SenderPassword": "your-16-digit-app-password",
  "UseStartTls": true
}
```

## Gmail App Password Setup

1. Enable **2-Step Verification** on your Google Account.
2. Open **Google Account → App Passwords**.
3. Generate a new App Password for your application.
4. Copy the generated **16-character App Password**.
5. Paste it into `SenderPassword` in `appsettings.json`.

---

# 🔑 JWT Authentication

All protected API endpoints require a valid JWT token.

### Authorization Header

```http
Authorization: Bearer <your_jwt_token>
```

### JWT Claims

| Claim            | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `nameidentifier` | User ID                                                        |
| `name`           | Username                                                       |
| `role`           | User Role (StoreManager, HR, ManagerBoard, Supplier, Customer) |

---

# 🔒 Authentication Flow

```text
Register
    │
    ▼
Email OTP Verification
    │
    ▼
Login
    │
    ▼
Receive JWT Token
    │
    ▼
Access Protected APIs
    │
    ▼
Role-Based Dashboard
```

---

## 🚀 Tech Stack

* ASP.NET Core Web API
* Entity Framework Core
* Microsoft SQL Server
* JWT Authentication
* SMTP Email Service
* BCrypt Password Hashing






---

# Notes

* Ensure SQL Server (**SQLEXPRESS** or **LocalDB**) is running before starting the backend.
* No manual database or table creation is required.
* On the first run, the application automatically creates the database and applies all Entity Framework Core migrations.
* If you change the connection string, restart the backend application.
