package com.phong.taskmanagement.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import com.phong.taskmanagement.domain.entity.Project;

public interface ProjectRepository
        extends JpaRepository<Project, Long>, QuerydslPredicateExecutor<Project> {

    Page<Project> findByProjectNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

    Page<Project> findByStatus(
            String status,
            Pageable pageable
    );
}
