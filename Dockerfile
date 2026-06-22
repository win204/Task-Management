# ─── Stage 1: Build Spring Boot JAR ─────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

# Cache Maven dependencies separately from source (Docker layer caching)
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copy source and package application
COPY src ./src
RUN mvn -B -DskipTests clean package

# ─── Stage 2: Minimal JRE runtime ────────────────────────────────────────────
FROM eclipse-temurin:21-jre

# Non-root user for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

COPY --from=build /workspace/target/*.jar taskmanagement.jar
RUN chown appuser:appgroup /app/taskmanagement.jar

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "taskmanagement.jar"]
