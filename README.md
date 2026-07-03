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

## 🖼️ Screenshots

*(Placeholder: Screenshots of Login, Dashboard, User/Project Management, Dark Mode, and Swagger UI will be added here).*

---

## 🔮 Future Improvements

- [ ] Add comprehensive **Unit Testing** and **Integration Testing**.
- [ ] Establish a **CI/CD Pipeline** using GitHub Actions.
- [ ] Integrate **Redis** for distributed caching.
- [ ] Set up application monitoring with **Prometheus & Grafana**.
- [ ] Implement an asynchronous **Email Notification Queue**.

---

## 👨‍💻 Author

**Phong Ho**  
*Information Technology Student*  
*Dong A University*
