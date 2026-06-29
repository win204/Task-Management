package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.request.CreateTaskCommentRequest;
import com.phong.taskmanagement.dto.response.TaskCommentResponse;

import java.util.List;

public interface TaskCommentService {
    TaskCommentResponse addComment(Long taskId, String username, CreateTaskCommentRequest request);
    void deleteComment(Long commentId, String username);
    List<TaskCommentResponse> getCommentsByTask(Long taskId);
}
