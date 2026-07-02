package com.phong.taskmanagement.repository;

import com.phong.taskmanagement.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;
import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long>, QuerydslPredicateExecutor<User> {

    @EntityGraph(attributePaths = {"roles", "positions"})
    Optional<User> findByUsername(String username);

    @EntityGraph(attributePaths = {"roles", "positions"})
    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Page<User> findByUsernameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"roles", "positions"})
    Page<User> findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String username,
            String fullName,
            String email,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"roles", "positions"})
    Page<User> findAll(Pageable pageable);

    long countByRoles_Name(String roleName);
}