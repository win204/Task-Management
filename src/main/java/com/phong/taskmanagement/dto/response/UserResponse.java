package com.phong.taskmanagement.dto.response;

import lombok.*;
import org.springframework.hateoas.RepresentationModel;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse extends RepresentationModel<UserResponse> {

    private Long id;

    private String username;

    private String email;

    private String fullName;

    private String phone;

    private Boolean active;

    private java.util.Set<String> roles;

    private java.util.Set<String> positionNames;
}