package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.dto.request.AddProjectMemberRequest;
import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.dto.response.ProjectMemberResponse;
import com.phong.taskmanagement.service.ProjectMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/members")
@RequiredArgsConstructor
@Tag(name = "Project Members API", description = "Manage project members and roles")
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    @Operation(summary = "Add a member to a project")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PostMapping
    public ResponseEntity<ApiResponse<ProjectMemberResponse>> addMember(
            @PathVariable Long projectId,
            @Valid @RequestBody AddProjectMemberRequest request,
            Authentication authentication) {

        String adminUsername = authentication.getName();
        return ResponseEntity.ok(
                ApiResponse.success(
                        projectMemberService.addMember(projectId, request, adminUsername),
                        "Project member added successfully"
                )
        );
    }

    @Operation(summary = "Update a project member's role")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @PutMapping("/{userId}/role")
    public ResponseEntity<ApiResponse<ProjectMemberResponse>> updateMemberRole(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @Valid @RequestBody com.phong.taskmanagement.dto.request.UpdateProjectMemberRoleRequest request,
            Authentication authentication) {

        String adminUsername = authentication.getName();
        return ResponseEntity.ok(
                ApiResponse.success(
                        projectMemberService.updateMemberRole(projectId, userId, request.getRole(), adminUsername),
                        "Project member role updated successfully"
                )
        );
    }

    @Operation(summary = "Remove a member from a project")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            Authentication authentication) {

        String adminUsername = authentication.getName();
        projectMemberService.removeMember(projectId, userId, adminUsername);
        return ResponseEntity.ok(
                ApiResponse.success(null, "Project member removed successfully")
        );
    }

    @Operation(summary = "Get all members of a project")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectMemberResponse>>> getProjectMembers(
            @PathVariable Long projectId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        projectMemberService.getMembersByProject(projectId),
                        "Project members retrieved successfully"
                )
        );
    }
}
