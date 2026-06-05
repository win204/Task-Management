package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.dto.request.CreatePositionRequest;
import com.phong.taskmanagement.entity.Position;
import com.phong.taskmanagement.service.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;

    @PostMapping
    public Position createPosition(@RequestBody CreatePositionRequest request) {
        return positionService.createPosition(request);
    }

    @GetMapping
    public List<Position> getAllPositions() {
        return positionService.getAllPositions();
    }

    @GetMapping("/{id}")
    public Position getPositionById(@PathVariable Long id) {
        return positionService.getPositionById(id);
    }

    @DeleteMapping("/{id}")
    public void deletePosition(@PathVariable Long id) {
        positionService.deletePosition(id);
    }

    @PutMapping("/{id}")
    public Position updatePosition(
            @PathVariable Long id,
            @RequestBody CreatePositionRequest request) {

        return positionService.updatePosition(id, request);
    }
}
