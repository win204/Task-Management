package com.phong.taskmanagement.controller;

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
import com.phong.taskmanagement.common.response.ApiResponse;
import com.phong.taskmanagement.dto.response.LoginResponse;
import com.phong.taskmanagement.dto.response.RefreshTokenResponse;
import com.phong.taskmanagement.service.interfaces.AuthService;
import com.phong.taskmanagement.service.interfaces.RefreshTokenService;
import com.phong.taskmanagement.service.interfaces.UserService;
import com.phong.taskmanagement.dto.request.CreateUserRequest;
import com.phong.taskmanagement.dto.request.ChangePasswordRequest;
import com.phong.taskmanagement.dto.response.UserResponse;
import java.security.Principal;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Auth API", description = "APIs for authentication")
public class AuthController {

        private final AuthService authService;
        private final RefreshTokenService refreshTokenService;
        private final UserService userService;

        @Operation(summary = "Login", description = "User login with username and password")
        @PostMapping("/login")
        public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
                LoginResponse response = authService.login(request);
                return ApiResponse.success(response, "Login successful");
        }

        @Operation(summary = "Register", description = "Register a new user")
        @PostMapping("/register")
        public ApiResponse<UserResponse> register(@Valid @RequestBody com.phong.taskmanagement.dto.request.RegisterRequest request) {
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
        public ApiResponse<RefreshTokenResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
                RefreshTokenResponse response = refreshTokenService.refreshAccessToken(request.getRefreshToken());
                return ApiResponse.success(response, "Access token refreshed successfully");
        }

        @Operation(summary = "Logout", description = "Delete all refresh tokens of the user")
        @PostMapping("/logout/{userId}")
        public ApiResponse<Void> logout(@PathVariable Long userId) {
                refreshTokenService.logout(userId);
                return ApiResponse.success(null, "Logout successful");
        }

        @Operation(summary = "Forgot Password", description = "Send password reset email")
        @PostMapping("/forgot-password")
        public ApiResponse<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
                authService.forgotPassword(request);
                return ApiResponse.success(null, "If that email is in our database, we have sent a reset link to it.");
        }

        @Operation(summary = "Reset Password", description = "Reset password using token")
        @PostMapping("/reset-password")
        public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
                authService.resetPassword(request);
                return ApiResponse.success(null, "Password reset successfully");
        }

        @Operation(summary = "Get Current User", description = "Get authenticated user profile")
        @GetMapping("/me")
        public ApiResponse<UserResponse> getCurrentUser(Principal principal) {
                if (principal == null) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");
                }
                UserResponse user = userService.getUserByUsername(principal.getName());
                return ApiResponse.success(user, "Profile retrieved successfully");
        }

        @Operation(summary = "Change Password", description = "Change current user's password")
        @PostMapping("/change-password")
        public ApiResponse<Void> changeCurrentPassword(Principal principal, @Valid @RequestBody ChangePasswordRequest request) {
                if (principal == null) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");
                }
                UserResponse user = userService.getUserByUsername(principal.getName());
                userService.changePassword(user.getId(), request);
                return ApiResponse.success(null, "Password changed successfully");
        }
}
