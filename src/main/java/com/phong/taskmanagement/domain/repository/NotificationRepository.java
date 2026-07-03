package com.phong.taskmanagement.domain.repository;

import com.phong.taskmanagement.domain.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserId(Long userId);

    List<Notification> findByUserIdAndIsReadFalse(Long userId);

    void deleteByUser(com.phong.taskmanagement.domain.entity.User user);
}
