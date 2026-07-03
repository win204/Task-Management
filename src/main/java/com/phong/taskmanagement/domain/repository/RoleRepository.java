package com.phong.taskmanagement.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.phong.taskmanagement.domain.entity.Role;

public interface RoleRepository
        extends JpaRepository<Role, Long> {

    Page<Role> findByNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

    java.util.Optional<Role> findByName(String name);
}
