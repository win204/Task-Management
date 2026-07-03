package com.phong.taskmanagement.service;

import com.phong.taskmanagement.domain.repository.ProjectRepository;
import com.phong.taskmanagement.domain.repository.TaskRepository;
import com.phong.taskmanagement.service.impl.ProjectServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.phong.taskmanagement.domain.repository.ActivityLogRepository;
import com.phong.taskmanagement.service.interfaces.RealTimeUpdateService;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceImplTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ActivityLogRepository activityLogRepository;

    @Mock
    private RealTimeUpdateService realTimeUpdateService;

    @InjectMocks
    private ProjectServiceImpl projectService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void deleteProject_ShouldCascadeDelete_ActivityLogsAndTasks() {
        // Arrange
        Long projectId = 1L;
        when(projectRepository.existsById(projectId)).thenReturn(true);

        // Act
        projectService.deleteProject(projectId);

        // Assert
        verify(activityLogRepository, times(1)).deleteByTaskProjectId(projectId);
        verify(taskRepository, times(1)).deleteByProjectId(projectId);
        verify(projectRepository, times(1)).deleteById(projectId);
    }
}
