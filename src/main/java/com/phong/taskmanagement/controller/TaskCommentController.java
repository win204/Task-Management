package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.dto.request.CreateTaskCommentRequest;
import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.dto.response.TaskCommentResponse;
import com.phong.taskmanagement.service.TaskCommentService;
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
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
@Tag(name = "Task Comments API", description = "Manage task comments and replies")
public class TaskCommentController {

    private final TaskCommentService taskCommentService;

    @Operation(summary = "Add a comment to a task")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @PostMapping
    public ResponseEntity<ApiResponse<TaskCommentResponse>> addComment(
            @PathVariable Long taskId,
            @Valid @RequestBody CreateTaskCommentRequest request,
            Authentication authentication) {

        String username = authentication.getName();
        return ResponseEntity.ok(
                ApiResponse.success(
                        taskCommentService.addComment(taskId, username, request),
                        "Task comment added successfully"
                )
        );
    }

    @Operation(summary = "Delete a task comment")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {

        String username = authentication.getName();
        taskCommentService.deleteComment(commentId, username);
        return ResponseEntity.ok(
                ApiResponse.success(null, "Task comment deleted successfully")
        );
    }

    @Operation(summary = "Update a task comment")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @PutMapping("/{commentId}")
    public ResponseEntity<ApiResponse<TaskCommentResponse>> updateComment(
            @PathVariable Long taskId,
            @PathVariable Long commentId,
            @Valid @RequestBody com.phong.taskmanagement.dto.request.UpdateTaskCommentRequest request,
            Authentication authentication) {

        String username = authentication.getName();
        return ResponseEntity.ok(
                ApiResponse.success(
                        taskCommentService.updateComment(commentId, username, request),
                        "Task comment updated successfully"
                )
        );
    }

    @Operation(summary = "Get all comments for a task")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskCommentResponse>>> getTaskComments(
            @PathVariable Long taskId) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        taskCommentService.getCommentsByTask(taskId),
                        "Task comments retrieved successfully"
                )
        );
    }
}
