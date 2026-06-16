package com.phong.taskmanagement.domain.repository;

import com.phong.taskmanagement.domain.model.Project;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository {
    Optional<Project> findById(Long id);
    List<Project> findAll();
    Project save(Project project);
}
