package com.phong.taskmanagement.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.phong.taskmanagement.dto.request.LoginRequest;
import com.phong.taskmanagement.dto.response.LoginResponse;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.security.JwtService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(()
                        -> new RuntimeException(
                        "User not found"));

        System.out.println("Input Password: " + request.getPassword());
        System.out.println("DB Password: " + user.getPassword());

        boolean matched = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        System.out.println("Matched: " + matched);

        if (!matched) {

            throw new RuntimeException(
                    "Invalid username or password");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(token);
    }
}
