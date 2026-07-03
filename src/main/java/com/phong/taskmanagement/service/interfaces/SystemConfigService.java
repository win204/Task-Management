package com.phong.taskmanagement.service.interfaces;

import com.phong.taskmanagement.dto.request.UpdateSystemConfigRequest;
import com.phong.taskmanagement.dto.response.SystemConfigResponse;

import java.util.List;

public interface SystemConfigService {

    List<SystemConfigResponse> getAllConfigs();

    SystemConfigResponse getConfigByKey(String key);

    SystemConfigResponse updateConfig(String key, UpdateSystemConfigRequest request);
}
