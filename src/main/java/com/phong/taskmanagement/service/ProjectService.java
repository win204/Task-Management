package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.request.CreateProjectRequest;
import com.phong.taskmanagement.entity.Project;

import java.util.List;

public interface ProjectService {

    Project createProject(CreateProjectRequest request);

    List<Project> getAllProjects();

    Project getProjectById(Long id);

    void deleteProject(Long id);

    Project updateProject(Long id, CreateProjectRequest request);
}