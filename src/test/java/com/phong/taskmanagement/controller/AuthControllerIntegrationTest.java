package com.phong.taskmanagement.controller;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Disabled;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MSSQLServerContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

@Disabled("Requires Docker for Testcontainers")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
public class AuthControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Container
    public static MSSQLServerContainer<?> mssqlserver = new MSSQLServerContainer<>("mcr.microsoft.com/mssql/server:2022-latest")
            .acceptLicense();

    @DynamicPropertySource
    static void mssqlProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mssqlserver::getJdbcUrl);
        registry.add("spring.datasource.username", mssqlserver::getUsername);
        registry.add("spring.datasource.password", mssqlserver::getPassword);
    }

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
    }

    @Test
    void testLoginWithInvalidCredentials_ShouldReturnUnauthorized() {
        String loginBody = """
                {
                    "username": "admin",
                    "password": "wrongpassword"
                }
                """;

        given()
                .contentType(ContentType.JSON)
                .body(loginBody)
                .when()
                .post("/api/auth/login")
                .then()
                .statusCode(401);
    }
}
