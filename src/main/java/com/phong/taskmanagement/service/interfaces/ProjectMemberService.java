package com.phong.taskmanagement.service.interfaces;

import com.phong.taskmanagement.dto.request.AddProjectMemberRequest;
import com.phong.taskmanagement.dto.response.ProjectMemberResponse;

import java.util.List;

public interface ProjectMemberService {
    ProjectMemberResponse addMember(Long projectId, AddProjectMemberRequest request, String adminUsername);
    ProjectMemberResponse updateMemberRole(Long projectId, Long userId, String role, String adminUsername);
    void removeMember(Long projectId, Long userId, String adminUsername);
    List<ProjectMemberResponse> getMembersByProject(Long projectId);
    boolean isUserInProject(Long projectId, Long userId);
}
