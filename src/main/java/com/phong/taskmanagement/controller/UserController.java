package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.dto.request.CreateUserRequest;
import com.phong.taskmanagement.dto.response.UserResponse;
import com.phong.taskmanagement.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public UserResponse createUser(
            @Valid @RequestBody CreateUserRequest request) {

        return userService.createUser(request);
    }

    @PostMapping("/{userId}/roles/{roleId}")
    public UserResponse assignRole(
            @PathVariable Long userId,
            @PathVariable Long roleId) {

        return userService.assignRole(
                userId,
                roleId
        );
    }

    @PostMapping("/{userId}/positions/{positionId}")
    public UserResponse assignPosition(
            @PathVariable Long userId,
            @PathVariable Long positionId) {

        return userService.assignPosition(
                userId,
                positionId
        );
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();
    }

    @GetMapping("/search")
    public Page<UserResponse> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return userService.searchUsers(
                keyword,
                page,
                size
        );  
    }

    @GetMapping("/{id}")
    public UserResponse getUser(
            @PathVariable Long id) {

        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @Valid @RequestBody CreateUserRequest request) {

        return userService.updateUser(
                id,
                request
        );
    }
}
