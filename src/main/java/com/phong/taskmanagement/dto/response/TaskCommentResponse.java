package com.phong.taskmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskCommentResponse {
    private Long id;
    private Long taskId;
    private Long userId;
    private String username;
    private String fullName;
    private String content;
    private Long parentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TaskCommentResponse> replies;
}
