package com.phong.taskmanagement.repository;

import com.phong.taskmanagement.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionRepository extends JpaRepository<Position, Long> {
}