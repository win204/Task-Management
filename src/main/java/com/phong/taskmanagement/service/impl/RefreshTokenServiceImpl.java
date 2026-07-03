package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.domain.entity.RefreshToken;
import com.phong.taskmanagement.domain.entity.User;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.domain.repository.RefreshTokenRepository;
import com.phong.taskmanagement.domain.repository.UserRepository;
import com.phong.taskmanagement.security.JwtService;
import com.phong.taskmanagement.service.interfaces.RefreshTokenService;
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
                .revoked(false)
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
    public com.phong.taskmanagement.dto.response.RefreshTokenResponse refreshAccessToken(String refreshTokenString) {
        RefreshToken token = refreshTokenRepository.findByToken(refreshTokenString)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.UNAUTHORIZED, "Refresh token not found"));

        if (token.isRevoked()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Refresh token has been revoked");
        }

        if (token.getExpiryDate().isBefore(Instant.now())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "Refresh token has expired");
        }

        // Revoke old token
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        // Generate new tokens
        String newAccessToken = jwtService.generateToken(token.getUser());
        RefreshToken newRefreshToken = createRefreshToken(token.getUser().getId());

        deleteExpiredTokens();
        
        return new com.phong.taskmanagement.dto.response.RefreshTokenResponse(newAccessToken, newRefreshToken.getToken());
    }

    @Override
    @Transactional
    public void logout(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId));

        java.util.List<RefreshToken> tokens = refreshTokenRepository.findAllByUser(user);
        tokens.forEach(t -> t.setRevoked(true));
        refreshTokenRepository.saveAll(tokens);
    }

    private void deleteExpiredTokens() {
        refreshTokenRepository.deleteByExpiryDateBefore(Instant.now());
    }
}
