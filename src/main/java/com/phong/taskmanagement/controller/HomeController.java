package com.phong.taskmanagement.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Home API", description = "Root API for health check and verification")
public class HomeController {

    @Operation(summary = "Root Endpoint", description = "Verify that the API is running")
    @GetMapping("/")
    public String home() {
        return "Enterprise Task Management API is running 🚀";
    }
}
