package com.phong.taskmanagement.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import com.phong.taskmanagement.dto.request.CreateProjectRequest;
import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.dto.response.ProjectResponse;
import com.phong.taskmanagement.service.ProjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(
        name = "Project API",
        description = "APIs for managing projects"
)
public class ProjectController {

    private final ProjectService projectService;

    @Operation(
            summary = "Create new project",
            description = "Create a new project"
    )
    @PostMapping
    public ApiResponse<ProjectResponse> createProject(
            @RequestBody CreateProjectRequest request) {

        ProjectResponse response = projectService.createProject(
                request
        );
        return ApiResponse.success(response, "Project created successfully");
    }

    @Operation(
            summary = "Get all projects",
            description = "Retrieve all projects"
    )
    @GetMapping
    public ApiResponse<List<ProjectResponse>> getAllProjects() {

        List<ProjectResponse> response = projectService.getAllProjects();
        return ApiResponse.success(response, "Projects retrieved successfully");
    }

    @Operation(
            summary = "Get project by id",
            description = "Retrieve a project by id"
    )
    @GetMapping("/{id}")
    public ApiResponse<ProjectResponse> getProjectById(
            @PathVariable Long id) {

        ProjectResponse response = projectService.getProjectById(id);
        return ApiResponse.success(response, "Project retrieved successfully");
    }

    @Operation(
            summary = "Search projects",
            description = "Search projects by keyword with pagination"
    )
    @GetMapping("/search")
    public ApiResponse<Page<ProjectResponse>> searchProjects(

            @RequestParam String keyword,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        Page<ProjectResponse> response = projectService.searchProjects(
                keyword,
                page,
                size
        );
        return ApiResponse.success(response, "Projects searched successfully");
    }

    @Operation(
            summary = "Get projects by status",
            description = "Retrieve projects filtered by status with pagination"
    )
    @GetMapping("/status")
    public ApiResponse<Page<ProjectResponse>> getProjectsByStatus(

            @RequestParam String status,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        Page<ProjectResponse> response = projectService.getProjectsByStatus(
                status,
                page,
                size
        );
        return ApiResponse.success(response, "Projects filtered by status successfully");
    }

    @Operation(
            summary = "Get projects with pagination",
            description = "Retrieve projects with pagination"
    )
    @GetMapping("/paging")
    public ApiResponse<Page<ProjectResponse>> getProjectsWithPaging(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        Page<ProjectResponse> response = projectService.getProjectsWithPaging(
                page,
                size
        );
        return ApiResponse.success(response, "Projects retrieved with pagination successfully");
    }

    @Operation(
            summary = "Update project",
            description = "Update project information"
    )
    @PutMapping("/{id}")
    public ApiResponse<ProjectResponse> updateProject(
            @PathVariable Long id,
            @RequestBody CreateProjectRequest request) {

        ProjectResponse response = projectService.updateProject(
                id,
                request
        );
        return ApiResponse.success(response, "Project updated successfully");
    }

    @Operation(
            summary = "Delete project",
            description = "Delete a project by id"
    )
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProject(
            @PathVariable Long id) {

        projectService.deleteProject(id);
        return ApiResponse.success(null, "Project deleted successfully");
    }
}