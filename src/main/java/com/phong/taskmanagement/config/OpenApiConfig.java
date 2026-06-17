package com.phong.taskmanagement.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * Global OpenAPI/Swagger Configuration.
 * 
 * - @OpenAPIDefinition sets the global API info and applies the "BearerAuth" requirement to ALL endpoints.
 * - @SecurityScheme defines how "BearerAuth" works (HTTP Bearer using JWT).
 */
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Task Management API",
                version = "1.0",
                description = "Task Management System API"
        ),
        security = {
                @SecurityRequirement(name = "BearerAuth")
        }
)
@SecurityScheme(
        name = "BearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        description = "Enter your JWT token here (without the 'Bearer ' prefix)."
)
public class OpenApiConfig {
}
