package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.request.CreateUserRequest;
import com.phong.taskmanagement.dto.response.UserResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {

    UserResponse createUser(CreateUserRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    void deleteUser(Long id);

    UserResponse assignRole(Long userId, Long roleId);

    UserResponse assignPosition(Long userId, Long positionId);

    Page<UserResponse> searchUsers(
            String keyword,
            int page,
            int size
    );

    UserResponse updateUser(
            Long id,
            CreateUserRequest request
    );
}
