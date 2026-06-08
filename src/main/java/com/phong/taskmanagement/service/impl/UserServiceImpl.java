package com.phong.taskmanagement.service.impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.phong.taskmanagement.dto.request.CreateUserRequest;
import com.phong.taskmanagement.dto.response.UserResponse;
import com.phong.taskmanagement.entity.Position;
import com.phong.taskmanagement.entity.Role;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.repository.PositionRepository;
import com.phong.taskmanagement.repository.RoleRepository;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.service.UserService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PositionRepository positionRepository;
    private final PasswordEncoder passwordEncoder;

    private UserResponse mapToResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .active(user.getActive())
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
                .active(true)
                .build();

        user = userRepository.save(user);

        return mapToResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Id not found"
                ));

        return mapToResponse(user);
    }

    @Override
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Id not found"
            );
        }

        userRepository.deleteById(id);
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

        return mapToResponse(user);
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

        return mapToResponse(user);
    }

    @Override
    public Page<UserResponse> searchUsers(
            String keyword,
            int page,
            int size) {

        Pageable pageable
                = PageRequest.of(page, size);

        return userRepository
                .findByUsernameContainingIgnoreCase(
                        keyword,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Override
    public UserResponse updateUser(
            Long id,
            CreateUserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Id not found"
                ));

        user.setUsername(request.getUsername());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        user = userRepository.save(user);

        return mapToResponse(user);
    }
}
