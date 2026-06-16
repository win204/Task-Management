package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.entity.RefreshToken;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.repository.RefreshTokenRepository;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.security.JwtService;
import com.phong.taskmanagement.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private static final long REFRESH_TOKEN_DURATION_MS =
            7 * 24 * 60 * 60 * 1000L;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        deleteExpiredTokens();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId));

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(REFRESH_TOKEN_DURATION_MS))
                .user(user)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyExpiration(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Refresh token not found: " + token));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new IllegalArgumentException(
                    "Refresh token expired. Please login again."
            );
        }

        return refreshToken;
    }

    @Override
    @Transactional
    public String refreshAccessToken(String refreshToken) {
        RefreshToken token = verifyExpiration(refreshToken);
        deleteExpiredTokens();
        return jwtService.generateToken(token.getUser());
    }

    @Override
    @Transactional
    public void logout(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId));

        refreshTokenRepository.deleteByUser(user);
    }

    private void deleteExpiredTokens() {
        refreshTokenRepository.deleteByExpiryDateBefore(Instant.now());
    }
}
