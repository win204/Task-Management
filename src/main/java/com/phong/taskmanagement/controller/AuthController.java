package com.phong.taskmanagement.controller;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.phong.taskmanagement.dto.request.LoginRequest;
import com.phong.taskmanagement.dto.request.RefreshTokenRequest;
import com.phong.taskmanagement.dto.request.ForgotPasswordRequest;
import com.phong.taskmanagement.dto.request.ResetPasswordRequest;
import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.dto.response.LoginResponse;
import com.phong.taskmanagement.dto.response.RefreshTokenResponse;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.entity.PasswordResetToken;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.repository.PasswordResetTokenRepository;
import com.phong.taskmanagement.security.JwtService;
import com.phong.taskmanagement.service.RefreshTokenService;
import com.phong.taskmanagement.service.EmailService;
import com.phong.taskmanagement.service.UserService;
import com.phong.taskmanagement.dto.request.CreateUserRequest;
import com.phong.taskmanagement.dto.request.ChangePasswordRequest;
import com.phong.taskmanagement.dto.response.UserResponse;
import java.security.Principal;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import java.time.Instant;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Auth API", description = "APIs for authentication")
public class AuthController {

        private final UserRepository userRepository;
        private final JwtService jwtService;
        private final PasswordEncoder passwordEncoder;
        private final RefreshTokenService refreshTokenService;
        private final PasswordResetTokenRepository passwordResetTokenRepository;
        private final EmailService emailService;
        private final UserService userService;

        @Operation(summary = "Login", description = "User login with username and password")
        @PostMapping("/login")
        public ApiResponse<LoginResponse> login(
                        @RequestBody LoginRequest request) {

                User user = userRepository
                                .findByUsername(request.getUsername())
                                .orElseThrow(() -> new BadCredentialsException(
                                                "Invalid username or password"));

                log.info("========== LOGIN DEBUG ==========");
                log.info("Username={}", request.getUsername());
                log.info("DB Hash={}", user.getPassword());

                boolean matched = passwordEncoder.matches(
                                request.getPassword(),
                                user.getPassword());

                log.info("Matched={}", matched);
                log.info("================================");

                if (!matched) {
                        throw new BadCredentialsException(
                                        "Invalid username or password");
                }

                String accessToken = jwtService.generateToken(user);

                String refreshToken = refreshTokenService
                                .createRefreshToken(user.getId())
                                .getToken();

                LoginResponse response = new LoginResponse(
                                accessToken,
                                refreshToken);

                return ApiResponse.success(
                                response,
                                "Login successful");
        }

        @Operation(summary = "Register", description = "Register a new user")
        @PostMapping("/register")
        public ApiResponse<UserResponse> register(
                        @Valid @RequestBody com.phong.taskmanagement.dto.request.RegisterRequest request) {
                
                CreateUserRequest createRequest = new CreateUserRequest();
                createRequest.setUsername(request.getUsername());
                createRequest.setEmail(request.getEmail());
                createRequest.setPassword(request.getPassword());
                createRequest.setFullName(request.getFullName());
                createRequest.setPhone("N/A");
                createRequest.setRoles(List.of("EMPLOYEE"));
                createRequest.setActive(true);

                UserResponse response = userService.createUser(createRequest);

                return ApiResponse.success(response, "User registered successfully");
        }

        @Operation(summary = "Refresh access token", description = "Generate a new access token using refresh token")
        @PostMapping("/refresh")
        public ApiResponse<RefreshTokenResponse> refreshToken(
                        @RequestBody RefreshTokenRequest request) {

                RefreshTokenResponse response = refreshTokenService
                                .refreshAccessToken(
                                                request.getRefreshToken());

                return ApiResponse.success(
                                response,
                                "Access token refreshed successfully");
        }

        @Operation(summary = "Logout", description = "Delete all refresh tokens of the user")
        @PostMapping("/logout/{userId}")
        public ApiResponse<Void> logout(
                        @PathVariable Long userId) {

                refreshTokenService.logout(userId);

                return ApiResponse.success(
                                null,
                                "Logout successful");
        }

        @Operation(summary = "Forgot Password", description = "Send password reset email")
        @PostMapping("/forgot-password")
        @Transactional
        public ApiResponse<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
                userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
                        PasswordResetToken token = PasswordResetToken.builder()
                                        .token(UUID.randomUUID().toString())
                                        .expiryDate(Instant.now().plusSeconds(30 * 60))
                                        .user(user)
                                        .used(false)
                                        .build();

                        passwordResetTokenRepository.save(token);

                        emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());
                });

                return ApiResponse.success(null, "If that email is in our database, we have sent a reset link to it.");
        }

        @Operation(summary = "Reset Password", description = "Reset password using token")
        @PostMapping("/reset-password")
        @Transactional
        public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
                PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "Invalid token"));

                if (resetToken.isUsed()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token has already been used");
                }

                if (resetToken.getExpiryDate().isBefore(Instant.now())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token has expired");
                }

                User user = resetToken.getUser();
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                userRepository.save(user);

                resetToken.setUsed(true);
                passwordResetTokenRepository.save(resetToken);

                return ApiResponse.success(null, "Password reset successfully");
        }

        @Operation(summary = "Get Current User", description = "Get authenticated user profile")
        @GetMapping("/me")
        public ApiResponse<UserResponse> getCurrentUser(Principal principal) {
                if (principal == null) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");
                }
                User user = userRepository.findByUsername(principal.getName())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
                return ApiResponse.success(userService.getUserById(user.getId()), "Profile retrieved successfully");
        }

        @Operation(summary = "Change Password", description = "Change current user's password")
        @PostMapping("/change-password")
        public ApiResponse<Void> changeCurrentPassword(Principal principal, @Valid @RequestBody ChangePasswordRequest request) {
                if (principal == null) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");
                }
                User user = userRepository.findByUsername(principal.getName())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
                userService.changePassword(user.getId(), request);
                return ApiResponse.success(null, "Password changed successfully");
        }

}
