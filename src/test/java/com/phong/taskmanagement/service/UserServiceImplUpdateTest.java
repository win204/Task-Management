package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.request.ChangePasswordRequest;
import com.phong.taskmanagement.dto.request.UpdateUserRequest;
import com.phong.taskmanagement.domain.entity.Role;
import com.phong.taskmanagement.domain.entity.User;
import com.phong.taskmanagement.domain.repository.RoleRepository;
import com.phong.taskmanagement.domain.repository.UserRepository;
import com.phong.taskmanagement.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.phong.taskmanagement.service.interfaces.RealTimeUpdateService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplUpdateTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RealTimeUpdateService realTimeUpdateService;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void updateUser_ShouldMapFieldsAndRoles_WithoutTouchingPassword() {
        // Arrange
        Long userId = 1L;
        User mockUser = new User();
        mockUser.setId(userId);
        mockUser.setUsername("existingUser");
        mockUser.setPassword("existingPassword");

        UpdateUserRequest request = new UpdateUserRequest();
        request.setEmail("new@example.com");
        request.setFullName("New Name");
        request.setPhone("0987654321");
        request.setActive(true);
        request.setRoles(List.of("EMPLOYEE", "MANAGER"));

        Role employeeRole = new Role();
        employeeRole.setName("EMPLOYEE");
        Role managerRole = new Role();
        managerRole.setName("MANAGER");

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(roleRepository.findByName("EMPLOYEE")).thenReturn(Optional.of(employeeRole));
        when(roleRepository.findByName("MANAGER")).thenReturn(Optional.of(managerRole));
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // Act
        userService.updateUser(userId, request);

        // Assert
        verify(userRepository).save(argThat(user -> 
            user.getEmail().equals("new@example.com") &&
            user.getFullName().equals("New Name") &&
            user.getRoles().size() == 2 &&
            user.getPassword().equals("existingPassword") // Unchanged
        ));
    }

    @Test
    void changePassword_WhenOldPasswordCorrect_ShouldUpdate() {
        // Arrange
        Long userId = 1L;
        User mockUser = new User();
        mockUser.setPassword("encodedOldPassword");

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("correctOld");
        request.setNewPassword("newPass123");

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("correctOld", "encodedOldPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPass123")).thenReturn("encodedNewPassword");

        // Act
        userService.changePassword(userId, request);

        // Assert
        verify(userRepository).save(argThat(user -> 
            user.getPassword().equals("encodedNewPassword")
        ));
    }

    @Test
    void changePassword_WhenOldPasswordWrong_ShouldThrowException() {
        // Arrange
        Long userId = 1L;
        User mockUser = new User();
        mockUser.setPassword("encodedOldPassword");

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("wrongOld");

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("wrongOld", "encodedOldPassword")).thenReturn(false);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            userService.changePassword(userId, request);
        });
        
        verify(userRepository, never()).save(any());
    }
}
