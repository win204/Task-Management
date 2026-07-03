package com.phong.taskmanagement.service.interfaces;

import com.phong.taskmanagement.domain.entity.RefreshToken;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(Long userId);

    RefreshToken verifyExpiration(String token);

    com.phong.taskmanagement.dto.response.RefreshTokenResponse refreshAccessToken(String refreshToken);

    void logout(Long userId);
}
