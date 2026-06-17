package com.phong.taskmanagement.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;

    private String username;

    private String email;

    private String fullName;

    private String phone;

    private Boolean active;

    private java.util.Set<String> roles;
}