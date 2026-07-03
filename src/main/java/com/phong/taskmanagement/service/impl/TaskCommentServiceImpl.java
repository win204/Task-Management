package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.dto.request.CreateTaskCommentRequest;
import com.phong.taskmanagement.dto.request.UpdateTaskCommentRequest;
import com.phong.taskmanagement.dto.response.TaskCommentResponse;
import com.phong.taskmanagement.domain.entity.Task;
import com.phong.taskmanagement.domain.entity.TaskComment;
import com.phong.taskmanagement.domain.entity.User;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.domain.repository.TaskCommentRepository;
import com.phong.taskmanagement.domain.repository.TaskRepository;
import com.phong.taskmanagement.domain.repository.UserRepository;
import com.phong.taskmanagement.service.interfaces.ActivityLogService;
import com.phong.taskmanagement.service.interfaces.NotificationService;
import com.phong.taskmanagement.service.interfaces.RealTimeUpdateService;
import com.phong.taskmanagement.service.interfaces.TaskCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskCommentServiceImpl implements TaskCommentService {

    private final TaskCommentRepository taskCommentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private final RealTimeUpdateService realTimeUpdateService;
    private final NotificationService notificationService;

    @Override
    public TaskCommentResponse addComment(Long taskId, String username, CreateTaskCommentRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TaskComment parent = null;
        if (request.getParentId() != null) {
            parent = taskCommentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
        }

        TaskComment comment = TaskComment.builder()
                .task(task)
                .user(user)
                .content(request.getContent())
                .parent(parent)
                .build();

        taskCommentRepository.save(comment);

        activityLogService.log(
                user.getId(),
                taskId,
                "CREATE_TASK_COMMENT",
                "Added comment to task " + task.getTitle()
        );

        // Notify assignee if someone else commented
        if (task.getAssignee() != null && !task.getAssignee().getId().equals(user.getId())) {
            notificationService.createNotification(
                    task.getAssignee().getId(),
                    "New Comment on Task",
                    user.getUsername() + " commented on: " + task.getTitle(),
                    "TASK_COMMENT",
                    task.getId()
            );
        }

        // Broadcast
        realTimeUpdateService.broadcastTaskUpdate("TASK_COMMENT_ADDED");

        return mapToResponse(comment);
    }

    @Override
    public void deleteComment(Long commentId, String username) {
        TaskComment comment = taskCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        // Only author or admin can delete
        User user = userRepository.findByUsername(username).orElseThrow();
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN"));

        if (!comment.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to delete this comment");
        }

        taskCommentRepository.delete(comment);

        activityLogService.log(
                user.getId(),
                comment.getTask().getId(),
                "DELETE_TASK_COMMENT",
                "Deleted comment on task " + comment.getTask().getTitle()
        );

        realTimeUpdateService.broadcastTaskUpdate("TASK_COMMENT_REMOVED");
    }

    @Override
    public TaskCommentResponse updateComment(Long commentId, String username, UpdateTaskCommentRequest request) {
        TaskComment comment = taskCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        User user = userRepository.findByUsername(username).orElseThrow();
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("ADMIN"));

        if (!comment.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to edit this comment");
        }

        comment.setContent(request.getContent());
        taskCommentRepository.save(comment);

        activityLogService.log(
                user.getId(),
                comment.getTask().getId(),
                "UPDATE_TASK_COMMENT",
                "Edited comment on task " + comment.getTask().getTitle()
        );

        realTimeUpdateService.broadcastTaskUpdate("TASK_COMMENT_UPDATED");

        return mapToResponse(comment);
    }
    @Transactional(readOnly = true)
    public List<TaskCommentResponse> getCommentsByTask(Long taskId) {
        return taskCommentRepository.findByTaskIdAndParentIsNullOrderByCreatedAtDesc(taskId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TaskCommentResponse mapToResponse(TaskComment comment) {
        return TaskCommentResponse.builder()
                .id(comment.getId())
                .taskId(comment.getTask().getId())
                .userId(comment.getUser().getId())
                .username(comment.getUser().getUsername())
                .fullName(comment.getUser().getFullName())
                .content(comment.getContent())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .replies(comment.getReplies() != null ?
                        comment.getReplies().stream().map(this::mapToResponse).collect(Collectors.toList()) :
                        null)
                .build();
    }
}
