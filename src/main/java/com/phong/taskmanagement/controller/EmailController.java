package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@Tag(name = "Email API", description = "APIs for testing email notifications")
public class EmailController {

    private final EmailService emailService;

    @Operation(summary = "Test email sending")
    @GetMapping("/test")
    public ResponseEntity<String> testEmail() {
        emailService.sendSimpleEmail(
                "phonghuuho204@gmail.com",
                "Test Email",
                "Hello from Task Management System");
        return ResponseEntity.ok("Email sent successfully");
    }
}
