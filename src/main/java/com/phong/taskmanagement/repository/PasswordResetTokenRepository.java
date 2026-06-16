package com.phong.taskmanagement.repository;

import com.phong.taskmanagement.entity.PasswordResetToken;
import com.phong.taskmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(User user);
    
    void deleteByToken(String token);
}
