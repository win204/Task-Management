package com.phong.taskmanagement.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.phong.taskmanagement.dto.request.CreatePositionRequest;
import com.phong.taskmanagement.common.response.ApiResponse;
import com.phong.taskmanagement.domain.entity.Position;
import com.phong.taskmanagement.service.interfaces.PositionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/positions")
@RequiredArgsConstructor
@Tag(
        name = "Position API",
        description = "APIs for managing positions"
)
public class PositionController {

    private final PositionService positionService;

    @Operation(
            summary = "Create new position",
            description = "Create a new position"
    )
    @PostMapping
    public ApiResponse<Position> createPosition(
            @RequestBody CreatePositionRequest request) {

        Position response = positionService.createPosition(request);
        return ApiResponse.success(response, "Position created successfully");
    }

    @Operation(
            summary = "Get all positions",
            description = "Retrieve all positions"
    )
    @GetMapping
    public ApiResponse<List<Position>> getAllPositions() {

        List<Position> response = positionService.getAllPositions();
        return ApiResponse.success(response, "Positions retrieved successfully");
    }

    @Operation(
            summary = "Get position by id",
            description = "Retrieve a position by id"
    )
    @GetMapping("/{id}")
    public ApiResponse<Position> getPositionById(
            @PathVariable Long id) {

        Position response = positionService.getPositionById(id);
        return ApiResponse.success(response, "Position retrieved successfully");
    }

    @Operation(
            summary = "Search positions",
            description = "Search positions by keyword with pagination"
    )
    @GetMapping("/search")
    public ApiResponse<Page<Position>> searchPositions(

            @RequestParam String keyword,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        Page<Position> response = positionService.searchPositions(
                keyword,
                page,
                size
        );
        return ApiResponse.success(response, "Positions searched successfully");
    }

    @Operation(
            summary = "Get positions with pagination",
            description = "Retrieve positions with pagination"
    )
    @GetMapping("/paging")
    public ApiResponse<Page<Position>> getPositionsWithPaging(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        Page<Position> response = positionService.getPositionsWithPaging(
                page,
                size
        );
        return ApiResponse.success(response, "Positions retrieved with pagination successfully");
    }

    @Operation(
            summary = "Delete position",
            description = "Delete a position by id"
    )
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deletePosition(
            @PathVariable Long id) {

        positionService.deletePosition(id);
        return ApiResponse.success(null, "Position deleted successfully");
    }

    @Operation(
            summary = "Update position",
            description = "Update position information"
    )
    @PutMapping("/{id}")
    public ApiResponse<Position> updatePosition(
            @PathVariable Long id,
            @RequestBody CreatePositionRequest request) {

        Position response = positionService.updatePosition(
                id,
                request
        );
        return ApiResponse.success(response, "Position updated successfully");
    }
}
