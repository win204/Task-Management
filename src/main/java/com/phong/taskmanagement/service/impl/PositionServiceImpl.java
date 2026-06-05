package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.dto.request.CreatePositionRequest;
import com.phong.taskmanagement.entity.Position;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.repository.PositionRepository;
import com.phong.taskmanagement.service.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PositionServiceImpl implements PositionService {

    private final PositionRepository positionRepository;

    @Override
    public Position createPosition(CreatePositionRequest request) {

        Position position = Position.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        return positionRepository.save(position);
    }

    @Override
    public List<Position> getAllPositions() {
        return positionRepository.findAll();
    }

    @Override
    public Position getPositionById(Long id) {
        return positionRepository.findById(id)
                .orElseThrow();
    }

    @Override
    public void deletePosition(Long id) {
        positionRepository.deleteById(id);
    }

    @Override
    public Position updatePosition(Long id, CreatePositionRequest request) {

        Position position = positionRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException("Position not found"));

        position.setName(request.getName());
        position.setDescription(request.getDescription());

        return positionRepository.save(position);
    }
}
