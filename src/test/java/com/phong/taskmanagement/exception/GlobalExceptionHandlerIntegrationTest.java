package com.phong.taskmanagement.exception;

import com.phong.taskmanagement.controller.ProjectController;
import com.phong.taskmanagement.service.interfaces.ProjectService;
import com.phong.taskmanagement.security.JwtService;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ProjectController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for pure MVC exception testing
public class GlobalExceptionHandlerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserDetailsService userDetailsService;

    @Test
    @WithMockUser
    void deleteProject_WhenDataIntegrityViolation_ShouldReturn400() throws Exception {
        // Arrange
        String errorMessage = "Cannot delete project because dependent tasks exist.";
        doThrow(new DataIntegrityViolationException(errorMessage))
                .when(projectService).deleteProject(anyLong());

        // Act & Assert
        mockMvc.perform(delete("/api/projects/1")
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(errorMessage));
    }

    @Test
    @WithMockUser
    void deleteProject_WhenResourceNotFound_ShouldReturn404() throws Exception {
        // Arrange
        doThrow(new ResourceNotFoundException("Project not found"))
                .when(projectService).deleteProject(anyLong());

        // Act & Assert
        mockMvc.perform(delete("/api/projects/999")
                        .with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Project not found"));
    }
}
