package com.phong.taskmanagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.phong.taskmanagement.entity.Role;

public interface RoleRepository
        extends JpaRepository<Role, Long> {

    Page<Role> findByNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

    java.util.Optional<Role> findByName(String name);
}