package com.phong.taskmanagement.domain.repository;

import com.phong.taskmanagement.domain.model.User;

import java.util.Optional;

public interface UserRepository {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    User save(User user);
}
