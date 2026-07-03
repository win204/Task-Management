package com.phong.taskmanagement.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMemberId implements Serializable {
    private Long project;
    private Long user;
}
