package com.phong.taskmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProjectMemberRoleRequest {
    
    @NotBlank(message = "Role is required")
    private String role;
}
