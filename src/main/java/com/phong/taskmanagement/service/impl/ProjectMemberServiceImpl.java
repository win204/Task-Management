package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.dto.request.AddProjectMemberRequest;
import com.phong.taskmanagement.dto.response.ProjectMemberResponse;
import com.phong.taskmanagement.entity.Project;
import com.phong.taskmanagement.entity.ProjectMember;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.repository.ProjectMemberRepository;
import com.phong.taskmanagement.repository.ProjectRepository;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.service.ActivityLogService;
import com.phong.taskmanagement.service.ProjectMemberService;
import com.phong.taskmanagement.service.RealTimeUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private final RealTimeUpdateService realTimeUpdateService;

    @Override
    public ProjectMemberResponse addMember(Long projectId, AddProjectMemberRequest request, String adminUsername) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        User admin = userRepository.findByUsername(adminUsername).orElseThrow();

        if (projectMemberRepository.existsByProjectAndUser(project, user)) {
            throw new IllegalArgumentException("User is already a member of this project");
        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(request.getRole())
                .build();

        projectMemberRepository.save(member);

        // Activity log
        activityLogService.log(
                admin.getId(),
                projectId,
                "PROJECT",
                "ADD_PROJECT_MEMBER",
                "Added user " + user.getUsername() + " to project as " + request.getRole()
        );

        // Broadcast to clients
        realTimeUpdateService.broadcastProjectUpdate("PROJECT_MEMBER_ADDED");

        return mapToResponse(member);
    }

    @Override
    public ProjectMemberResponse updateMemberRole(Long projectId, Long userId, String role, String adminUsername) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        User admin = userRepository.findByUsername(adminUsername).orElseThrow();

        ProjectMember member = projectMemberRepository.findByProjectId(projectId).stream()
                .filter(m -> m.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("User is not a member of this project"));

        member.setRole(role);
        projectMemberRepository.save(member);

        activityLogService.log(
                admin.getId(),
                projectId,
                "PROJECT",
                "UPDATE_PROJECT_MEMBER_ROLE",
                "Updated role of user " + user.getUsername() + " to " + role
        );

        realTimeUpdateService.broadcastProjectUpdate("PROJECT_MEMBER_UPDATED");

        return mapToResponse(member);
    }

    @Override
    public void removeMember(Long projectId, Long userId, String adminUsername) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        User admin = userRepository.findByUsername(adminUsername).orElseThrow();

        projectMemberRepository.deleteByProjectAndUser(project, user);

        activityLogService.log(
                admin.getId(),
                projectId,
                "PROJECT",
                "REMOVE_PROJECT_MEMBER",
                "Removed user " + user.getUsername() + " from project"
        );

        realTimeUpdateService.broadcastProjectUpdate("PROJECT_MEMBER_REMOVED");
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getMembersByProject(Long projectId) {
        return projectMemberRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUserInProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return projectMemberRepository.existsByProjectAndUser(project, user);
    }

    private ProjectMemberResponse mapToResponse(ProjectMember member) {
        return ProjectMemberResponse.builder()
                .projectId(member.getProject().getId())
                .userId(member.getUser().getId())
                .username(member.getUser().getUsername())
                .fullName(member.getUser().getFullName())
                .email(member.getUser().getEmail())
                .role(member.getRole())
                .build();
    }
}
