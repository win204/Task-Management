package com.phong.taskmanagement.service.interfaces;

import java.util.List;

import org.springframework.data.domain.Page;

import com.phong.taskmanagement.dto.request.CreatePositionRequest;
import com.phong.taskmanagement.domain.entity.Position;

public interface PositionService {

    Position createPosition(
            CreatePositionRequest request
    );

    List<Position> getAllPositions();

    Position getPositionById(Long id);

    void deletePosition(Long id);

    Position updatePosition(
            Long id,
            CreatePositionRequest request
    );

    Page<Position> searchPositions(
            String keyword,
            int page,
            int size
    );

    Page<Position> getPositionsWithPaging(
            int page,
            int size
    );
}
