package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.dto.request.UpdateSystemConfigRequest;
import com.phong.taskmanagement.common.response.ApiResponse;
import com.phong.taskmanagement.dto.response.SystemConfigResponse;
import com.phong.taskmanagement.service.interfaces.SystemConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/config")
@RequiredArgsConstructor
@Tag(name = "System Config API", description = "APIs for system configuration")
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    @Operation(summary = "Get all system configurations")
    @GetMapping
    public ApiResponse<List<SystemConfigResponse>> getAllConfigs() {
        List<SystemConfigResponse> response = systemConfigService.getAllConfigs();
        return ApiResponse.success(response, "Configs retrieved successfully");
    }

    @Operation(summary = "Get system configuration by key")
    @GetMapping("/{key}")
    public ApiResponse<SystemConfigResponse> getConfigByKey(@PathVariable String key) {
        SystemConfigResponse response = systemConfigService.getConfigByKey(key);
        return ApiResponse.success(response, "Config retrieved successfully");
    }

    @Operation(summary = "Update system configuration")
    @PutMapping("/{key}")
    public ApiResponse<SystemConfigResponse> updateConfig(
            @PathVariable String key,
            @Valid @RequestBody UpdateSystemConfigRequest request) {
        SystemConfigResponse response = systemConfigService.updateConfig(key, request);
        return ApiResponse.success(response, "Config updated successfully");
    }
}
