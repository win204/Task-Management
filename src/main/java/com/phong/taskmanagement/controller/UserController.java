package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.dto.request.CreateUserRequest;
import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.dto.response.UserResponse;
import com.phong.taskmanagement.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(
        name = "User API",
        description = "APIs for managing users"
)
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "Create new user",
            description = "Create a new user"
    )
    @PostMapping
    public ApiResponse<UserResponse> createUser(
            @Valid
            @RequestBody
            CreateUserRequest request) {

        UserResponse response = userService.createUser(request);
        return ApiResponse.success(response, "User created successfully");
    }

    @Operation(
            summary = "Assign role to user",
            description = "Assign a role to a specific user"
    )
    @PostMapping("/{userId}/roles/{roleId}")
    public ApiResponse<UserResponse> assignRole(
            @PathVariable Long userId,
            @PathVariable Long roleId) {

        UserResponse response = userService.assignRole(
                userId,
                roleId
        );
        return ApiResponse.success(response, "Role assigned successfully");
    }

    @Operation(
            summary = "Assign position to user",
            description = "Assign a position to a specific user"
    )
    @PostMapping("/{userId}/positions/{positionId}")
    public ApiResponse<UserResponse> assignPosition(
            @PathVariable Long userId,
            @PathVariable Long positionId) {

        UserResponse response = userService.assignPosition(
                userId,
                positionId
        );
        return ApiResponse.success(response, "Position assigned successfully");
    }

    @Operation(
            summary = "Get all users",
            description = "Retrieve all users"
    )
    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {

        List<UserResponse> response = userService.getAllUsers();
        return ApiResponse.success(response, "Users retrieved successfully");
    }

    @Operation(
            summary = "Search users",
            description = "Search users by username with pagination"
    )
    @GetMapping("/search")
    public ApiResponse<Page<UserResponse>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<UserResponse> response = userService.searchUsers(
                keyword,
                page,
                size
        );
        return ApiResponse.success(response, "Users searched successfully");
    }

    @Operation(
            summary = "Get user by id",
            description = "Retrieve a user by id"
    )
    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUserById(
            @PathVariable Long id) {

        UserResponse response = userService.getUserById(id);
        return ApiResponse.success(response, "User retrieved successfully");
    }

    @Operation(
            summary = "Update user",
            description = "Update user information"
    )
    @PutMapping("/{id}")
    public ApiResponse<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid
            @RequestBody
            CreateUserRequest request) {

        UserResponse response = userService.updateUser(
                id,
                request
        );
        return ApiResponse.success(response, "User updated successfully");
    }

    @Operation(
            summary = "Delete user",
            description = "Delete a user by id"
    )
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);
        return ApiResponse.success(null, "User deleted successfully");
    }
}