package com.phong.taskmanagement.service.impl;

import com.querydsl.core.BooleanBuilder;
import com.phong.taskmanagement.domain.entity.QUser;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.phong.taskmanagement.dto.request.CreateUserRequest;
import com.phong.taskmanagement.dto.request.UpdateUserRequest;
import com.phong.taskmanagement.dto.request.ChangePasswordRequest;
import com.phong.taskmanagement.dto.response.UserResponse;
import com.phong.taskmanagement.domain.entity.Position;
import com.phong.taskmanagement.domain.entity.Role;
import com.phong.taskmanagement.domain.entity.User;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.domain.repository.PositionRepository;
import com.phong.taskmanagement.domain.repository.RoleRepository;
import com.phong.taskmanagement.domain.repository.UserRepository;
import com.phong.taskmanagement.domain.repository.TaskRepository;
import com.phong.taskmanagement.domain.repository.ActivityLogRepository;
import com.phong.taskmanagement.domain.repository.RefreshTokenRepository;
import com.phong.taskmanagement.domain.repository.ProjectMemberRepository;
import com.phong.taskmanagement.domain.repository.TaskCommentRepository;
import com.phong.taskmanagement.domain.repository.NotificationRepository;
import com.phong.taskmanagement.domain.repository.PasswordResetTokenRepository;
import org.springframework.dao.DataIntegrityViolationException;
import com.phong.taskmanagement.service.interfaces.UserService;
import com.phong.taskmanagement.service.interfaces.RealTimeUpdateService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;

import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PositionRepository positionRepository;
    private final TaskRepository taskRepository;
    private final ActivityLogRepository activityLogRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskCommentRepository taskCommentRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final RealTimeUpdateService realTimeUpdateService;

    private UserResponse mapToResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .active(user.getActive())
                .roles(
                        user.getRoles() != null
                                ? user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
                                : java.util.Collections.emptySet()
                )
                .positionNames(
                        user.getPositions() != null
                                ? user.getPositions().stream().map(Position::getName).collect(Collectors.toSet())
                                : java.util.Collections.emptySet()
                )
                .build();
    }

    @Override
    public UserResponse createUser(CreateUserRequest request) {

        User user = User.builder()
                .username(request.getUsername())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .email(request.getEmail())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            java.util.Set<Role> roles = new java.util.HashSet<>();
            for (String roleName : request.getRoles()) {
                roleRepository.findByName(roleName).ifPresent(roles::add);
            }
            user.setRoles(roles);
        }

        user = userRepository.save(user);

        UserResponse response = mapToResponse(user);
        realTimeUpdateService.broadcastUserUpdate(response);
        realTimeUpdateService.broadcastDashboardUpdate("USER_CREATED");
        
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getUsersPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Id not found"
                ));

        return mapToResponse(user);
    }
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Username not found"));
        return mapToResponse(user);
    }

    @Override
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Id not found"
                ));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("ADMIN"));
        if (isAdmin) {
            long adminCount = userRepository.countByRoles_Name("ADMIN");
            if (adminCount <= 1) {
                throw new com.phong.taskmanagement.exception.BusinessException("Cannot delete the last remaining ADMIN user.");
            }
        }

        projectMemberRepository.deleteByUser(user);
        taskCommentRepository.deleteByUser(user);
        notificationRepository.deleteByUser(user);
        passwordResetTokenRepository.deleteByUser(user);

        taskRepository.updateAssigneeToNull(id);
        activityLogRepository.updateUserToNull(id);
        refreshTokenRepository.deleteByUser(user);

        userRepository.deleteById(id);
        
        realTimeUpdateService.broadcastUserUpdate("DELETED_" + id);
        realTimeUpdateService.broadcastDashboardUpdate("USER_DELETED");
    }

    @Override
    public UserResponse assignRole(
            Long userId,
            Long roleId) {

        User user = userRepository.findById(userId)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "User not found"
                ));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Role not found"
                ));

        user.getRoles().add(role);

        user = userRepository.save(user);

        UserResponse response = mapToResponse(user);
        realTimeUpdateService.broadcastUserUpdate(response);
        realTimeUpdateService.sendProfileUpdateToUser(user.getUsername(), response);
        return response;
    }

    @Override
    public UserResponse assignPosition(
            Long userId,
            Long positionId) {

        User user = userRepository.findById(userId)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "User not found"
                ));

        Position position = positionRepository
                .findById(positionId)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Position not found"
                ));

        user.getPositions().add(position);

        user = userRepository.save(user);

        UserResponse response = mapToResponse(user);
        realTimeUpdateService.broadcastUserUpdate(response);
        realTimeUpdateService.sendProfileUpdateToUser(user.getUsername(), response);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> searchUsers(
            String keyword,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        QUser qUser = QUser.user;
        BooleanBuilder builder = new BooleanBuilder();

        if (keyword != null && !keyword.trim().isEmpty()) {
            builder.and(qUser.username.containsIgnoreCase(keyword)
                    .or(qUser.fullName.containsIgnoreCase(keyword))
                    .or(qUser.email.containsIgnoreCase(keyword))
                    .or(qUser.phone.containsIgnoreCase(keyword)));
        }

        return userRepository.findAll(builder, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public UserResponse updateUser(
            Long id,
            UpdateUserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Id not found"
                ));

        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setActive(request.getActive());

        if (request.getRoles() != null) {
            java.util.Set<Role> roles = new java.util.HashSet<>();
            for (String roleName : request.getRoles()) {
                roleRepository.findByName(roleName).ifPresent(roles::add);
            }
            if (user.getRoles() == null) {
                user.setRoles(roles);
            } else {
                user.getRoles().clear();
                user.getRoles().addAll(roles);
            }
        }

        user = userRepository.save(user);

        UserResponse response = mapToResponse(user);
        realTimeUpdateService.broadcastUserUpdate(response);
        realTimeUpdateService.sendProfileUpdateToUser(user.getUsername(), response);
        return response;
    }

    @Override
    public void changePassword(Long id, ChangePasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Id not found"
                ));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không chính xác");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserResponse lockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id not found"));
        user.setActive(false);
        user = userRepository.save(user);
        
        UserResponse response = mapToResponse(user);
        realTimeUpdateService.broadcastUserUpdate(response);
        realTimeUpdateService.sendProfileUpdateToUser(user.getUsername(), response);
        return response;
    }

    @Override
    public UserResponse unlockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id not found"));
        user.setActive(true);
        user = userRepository.save(user);
        
        UserResponse response = mapToResponse(user);
        realTimeUpdateService.broadcastUserUpdate(response);
        realTimeUpdateService.sendProfileUpdateToUser(user.getUsername(), response);
        return response;
    }
}
