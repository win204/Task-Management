package com.phong.taskmanagement.repository;

import com.phong.taskmanagement.entity.RefreshToken;
import com.phong.taskmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByTokenAndRevokedFalse(String token);

    java.util.List<RefreshToken> findAllByUser(User user);

    void deleteByUser(User user);

    void deleteByExpiryDateBefore(Instant now);
}
