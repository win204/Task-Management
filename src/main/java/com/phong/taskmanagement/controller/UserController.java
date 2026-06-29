package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.dto.request.CreateUserRequest;
import com.phong.taskmanagement.dto.request.UpdateUserRequest;
import com.phong.taskmanagement.dto.request.ChangePasswordRequest;
import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.dto.response.UserResponse;
import com.phong.taskmanagement.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

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
        response.add(linkTo(methodOn(UserController.class).getUserById(response.getId())).withSelfRel());
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
        response.add(linkTo(methodOn(UserController.class).getUserById(userId)).withSelfRel());
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
        response.add(linkTo(methodOn(UserController.class).getUserById(userId)).withSelfRel());
        return ApiResponse.success(response, "Position assigned successfully");
    }

    @Operation(
            summary = "Get all users (paginated)",
            description = "Retrieve all users with server-side pagination"
    )
    @GetMapping
    public ApiResponse<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<UserResponse> response = userService.getUsersPaged(page, size);
        response.forEach(user -> user.add(linkTo(methodOn(UserController.class).getUserById(user.getId())).withSelfRel()));
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
        response.forEach(user -> user.add(linkTo(methodOn(UserController.class).getUserById(user.getId())).withSelfRel()));
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
        response.add(linkTo(methodOn(UserController.class).getUserById(id)).withSelfRel());
        response.add(linkTo(methodOn(UserController.class).getAllUsers(0, 10)).withRel("users"));
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
            UpdateUserRequest request) {

        UserResponse response = userService.updateUser(
                id,
                request
        );
        response.add(linkTo(methodOn(UserController.class).getUserById(id)).withSelfRel());
        return ApiResponse.success(response, "User updated successfully");
    }

    @Operation(
            summary = "Change password",
            description = "Change the password for a specific user"
    )
    @PostMapping("/{id}/change-password")
    public ApiResponse<Void> changePassword(
            @PathVariable Long id,
            @Valid
            @RequestBody
            ChangePasswordRequest request) {

        userService.changePassword(id, request);
        return ApiResponse.success(null, "Password changed successfully");
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

    @Operation(
            summary = "Lock user",
            description = "Lock a user account"
    )
    @PutMapping("/{id}/lock")
    public ApiResponse<UserResponse> lockUser(
            @PathVariable Long id) {

        UserResponse response = userService.lockUser(id);
        response.add(linkTo(methodOn(UserController.class).getUserById(id)).withSelfRel());
        return ApiResponse.success(response, "User locked successfully");
    }

    @Operation(
            summary = "Unlock user",
            description = "Unlock a user account"
    )
    @PutMapping("/{id}/unlock")
    public ApiResponse<UserResponse> unlockUser(
            @PathVariable Long id) {

        UserResponse response = userService.unlockUser(id);
        response.add(linkTo(methodOn(UserController.class).getUserById(id)).withSelfRel());
        return ApiResponse.success(response, "User unlocked successfully");
    }
}