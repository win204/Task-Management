package com.phong.taskmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddProjectMemberRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Role is required (e.g. LEADER, MEMBER)")
    private String role;
}
