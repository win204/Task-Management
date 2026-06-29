package com.phong.taskmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSystemConfigRequest {
    
    @NotBlank(message = "Config value is required")
    private String configValue;
}
