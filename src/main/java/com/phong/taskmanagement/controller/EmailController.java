package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.service.interfaces.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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

    /**
     * The test recipient is read from SPRING_MAIL_USERNAME env var so that
     * no real email address is ever committed to source control.
     */
    @Value("${spring.mail.username}")
    private String testRecipient;

    @Operation(summary = "Test email sending")
    @GetMapping("/test")
    public ResponseEntity<String> testEmail() {
        emailService.sendSimpleEmail(
                testRecipient,
                "Test Email",
                "Hello from Task Management System");
        return ResponseEntity.ok("Email sent successfully");
    }
}
