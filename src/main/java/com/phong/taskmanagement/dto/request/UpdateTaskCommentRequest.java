package com.phong.taskmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateTaskCommentRequest {

    @NotBlank(message = "Comment content cannot be blank")
    @Size(max = 2000, message = "Comment must not exceed 2000 characters")
    private String content;
}
