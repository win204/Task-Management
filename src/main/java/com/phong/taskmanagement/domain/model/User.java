package com.phong.taskmanagement.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Domain Model for User.
 */
@Getter
@Setter
@Builder
public class User {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private Boolean active;
}
