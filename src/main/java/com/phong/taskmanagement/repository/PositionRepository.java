package com.phong.taskmanagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.phong.taskmanagement.entity.Position;

public interface PositionRepository
        extends JpaRepository<Position, Long> {

    Page<Position> findByNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );
}