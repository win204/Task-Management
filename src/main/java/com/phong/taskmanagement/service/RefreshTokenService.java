package com.phong.taskmanagement.service;

import com.phong.taskmanagement.entity.RefreshToken;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(Long userId);

    RefreshToken verifyExpiration(String token);

    String refreshAccessToken(String refreshToken);

    void logout(Long userId);
}
