# Task Management Application

A full-stack collaborative Task Management application built with Spring Boot 3 and React 19.

## Architecture & Tech Stack
- **Backend:** Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA, QueryDSL, Spring HATEOAS, Bucket4j
- **Frontend:** React 19, Vite, Tailwind CSS, Axios, Recharts
- **Database:** Microsoft SQL Server, Liquibase
- **Infrastructure:** Docker Compose, Kubernetes

## Key Features
- **RBAC:** Admin, Manager, Employee roles.
- **Projects & Tasks:** Full CRUD with QueryDSL-powered search and pagination.
- **Real-time Notifications:** WebSockets with STOMP and Spring messaging.
- **Exports:** PDF and Excel exports for Tasks, Projects, Users, and Activity Logs.
- **Security:** Rate limiting with Bucket4j, customized Security Headers (CSP, XSS, HSTS), and proper CORS handling.

## Quick Start

### 1. Deploy All Services (DB + Backend + Frontend)
From the **root** `taskmanagement/` directory:
```bash
docker compose up -d --build
```

### 2. Verify Services
| Service         | URL                                               |
|-----------------|---------------------------------------------------|
| Frontend (React)| http://localhost:5173                             |
| Backend API     | http://localhost:8080                             |
| Swagger UI      | http://localhost:8080/swagger-ui/index.html       |
| Health Check    | http://localhost:8080/actuator/health             |

### 3. Local Development
```bash
# Terminal 1 — Start backend
.\mvnw.cmd spring-boot:run

# Terminal 2 — Start frontend (hot reload)
cd taskmanagement-ui
npm install
npm run dev
```

### 4. Check Container Status
```bash
docker ps
docker compose logs -f
```

### 5. Rebuild After Code Changes
```bash
docker compose down
docker compose up -d --build
```