package com.phong.taskmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMemberResponse {
    private Long projectId;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String role; // e.g. "LEADER", "MEMBER"
}
