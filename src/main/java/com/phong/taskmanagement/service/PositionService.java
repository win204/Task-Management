package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.request.CreatePositionRequest;
import com.phong.taskmanagement.entity.Position;

import java.util.List;

public interface PositionService {

    Position createPosition(CreatePositionRequest request);

    List<Position> getAllPositions();

    Position getPositionById(Long id);

    void deletePosition(Long id);

    Position updatePosition(Long id, CreatePositionRequest request);
}