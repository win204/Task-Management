package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.request.CreateUserRequest;
import com.phong.taskmanagement.entity.User;

import java.util.List;

public interface UserService {

    User createUser(CreateUserRequest request);

    List<User> getAllUsers();

    User getUserById(Long id);

    void deleteUser(Long id);

    User assignRole(Long userId, Long roleId);

    User assignPosition(Long userId, Long positionId);

    User updateUser(Long id, CreateUserRequest request);
}