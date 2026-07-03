package com.phong.taskmanagement.dto.request;

import com.phong.taskmanagement.domain.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskStatusRequest {
    @NotNull(message = "Task status cannot be null")
    private TaskStatus status;
}
