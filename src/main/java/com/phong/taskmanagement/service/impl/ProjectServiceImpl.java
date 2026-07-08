package com.phong.taskmanagement.service.impl;

import com.querydsl.core.BooleanBuilder;
import com.phong.taskmanagement.domain.entity.QProject;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.phong.taskmanagement.dto.request.CreateProjectRequest;
import com.phong.taskmanagement.dto.response.ProjectResponse;
import com.phong.taskmanagement.domain.entity.Project;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.domain.repository.ProjectRepository;
import com.phong.taskmanagement.domain.repository.TaskRepository;
import com.phong.taskmanagement.domain.repository.ActivityLogRepository;
import org.springframework.dao.DataIntegrityViolationException;
import com.phong.taskmanagement.service.interfaces.ProjectService;
import com.phong.taskmanagement.service.interfaces.NotificationService;
import com.phong.taskmanagement.service.interfaces.RealTimeUpdateService;

import lombok.RequiredArgsConstructor;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl
                implements ProjectService {

        private final ProjectRepository projectRepository;
        private final TaskRepository taskRepository;
        private final ActivityLogRepository activityLogRepository;
        private final NotificationService notificationService;
        private final RealTimeUpdateService realTimeUpdateService;

        private ProjectResponse mapToResponse(
                        Project project) {

                return ProjectResponse.builder()
                                .id(project.getId())
                                .projectCode(project.getProjectCode())
                                .projectName(project.getProjectName())
                                .description(project.getDescription())
                                .startDate(project.getStartDate())
                                .endDate(project.getEndDate())
                                .status(project.getStatus())
                                .build();
        }

        @Override
        public ProjectResponse createProject(
                        CreateProjectRequest request) {

                Project project = Project.builder()
                                .projectCode(request.getProjectCode())
                                .projectName(request.getProjectName())
                                .description(request.getDescription())
                                .startDate(request.getStartDate())
                                .endDate(request.getEndDate())
                                .status(request.getStatus())
                                .build();

                ProjectResponse response = mapToResponse(
                                projectRepository.save(project));
                realTimeUpdateService.broadcastProjectUpdate(response);
                realTimeUpdateService.broadcastDashboardUpdate("PROJECT_CREATED");
                return response;
        }

        @Override
        @Transactional(readOnly = true)
        public List<ProjectResponse> getAllProjects() {

                return projectRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public ProjectResponse getProjectById(
                        Long id) {

                Project project = projectRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Project not found"));

                return mapToResponse(project);
        }

        @Override
        public void deleteProject(Long id) {

                if (!projectRepository.existsById(id)) {

                        throw new ResourceNotFoundException(
                                        "Project not found");
                }

                activityLogRepository.deleteByTaskProjectId(id);
                taskRepository.deleteByProjectId(id);
                projectRepository.deleteById(id);
                realTimeUpdateService.broadcastProjectUpdate("DELETED_" + id);
                realTimeUpdateService.broadcastDashboardUpdate("PROJECT_DELETED");
        }

        @Override
        public ProjectResponse updateProject(
                        Long id,
                        CreateProjectRequest request) {

                Project project = projectRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Project not found"));

                project.setProjectCode(
                                request.getProjectCode());

                project.setProjectName(
                                request.getProjectName());

                project.setDescription(
                                request.getDescription());

                project.setStartDate(
                                request.getStartDate());

                project.setEndDate(
                                request.getEndDate());

                project.setStatus(
                                request.getStatus());

                Project savedProject = projectRepository.save(project);

                // Notify task assignees about the project update
                savedProject.getTasks().stream()
                                .filter(t -> t.getAssignee() != null)
                                .map(t -> t.getAssignee().getId())
                                .distinct()
                                .forEach(userId -> {
                                        notificationService.createNotification(
                                                        userId,
                                                        "Project Updated",
                                                        "The project '" + savedProject.getProjectName()
                                                                        + "' has been updated.",
                                                        "PROJECT_UPDATED",
                                                        savedProject.getId());
                                });

                ProjectResponse response = mapToResponse(savedProject);
                realTimeUpdateService.broadcastProjectUpdate(response);
                realTimeUpdateService.broadcastDashboardUpdate("PROJECT_UPDATED");
                return response;
        }

        @Override
        @Transactional(readOnly = true)
        public Page<ProjectResponse> searchProjects(
                        String keyword,
                        String status,
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(page, size);
                QProject qProject = QProject.project;
                BooleanBuilder builder = new BooleanBuilder();

                if (keyword != null && !keyword.trim().isEmpty()) {
                        builder.and(qProject.projectName.containsIgnoreCase(keyword)
                                        .or(qProject.projectCode.containsIgnoreCase(keyword))
                                        .or(qProject.description.containsIgnoreCase(keyword)));
                }

                if (status != null && !status.trim().isEmpty()) {
                        builder.and(qProject.status.eq(status));
                }

                return projectRepository.findAll(builder, pageable)
                                .map(this::mapToResponse);
        }

        @Override
        @Transactional(readOnly = true)
        public Page<ProjectResponse> getProjectsByStatus(
                        String status,
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(page, size);

                return projectRepository
                                .findByStatus(
                                                status,
                                                pageable)
                                .map(this::mapToResponse);
        }

        @Override
        @Transactional(readOnly = true)
        public Page<ProjectResponse> getProjectsWithPaging(
                        int page,
                        int size) {

                Pageable pageable = PageRequest.of(page, size);

                return projectRepository
                                .findAll(pageable)
                                .map(this::mapToResponse);
        }
}
