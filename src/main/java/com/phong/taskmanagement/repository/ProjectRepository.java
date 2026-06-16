package com.phong.taskmanagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.phong.taskmanagement.entity.Project;

public interface ProjectRepository
        extends JpaRepository<Project, Long> {

    Page<Project> findByProjectNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

    Page<Project> findByStatus(
            String status,
            Pageable pageable
    );
}