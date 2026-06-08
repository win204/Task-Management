package com.phong.taskmanagement.service.impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.phong.taskmanagement.dto.request.CreateUserRequest;
import com.phong.taskmanagement.entity.Position;
import com.phong.taskmanagement.entity.Role;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.repository.PositionRepository;
import com.phong.taskmanagement.repository.RoleRepository;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PositionRepository positionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User createUser(CreateUserRequest request) {

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

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException("Id not found"));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User assignRole(Long userId, Long roleId) {

        User user = userRepository.findById(userId)
                .orElseThrow(()
                        -> new ResourceNotFoundException("User not found"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(()
                        -> new ResourceNotFoundException("Role not found"));

        user.getRoles().add(role);

        return userRepository.save(user);
    }

    @Override
    public User assignPosition(Long userId, Long positionId) {

        User user = userRepository.findById(userId)
                .orElseThrow(()
                        -> new ResourceNotFoundException("User not found"));

        Position position = positionRepository.findById(positionId)
                .orElseThrow(()
                        -> new ResourceNotFoundException("Position not found"));

        user.getPositions().add(position);

        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, CreateUserRequest request) {
        User user = getUserById(id);

        user.setUsername(request.getUsername());
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        return userRepository.save(user);
    }
}
