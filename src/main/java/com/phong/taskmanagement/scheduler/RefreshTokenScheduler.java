package com.phong.taskmanagement.scheduler;

import com.phong.taskmanagement.domain.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenScheduler {

    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * Automatically clean up expired refresh tokens from the database.
     * Runs every day at 2:00 AM.
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanExpiredRefreshTokens() {
        log.info("Starting scheduled cleanup of expired refresh tokens...");
        Instant now = Instant.now();
        try {
            refreshTokenRepository.deleteByExpiryDateBefore(now);
            log.info("Successfully cleaned up expired refresh tokens older than {}", now);
        } catch (Exception e) {
            log.error("Error occurred while cleaning up expired refresh tokens", e);
        }
    }
}
