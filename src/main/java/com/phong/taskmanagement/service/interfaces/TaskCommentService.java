package com.phong.taskmanagement.service.interfaces;

import com.phong.taskmanagement.dto.request.CreateTaskCommentRequest;
import com.phong.taskmanagement.dto.request.UpdateTaskCommentRequest;
import com.phong.taskmanagement.dto.response.TaskCommentResponse;

import java.util.List;

public interface TaskCommentService {
    TaskCommentResponse addComment(Long taskId, String username, CreateTaskCommentRequest request);
    TaskCommentResponse updateComment(Long commentId, String username, UpdateTaskCommentRequest request);
    void deleteComment(Long commentId, String username);
    List<TaskCommentResponse> getCommentsByTask(Long taskId);
}
