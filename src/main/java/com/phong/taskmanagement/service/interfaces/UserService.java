package com.phong.taskmanagement.service.interfaces;

import com.phong.taskmanagement.dto.request.CreateUserRequest;
import com.phong.taskmanagement.dto.request.UpdateUserRequest;
import com.phong.taskmanagement.dto.request.ChangePasswordRequest;
import com.phong.taskmanagement.dto.response.UserResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {

    UserResponse createUser(CreateUserRequest request);

    List<UserResponse> getAllUsers();

    Page<UserResponse> getUsersPaged(int page, int size);

    UserResponse getUserById(Long id);

    UserResponse getUserByUsername(String username);

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
            UpdateUserRequest request
    );

    void changePassword(
            Long id,
            ChangePasswordRequest request
    );

    UserResponse lockUser(Long id);

    UserResponse unlockUser(Long id);
}
