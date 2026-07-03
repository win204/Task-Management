package com.phong.taskmanagement.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.phong.taskmanagement.dto.request.CreatePositionRequest;
import com.phong.taskmanagement.domain.entity.Position;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.domain.repository.PositionRepository;
import com.phong.taskmanagement.service.interfaces.PositionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PositionServiceImpl
        implements PositionService {

    private final PositionRepository positionRepository;

    @Override
    public Position createPosition(
            CreatePositionRequest request) {

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
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Position not found"
                        ));
    }

    @Override
    public void deletePosition(Long id) {

        if (!positionRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Position not found"
            );
        }

        positionRepository.deleteById(id);
    }

    @Override
    public Position updatePosition(
            Long id,
            CreatePositionRequest request) {

        Position position = getPositionById(id);

        position.setName(request.getName());
        position.setDescription(
                request.getDescription()
        );

        return positionRepository.save(position);
    }

    @Override
    public Page<Position> searchPositions(
            String keyword,
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(page, size);

        return positionRepository
                .findByNameContainingIgnoreCase(
                        keyword,
                        pageable
                );
    }

    @Override
    public Page<Position> getPositionsWithPaging(
            int page,
            int size) {

        Pageable pageable =
                PageRequest.of(page, size);

        return positionRepository.findAll(
                pageable
        );
    }
}
