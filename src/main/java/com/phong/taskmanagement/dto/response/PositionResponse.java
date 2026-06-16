package com.phong.taskmanagement.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PositionResponse {

    private Long id;

    private String name;

    private String description;
}