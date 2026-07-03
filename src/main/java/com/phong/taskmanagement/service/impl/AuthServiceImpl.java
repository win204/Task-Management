package com.phong.taskmanagement.service.impl;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.phong.taskmanagement.domain.entity.PasswordResetToken;
import com.phong.taskmanagement.domain.entity.User;
import com.phong.taskmanagement.domain.repository.PasswordResetTokenRepository;
import com.phong.taskmanagement.domain.repository.UserRepository;
import com.phong.taskmanagement.dto.request.ForgotPasswordRequest;
import com.phong.taskmanagement.dto.request.LoginRequest;
import com.phong.taskmanagement.dto.request.ResetPasswordRequest;
import com.phong.taskmanagement.dto.response.LoginResponse;
import com.phong.taskmanagement.security.JwtService;
import com.phong.taskmanagement.service.interfaces.AuthService;
import com.phong.taskmanagement.service.interfaces.EmailService;
import com.phong.taskmanagement.service.interfaces.RefreshTokenService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        log.info("========== LOGIN DEBUG ==========");
        log.info("Username={}", request.getUsername());
        log.info("DB Hash={}", user.getPassword());

        boolean matched = passwordEncoder.matches(request.getPassword(), user.getPassword());

        log.info("Matched={}", matched);
        log.info("================================");

        if (!matched) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String accessToken = jwtService.generateToken(user);
        String refreshToken = refreshTokenService.createRefreshToken(user.getId()).getToken();

        return new LoginResponse(accessToken, refreshToken);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            PasswordResetToken token = PasswordResetToken.builder()
                    .token(UUID.randomUUID().toString())
                    .expiryDate(Instant.now().plusSeconds(30 * 60))
                    .user(user)
                    .used(false)
                    .build();

            passwordResetTokenRepository.save(token);
            emailService.sendPasswordResetEmail(user.getEmail(), token.getToken());
        });
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token"));

        if (resetToken.isUsed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token has already been used");
        }

        if (resetToken.getExpiryDate().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}
