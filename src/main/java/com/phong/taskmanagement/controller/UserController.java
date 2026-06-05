package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.dto.request.CreateUserRequest;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public User createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    @PostMapping("/{userId}/roles/{roleId}")
    public User assignRole(
            @PathVariable Long userId,
            @PathVariable Long roleId
    ) {
        return userService.assignRole(userId, roleId);
    }

    @PostMapping("/{userId}/positions/{positionId}")
    public User assignPosition(
            @PathVariable Long userId,
            @PathVariable Long positionId
    ) {
        return userService.assignPosition(userId, positionId);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @Valid @RequestBody CreateUserRequest request) {

        return userService.updateUser(id, request);
    }
}
