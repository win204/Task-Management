package com.phong.taskmanagement.service.impl;

import com.querydsl.core.BooleanBuilder;
import com.phong.taskmanagement.domain.entity.QTask;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.phong.taskmanagement.dto.request.CreateTaskRequest;
import com.phong.taskmanagement.dto.request.TaskSearchRequest;
import com.phong.taskmanagement.dto.request.UpdateTaskStatusRequest;
import com.phong.taskmanagement.dto.response.TaskResponse;
import com.phong.taskmanagement.domain.entity.Project;
import com.phong.taskmanagement.domain.entity.Task;
import com.phong.taskmanagement.domain.entity.User;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.domain.repository.ProjectRepository;
import com.phong.taskmanagement.domain.repository.TaskRepository;
import com.phong.taskmanagement.domain.repository.UserRepository;
import com.phong.taskmanagement.domain.repository.ActivityLogRepository;
import org.springframework.dao.DataIntegrityViolationException;
import com.phong.taskmanagement.service.interfaces.ActivityLogService;
import com.phong.taskmanagement.service.interfaces.EmailService;
import com.phong.taskmanagement.service.interfaces.NotificationService;
import com.phong.taskmanagement.service.interfaces.RealTimeUpdateService;
import com.phong.taskmanagement.service.interfaces.TaskService;

import lombok.RequiredArgsConstructor;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final ActivityLogService activityLogService;
    private final NotificationService notificationService;
    private final RealTimeUpdateService realTimeUpdateService;
    private final EmailService emailService;

    private TaskResponse mapToResponse(Task task) {

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority() != null ? task.getPriority() : "MEDIUM")
                .status(task.getStatus() != null ? task.getStatus() : "TODO")
                .startDate(task.getStartDate())
                .dueDate(task.getDueDate())
                .projectName(
                        task.getProject() != null
                        ? task.getProject().getProjectName()
                        : null
                )
                .assigneeName(
                        task.getAssignee() != null
                        ? task.getAssignee().getFullName()
                        : "Unassigned"
                )
                .build();
    }

    @Override
    public TaskResponse createTask(
            CreateTaskRequest request) {

        Project project = projectRepository
                .findById(request.getProjectId())
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Project not found"
                ));

        User assignee = userRepository
                .findById(request.getAssigneeId())
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "User not found"
                ));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(request.getStatus())
                .startDate(request.getStartDate())
                .dueDate(request.getDueDate())
                .project(project)
                .assignee(assignee)
                .build();

        Task savedTask = taskRepository.save(task);

        activityLogService.log(
                assignee.getId(),
                savedTask.getId(),
                "CREATE_TASK",
                "Created task: " + savedTask.getTitle()
        );

        // Create notification for assignee
        notificationService.createNotification(
                assignee.getId(),
                "New Task Assigned",
                "You have been assigned task: " + savedTask.getTitle(),
                "TASK_ASSIGN",
                savedTask.getId()
        );

        // Send task assignment email
        emailService.sendTaskAssignedEmail(savedTask);

        TaskResponse response = mapToResponse(savedTask);
        realTimeUpdateService.broadcastTaskUpdate(response);
        realTimeUpdateService.broadcastDashboardUpdate("TASK_CREATED");
        
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public List<TaskResponse> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        System.out.println("TASK ENTITY SIZE = " + tasks.size());

        List<TaskResponse> dtoList = tasks.stream()
                .map(this::mapToResponse)
                .toList();
        
        System.out.println("TASK DTO SIZE = " + dtoList.size());
        
        return dtoList;
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER') or (hasRole('EMPLOYEE') and @taskServiceImpl.isTaskOwner(#id))")
    public TaskResponse getTaskById(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Task not found"
                ));

        return mapToResponse(task);
    }

    @Override
    public void deleteTask(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Task not found"
                ));

        activityLogRepository.deleteByTaskId(id);
        taskRepository.delete(task);
        realTimeUpdateService.broadcastTaskUpdate("DELETED_" + id);
        realTimeUpdateService.broadcastDashboardUpdate("TASK_DELETED");
    }

    @Override
    public TaskResponse updateTask(
            Long id,
            CreateTaskRequest request) {

        Task task = taskRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Task not found"
                ));

        // capture old values for notifications
        User oldAssignee = task.getAssignee();
        String oldStatus = task.getStatus();

        Project project = projectRepository
                .findById(request.getProjectId())
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Project not found"
                ));

        User assignee = userRepository
                .findById(request.getAssigneeId())
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "User not found"
                ));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setStartDate(request.getStartDate());
        task.setDueDate(request.getDueDate());
        task.setProject(project);
        task.setAssignee(assignee);

        Task savedTask = taskRepository.save(task);

        activityLogService.log(
                assignee.getId(),
                savedTask.getId(),
                "UPDATE_TASK",
                "Updated task: " + savedTask.getTitle()
        );

        // Notify if assignee changed
        if (oldAssignee == null || !oldAssignee.getId().equals(assignee.getId())) {
            notificationService.createNotification(
                    assignee.getId(),
                    "Task Assigned",
                    "You have been assigned task: " + savedTask.getTitle(),
                    "TASK_ASSIGN",
                    savedTask.getId()
            );
            
            // Send task assignment email for the new assignee
            emailService.sendTaskAssignedEmail(savedTask);
        }

        // Notify if status changed
        if (oldStatus == null || !oldStatus.equals(savedTask.getStatus())) {
            Long notifyUserId = savedTask.getAssignee() != null ? savedTask.getAssignee().getId() : null;
            if (notifyUserId != null) {
                notificationService.createNotification(
                        notifyUserId,
                        "Task Status Updated",
                        "Status for task '" + savedTask.getTitle() + "' changed to " + savedTask.getStatus(),
                        "TASK_STATUS",
                        savedTask.getId()
                );
            }
        }

        TaskResponse response = mapToResponse(savedTask);
        realTimeUpdateService.broadcastTaskUpdate(response);
        realTimeUpdateService.broadcastDashboardUpdate("TASK_UPDATED");
        return response;
    }

    @Override
    public TaskResponse updateTaskStatus(
            Long id,
            UpdateTaskStatusRequest request) {

        Task task = taskRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException(
                        "Task not found"
                ));

        String oldStatus = task.getStatus();
        String newStatus = request.getStatus().name();

        task.setStatus(newStatus);
        Task savedTask = taskRepository.save(task);

        Long actorId = (savedTask.getAssignee() != null) ? savedTask.getAssignee().getId() : 0L;

        activityLogService.log(
                actorId,
                savedTask.getId(),
                "UPDATE_TASK_STATUS",
                "Updated task status from " + oldStatus + " to " + newStatus
        );

        if (oldStatus == null || !oldStatus.equals(newStatus)) {
            Long notifyUserId = savedTask.getAssignee() != null ? savedTask.getAssignee().getId() : null;
            
            boolean isJustCompleted = !"DONE".equals(oldStatus) && "DONE".equals(newStatus);
            
            if (notifyUserId != null) {
                if (isJustCompleted) {
                    notificationService.createNotification(
                            notifyUserId,
                            "Task Completed",
                            "Task '" + savedTask.getTitle() + "' has been successfully completed.",
                            "TASK_COMPLETED",
                            savedTask.getId()
                    );
                } else {
                    notificationService.createNotification(
                            notifyUserId,
                            "Task Status Updated",
                            "Status for task '" + savedTask.getTitle() + "' changed to " + newStatus,
                            "TASK_STATUS",
                            savedTask.getId()
                    );
                }
            }
            
            // Phase 3: Task Completion Email
            if (isJustCompleted) {
                emailService.sendTaskCompletedEmail(savedTask);
            }
        }

        TaskResponse response = mapToResponse(savedTask);
        realTimeUpdateService.broadcastTaskUpdate(response);
        realTimeUpdateService.broadcastDashboardUpdate("TASK_STATUS_UPDATED");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> searchTasks(
            String keyword,
            int page,
            int size) {

        Pageable pageable
                = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("id").descending());

        QTask qTask = QTask.task;
        BooleanBuilder builder = new BooleanBuilder();

        if (keyword != null && !keyword.trim().isEmpty()) {
            builder.and(qTask.title.containsIgnoreCase(keyword)
                    .or(qTask.description.containsIgnoreCase(keyword)));
        }

        return taskRepository.findAll(builder, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> searchTasks(
            TaskSearchRequest request,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("id").descending());

        return taskRepository
                .searchTasks(request, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksByStatus(
            String status,
            int page,
            int size) {

        Pageable pageable
                = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("id").descending());

        return taskRepository
                .findByStatus(status, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksByPriority(
            String priority,
            int page,
            int size) {

        Pageable pageable
                = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("id").descending());

        return taskRepository
                .findByPriority(priority, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksWithPaging(
            int page,
            int size) {

        Pageable pageable
                = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("id").descending());

        return taskRepository
                .findAll(pageable)
                .map(this::mapToResponse);
    }

    public boolean isTaskOwner(Long taskId) {
        String username = getCurrentUsername();
        return taskRepository.findById(taskId)
                .map(task -> task.getAssignee() != null
                        && username.equals(task.getAssignee().getUsername()))
                .orElse(false);
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            return null;
        }

        return authentication.getName();
    }
}
