# 📋 Task Management System

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.3-6DB33F?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?style=for-the-badge&logo=microsoftsqlserver)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)

A production-ready full-stack Task Management System designed to support collaborative task management with secure authentication, role-based authorization, real-time notifications, and comprehensive reporting.

---

## ✨ Features

- **Authentication & Security:** JWT Authentication, Role-Based Access Control (Admin, Manager, Employee), Password Reset/Change via Email, and secure Spring Security headers.
- **User Management:** Complete user CRUD, Role/Position management, and customizable User Profiles.
- **Project Management:** Project creation and status tracking, team member assignments, advanced search, and pagination.
- **Task Management:** Granular task tracking (priority, status), file attachments, comments, and extensive filtering.
- **Real-Time Notifications:** WebSocket (STOMP) integration for instant alerts.
- **Activity & Auditing:** Comprehensive audit logs tracking user activity across the system.
- **Reports & Analytics:** Interactive Dashboard statistics, dynamic charts (Recharts), and PDF/Excel data export.
- **Modern UI/UX:** Fully responsive design built with Tailwind CSS, supporting Dark & Light modes.
- **Developer Experience:** Swagger API documentation built-in.

---

## 🛠️ Tech Stack

### Backend
- **Core:** Java 21, Spring Boot 3
- **Security:** Spring Security, JWT, Bucket4j (Rate Limiting)
- **Data:** Spring Data JPA, QueryDSL, Liquibase, Microsoft SQL Server
- **Messaging:** Spring WebSocket (STOMP), Spring Mail

### Frontend
- **Core:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Networking & Routing:** Axios, React Router
- **Visualization:** Recharts

### Infrastructure
- **Containerization:** Docker, Docker Compose
- **Orchestration:** Kubernetes
- **Proxy:** Nginx

---

## 📂 Project Structure

`	ext
taskmanagement/
├── src/                # Spring Boot Backend Source Code
├── taskmanagement-ui/  # React Frontend Source Code
├── k8s/                # Kubernetes Deployment Manifests
├── database/           # Database Initialization Scripts
├── docker-compose.yml  # Docker Compose Configuration
├── Dockerfile          # Backend Docker Build Configuration
└── pom.xml             # Maven Project Configuration
`

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Java 21**
- **Node.js 22+**
- **Docker Desktop** (with Kubernetes enabled if deploying via K8s)

---

### 🐳 Running with Docker Compose (Recommended)

1. **Clone the repository:**
   `ash
   git clone <repository-url>
   cd taskmanagement
   `

2. **Start all services:**
   `ash
   docker compose up -d --build
   `

3. **Access the application:**

   | Service | URL |
   |---------|-----|
   | **Frontend** | http://localhost:5173 |
   | **Backend API** | http://localhost:8080 |
   | **Swagger UI** | http://localhost:8080/swagger-ui/index.html |
   | **Health Check** | http://localhost:8080/actuator/health |

4. **Stop all services:**
   `ash
   docker compose down
   `

---

### 💻 Running Locally

#### 1. Backend (Spring Boot)

Run the backend using the Maven Wrapper (works on Windows/Mac/Linux without requiring Maven installation):

`ash
# Windows
.\mvnw.cmd clean package -DskipTests
.\mvnw.cmd spring-boot:run

# Linux/macOS
./mvnw clean package -DskipTests
./mvnw spring-boot:run
`
The backend API will be available at: http://localhost:8080

#### 2. Frontend (React)

`ash
cd taskmanagement-ui
npm install
npm run dev
`
The frontend application will be available at: http://localhost:5173

---

### ☸️ Running with Kubernetes

Deploy the application using the provided Kubernetes manifests:

`ash
# Apply configurations
kubectl apply -f k8s/

# Verify Pods are running
kubectl get pods -n taskmanagement

# Check Services
kubectl get svc -n taskmanagement
`
The frontend is exposed via a NodePort and will be accessible at: http://localhost:30080

---

## 🔐 Default Account

| Username | Password | Role |
|----------|----------|------|
| **admin** | Admin@123 | ADMIN |

> **Note:** This default administrator account is automatically seeded by Liquibase during the first application startup.

---

## 📚 API Documentation

Once the backend is running, you can explore and test the RESTful API using the integrated Swagger UI:

👉 **[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)**

---

## 🗄️ Database

- **Engine:** Microsoft SQL Server
- **Migration Tool:** Liquibase

Liquibase automatically tracks, manages, and applies database schema changes during application startup. No manual SQL scripts are required to get the application up and running.

---


## 👨‍💻 Author

**Phong Ho**  
*Information Technology Student*  
*Dong A University*

---

## 🔑 Environment Variables

This project requires several environment variables to function. **No credentials are hardcoded.**

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SA_PASSWORD` | SQL Server SA password (must meet complexity rules) | `MyStr0ng!Pass` |
| `JWT_SECRET` | JWT signing secret (min 32 chars, random) | `$(openssl rand -hex 32)` |
| `SPRING_MAIL_USERNAME` | Gmail address used to send emails | `you@gmail.com` |
| `SPRING_MAIL_PASSWORD` | Google App Password (16 chars, not your login password) | `abcd efgh ijkl mnop` |

### Optional Variables (have defaults)

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_MAIL_HOST` | `smtp.gmail.com` | SMTP server host |
| `SPRING_MAIL_PORT` | `587` | SMTP server port |
| `APP_RESET_URL` | `http://localhost:5173` | Base URL for password-reset email links |

---

### 📧 How to Generate a Google App Password

> **Requirement:** 2-Step Verification must be enabled on your Google Account.

1. Go to **[https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)**
2. Select **"Mail"** as the app and **"Other"** as the device (name it anything, e.g. `TaskManagement`)
3. Click **Generate** — you'll receive a **16-character password** (spaces can be omitted)
4. Copy the password immediately — Google will not show it again
5. Use this as your `SPRING_MAIL_PASSWORD` value

---

### 🐳 Configuring Docker Compose

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in every `CHANGE_ME_*` value:
   ```dotenv
   SA_PASSWORD=MyStr0ng!SqlPass
   JWT_SECRET=your-32-plus-char-random-secret-here
   SPRING_MAIL_USERNAME=you@gmail.com
   SPRING_MAIL_PASSWORD=yourgoogleapppassword
   APP_RESET_URL=http://localhost:5173
   ```

3. Start the application:
   ```bash
   docker compose up -d --build
   ```

> ⚠️ **Never commit `.env` to Git.** It is already listed in `.gitignore`.

---

### ☸️ Configuring Kubernetes

All secrets are stored in the `taskapp-secret` Kubernetes Secret. **Edit `k8s/secret.yaml` locally** (or use `kubectl` directly) and replace every `CHANGE_ME_*` placeholder before applying:

```bash
# Option A — edit the manifest and apply (for development/testing only)
# Replace CHANGE_ME values in k8s/secret.yaml first, then:
kubectl apply -f k8s/secret.yaml

# Option B — create the secret imperatively (recommended for production)
kubectl create secret generic taskapp-secret \
  --namespace=taskmanagement \
  --from-literal=db-password='MyStr0ng!SqlPass' \
  --from-literal=jwt-secret='your-32-plus-char-random-secret' \
  --from-literal=mail-username='you@gmail.com' \
  --from-literal=mail-password='yourgoogleapppassword'

# Apply the rest of the manifests
kubectl apply -f k8s/
```

> ⚠️ **Never commit `k8s/secret.yaml` with real values to Git.**  
> Use Kubernetes Sealed Secrets, HashiCorp Vault, or your cloud provider's secret manager in production.

---

### 💻 Configuring Local Development

Set the required variables in your shell before running the application:

```bash
# Linux / macOS
export SA_PASSWORD="MyStr0ng!SqlPass"
export JWT_SECRET="your-32-plus-char-random-secret-here"
export SPRING_MAIL_USERNAME="you@gmail.com"
export SPRING_MAIL_PASSWORD="yourgoogleapppassword"

./mvnw spring-boot:run
```

```powershell
# Windows PowerShell
$env:SA_PASSWORD = "MyStr0ng!SqlPass"
$env:JWT_SECRET = "your-32-plus-char-random-secret-here"
$env:SPRING_MAIL_USERNAME = "you@gmail.com"
$env:SPRING_MAIL_PASSWORD = "yourgoogleapppassword"

.\mvnw.cmd spring-boot:run
```

Alternatively, configure them in your IDE's run configuration (IntelliJ: **Run → Edit Configurations → Environment Variables**).

---

### 🔒 Security Notes

- The app will **refuse to start** if `SPRING_MAIL_USERNAME` or `SPRING_MAIL_PASSWORD` are not set (no insecure defaults).
- Sensitive values are **never logged** by Spring Boot's configuration reporting.
- For CI/CD (GitHub Actions), configure secrets under **Repository → Settings → Secrets and Variables → Actions**.
