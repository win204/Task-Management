package com.phong.taskmanagement.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.phong.taskmanagement.dto.request.CreateProjectRequest;
import com.phong.taskmanagement.dto.response.ProjectResponse;

public interface ProjectService {

    ProjectResponse createProject(
            CreateProjectRequest request
    );

    List<ProjectResponse> getAllProjects();

    ProjectResponse getProjectById(
            Long id
    );

    void deleteProject(
            Long id
    );

    ProjectResponse updateProject(
            Long id,
            CreateProjectRequest request
    );

    Page<ProjectResponse> searchProjects(
            String keyword,
            int page,
            int size
    );

    Page<ProjectResponse> getProjectsByStatus(
            String status,
            int page,
            int size
    );

    Page<ProjectResponse> getProjectsWithPaging(
            int page,
            int size
    );
}