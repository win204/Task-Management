package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.dto.request.UpdateSystemConfigRequest;
import com.phong.taskmanagement.dto.response.SystemConfigResponse;
import com.phong.taskmanagement.entity.SystemConfig;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.repository.SystemConfigRepository;
import com.phong.taskmanagement.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SystemConfigServiceImpl implements SystemConfigService {

    private final SystemConfigRepository systemConfigRepository;

    private SystemConfigResponse mapToResponse(SystemConfig config) {
        return SystemConfigResponse.builder()
                .configKey(config.getConfigKey())
                .configValue(config.getConfigValue())
                .description(config.getDescription())
                .updatedAt(config.getUpdatedAt())
                .updatedBy(config.getUpdatedBy())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SystemConfigResponse> getAllConfigs() {
        return systemConfigRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SystemConfigResponse getConfigByKey(String key) {
        SystemConfig config = systemConfigRepository.findById(key)
                .orElseThrow(() -> new ResourceNotFoundException("Config key not found: " + key));
        return mapToResponse(config);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public SystemConfigResponse updateConfig(String key, UpdateSystemConfigRequest request) {
        SystemConfig config = systemConfigRepository.findById(key)
                .orElseThrow(() -> new ResourceNotFoundException("Config key not found: " + key));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "SYSTEM";

        config.setConfigValue(request.getConfigValue());
        config.setUpdatedBy(username);

        SystemConfig updatedConfig = systemConfigRepository.save(config);
        return mapToResponse(updatedConfig);
    }
}
