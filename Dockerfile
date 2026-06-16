# Build stage: compile the application with Maven using Eclipse Temurin JDK 21
FROM maven:3.9.9-eclipse-temurin-21 AS build

# Use /workspace as working dir
WORKDIR /workspace

# Copy pom first to leverage Docker layer caching for dependencies
COPY pom.xml ./

# Resolve dependencies (will be cached unless pom.xml changes)
RUN mvn -B -DskipTests dependency:resolve

# Copy source and package application
COPY src ./src
RUN mvn -B -DskipTests package

# Runtime stage: small image with only JRE
FROM eclipse-temurin:21-jre

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app

# Copy the executable jar from the build stage; rename to a stable name
COPY --from=build /workspace/target/*.jar ./taskmanagement.jar

# Ensure non-root ownership
RUN chown appuser:appgroup /app/taskmanagement.jar

USER appuser

# Expose service port
EXPOSE 8080

# Set sensible default Java options (can be overridden at runtime)
ENV JAVA_OPTS="-Xms256m -Xmx512m -Djava.security.egd=file:/dev/./urandom"

# Start the application
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/taskmanagement.jar"]
