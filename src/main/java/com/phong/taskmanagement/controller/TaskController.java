package com.phong.taskmanagement.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import com.phong.taskmanagement.dto.request.CreateTaskRequest;
import com.phong.taskmanagement.dto.request.TaskSearchRequest;
import com.phong.taskmanagement.dto.request.UpdateTaskStatusRequest;
import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.dto.response.TaskResponse;
import com.phong.taskmanagement.service.TaskService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(
        name = "Task API",
        description = "APIs for managing tasks"
)
public class TaskController {

    private final TaskService taskService;

    @Operation(
            summary = "Create new task",
            description = "Create a new task"
    )
    @PostMapping
    public ApiResponse<TaskResponse> createTask(
            @RequestBody CreateTaskRequest request) {

        TaskResponse response = taskService.createTask(request);
        response.add(linkTo(methodOn(TaskController.class).getTaskById(response.getId())).withSelfRel());
        return ApiResponse.success(response, "Task created successfully");
    }

    @Operation(
            summary = "Get all tasks",
            description = "Retrieve all tasks"
    )
    @GetMapping
    public ApiResponse<List<TaskResponse>> getAllTasks() {

        List<TaskResponse> response = taskService.getAllTasks();
        response.forEach(task -> task.add(linkTo(methodOn(TaskController.class).getTaskById(task.getId())).withSelfRel()));
        return ApiResponse.success(response, "Tasks retrieved successfully");
    }

    @Operation(
            summary = "Get task by id",
            description = "Retrieve a task by id"
    )
    @GetMapping("/{id}")
    public ApiResponse<TaskResponse> getTaskById(
            @PathVariable Long id) {

        TaskResponse response = taskService.getTaskById(id);
        response.add(linkTo(methodOn(TaskController.class).getTaskById(id)).withSelfRel());
        response.add(linkTo(methodOn(TaskController.class).getAllTasks()).withRel("tasks"));
        return ApiResponse.success(response, "Task retrieved successfully");
    }

    @Operation(
            summary = "Search tasks",
            description = "Search tasks by keyword with pagination"
    )
    @GetMapping("/search")
    public ApiResponse<Page<TaskResponse>> searchTasks(

            @RequestParam String keyword,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        Page<TaskResponse> response = taskService.searchTasks(
                keyword,
                page,
                size
        );
        response.forEach(task -> task.add(linkTo(methodOn(TaskController.class).getTaskById(task.getId())).withSelfRel()));
        return ApiResponse.success(response, "Tasks searched successfully");
    }

    @Operation(
            summary = "Advanced task search",
            description = "Search tasks using dynamic filters and pagination"
    )
    @PostMapping("/advanced-search")
    public ApiResponse<Page<TaskResponse>> advancedSearchTasks(

            @RequestBody TaskSearchRequest request,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        Page<TaskResponse> response = taskService.searchTasks(
                request,
                page,
                size
        );
        response.forEach(task -> task.add(linkTo(methodOn(TaskController.class).getTaskById(task.getId())).withSelfRel()));
        return ApiResponse.success(response, "Advanced task search completed successfully");
    }

    @Operation(
            summary = "Get tasks by status",
            description = "Retrieve tasks filtered by status with pagination"
    )
    @GetMapping("/status")
    public ApiResponse<Page<TaskResponse>> getTasksByStatus(

            @RequestParam String status,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        Page<TaskResponse> response = taskService.getTasksByStatus(
                status,
                page,
                size
        );
        response.forEach(task -> task.add(linkTo(methodOn(TaskController.class).getTaskById(task.getId())).withSelfRel()));
        return ApiResponse.success(response, "Tasks filtered by status successfully");
    }

    @Operation(
            summary = "Get tasks by priority",
            description = "Retrieve tasks filtered by priority with pagination"
    )
    @GetMapping("/priority")
    public ApiResponse<Page<TaskResponse>> getTasksByPriority(

            @RequestParam String priority,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        Page<TaskResponse> response = taskService.getTasksByPriority(
                priority,
                page,
                size
        );
        response.forEach(task -> task.add(linkTo(methodOn(TaskController.class).getTaskById(task.getId())).withSelfRel()));
        return ApiResponse.success(response, "Tasks filtered by priority successfully");
    }

    @Operation(
            summary = "Get tasks with pagination",
            description = "Retrieve tasks with pagination"
    )
    @GetMapping("/paging")
    public ApiResponse<Page<TaskResponse>> getTasksWithPaging(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        Page<TaskResponse> response = taskService.getTasksWithPaging(
                page,
                size
        );
        response.forEach(task -> task.add(linkTo(methodOn(TaskController.class).getTaskById(task.getId())).withSelfRel()));
        return ApiResponse.success(response, "Tasks retrieved with pagination successfully");
    }

    @Operation(
            summary = "Update task",
            description = "Update task information"
    )
    @PutMapping("/{id}")
    public ApiResponse<TaskResponse> updateTask(
            @PathVariable Long id,
            @RequestBody CreateTaskRequest request) {

        TaskResponse response = taskService.updateTask(
                id,
                request
        );
        response.add(linkTo(methodOn(TaskController.class).getTaskById(id)).withSelfRel());
        return ApiResponse.success(response, "Task updated successfully");
    }

    @Operation(
            summary = "Update task status",
            description = "Update the status of a task using a dedicated DTO (Optimized for Kanban)"
    )
    @PatchMapping("/{id}/status")
    public ApiResponse<TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody UpdateTaskStatusRequest request) {

        TaskResponse response = taskService.updateTaskStatus(
                id,
                request
        );
        response.add(linkTo(methodOn(TaskController.class).getTaskById(id)).withSelfRel());
        return ApiResponse.success(response, "Task status updated successfully");
    }

    @Operation(
            summary = "Delete task",
            description = "Delete a task by id"
    )
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTask(
            @PathVariable Long id) {

        taskService.deleteTask(id);
        return ApiResponse.success(null, "Task deleted successfully");
    }
}