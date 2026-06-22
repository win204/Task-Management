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