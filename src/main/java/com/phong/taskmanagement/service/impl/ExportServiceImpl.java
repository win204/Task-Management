package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.domain.entity.Project;
import com.phong.taskmanagement.domain.entity.Task;
import com.phong.taskmanagement.domain.entity.User;
import com.phong.taskmanagement.domain.entity.ActivityLog;
import com.phong.taskmanagement.domain.repository.ProjectRepository;
import com.phong.taskmanagement.domain.repository.TaskRepository;
import com.phong.taskmanagement.domain.repository.UserRepository;
import com.phong.taskmanagement.domain.repository.ActivityLogRepository;
import com.phong.taskmanagement.service.interfaces.ActivityLogService;
import com.phong.taskmanagement.service.interfaces.ExportService;
import com.phong.taskmanagement.service.interfaces.DashboardService;
import com.phong.taskmanagement.dto.response.DashboardResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportServiceImpl implements ExportService {

    private static final String[] USER_HEADERS = {
            "Id",
            "Username",
            "Full Name",
            "Email",
            "Phone",
            "Active",
            "Created At"
    };

    private static final String[] TASK_HEADERS = {
            "Id",
            "Title",
            "Status",
            "Priority",
            "Project Name",
            "Assignee Name",
            "Due Date"
    };

    private static final String[] PROJECT_HEADERS = {
            "Id",
            "Project Code",
            "Project Name",
            "Status",
            "Start Date",
            "End Date"
    };

    private static final String[] ACTIVITY_LOG_HEADERS = {
            "Id",
            "Time",
            "Username",
            "Module",
            "Action",
            "Description"
    };

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ActivityLogRepository activityLogRepository;
    private final ActivityLogService activityLogService;
    private final DashboardService dashboardService;

    @Override
    @Transactional(readOnly = true)
    public byte[] exportUsersToExcel() {

        List<User> users = userRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Users");
            CellStyle headerStyle = createHeaderStyle(workbook);

            createHeader(sheet, USER_HEADERS, headerStyle);

            int rowIndex = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowIndex++);

                writeCell(row, 0, user.getId());
                writeCell(row, 1, user.getUsername());
                writeCell(row, 2, user.getFullName());
                writeCell(row, 3, user.getEmail());
                writeCell(row, 4, user.getPhone());
                writeCell(row, 5, user.getActive());
                writeCell(row, 6, user.getCreatedAt());
            }

            autoSizeColumns(sheet, USER_HEADERS.length);
            return writeWorkbook(workbook);
        } catch (IOException ex) {
            throw new IllegalStateException(
                    "Could not export users to Excel",
                    ex
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportTasksToExcel() {

        List<Task> tasks = taskRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Tasks");
            CellStyle headerStyle = createHeaderStyle(workbook);

            createHeader(sheet, TASK_HEADERS, headerStyle);

            int rowIndex = 1;
            for (Task task : tasks) {
                Row row = sheet.createRow(rowIndex++);

                Project project = task.getProject();
                User assignee = task.getAssignee();

                writeCell(row, 0, task.getId());
                writeCell(row, 1, task.getTitle());
                writeCell(row, 2, task.getStatus());
                writeCell(row, 3, task.getPriority());
                writeCell(
                        row,
                        4,
                        project != null
                                ? project.getProjectName()
                                : null
                );
                writeCell(
                        row,
                        5,
                        assignee != null
                                ? assignee.getFullName()
                                : null
                );
                writeCell(row, 6, task.getDueDate());
            }

            autoSizeColumns(sheet, TASK_HEADERS.length);
            return writeWorkbook(workbook);
        } catch (IOException ex) {
            throw new IllegalStateException(
                    "Could not export tasks to Excel",
                    ex
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportProjectsToExcel() {

        List<Project> projects = projectRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Projects");
            CellStyle headerStyle = createHeaderStyle(workbook);

            createHeader(sheet, PROJECT_HEADERS, headerStyle);

            int rowIndex = 1;
            for (Project project : projects) {
                Row row = sheet.createRow(rowIndex++);

                writeCell(row, 0, project.getId());
                writeCell(row, 1, project.getProjectCode());
                writeCell(row, 2, project.getProjectName());
                writeCell(row, 3, project.getStatus());
                writeCell(row, 4, project.getStartDate());
                writeCell(row, 5, project.getEndDate());
            }

            autoSizeColumns(sheet, PROJECT_HEADERS.length);
            return writeWorkbook(workbook);
        } catch (IOException ex) {
            throw new IllegalStateException(
                    "Could not export projects to Excel",
                    ex
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportActivityLogsToExcel(
            String username,
            String module,
            String action,
            String result,
            String ipAddress,
            String startDate,
            String endDate) {

        List<com.phong.taskmanagement.dto.response.ActivityLogResponse> logs = activityLogService.searchLogs(
                username, module, action, result, ipAddress, startDate, endDate, org.springframework.data.domain.Pageable.unpaged()
        ).getContent();

        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Activity Logs");
            CellStyle headerStyle = createHeaderStyle(workbook);

            createHeader(sheet, ACTIVITY_LOG_HEADERS, headerStyle);

            int rowIndex = 1;
            for (com.phong.taskmanagement.dto.response.ActivityLogResponse log : logs) {
                Row row = sheet.createRow(rowIndex++);

                writeCell(row, 0, log.getId());
                writeCell(row, 1, log.getCreatedAt());
                writeCell(row, 2, log.getUsername() != null ? log.getUsername() : "system");
                writeCell(row, 3, log.getModule());
                writeCell(row, 4, log.getAction());
                writeCell(row, 5, log.getDescription());
            }

            autoSizeColumns(sheet, ACTIVITY_LOG_HEADERS.length);
            return writeWorkbook(workbook);
        } catch (IOException ex) {
            throw new IllegalStateException(
                    "Could not export activity logs to Excel",
                    ex
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportDashboardToExcel() {
        DashboardResponse stats = dashboardService.getDashboardStatistics();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Dashboard Statistics");
            CellStyle headerStyle = createHeaderStyle(workbook);

            Row headerRow = sheet.createRow(0);
            Cell cell0 = headerRow.createCell(0);
            cell0.setCellValue("Metric");
            cell0.setCellStyle(headerStyle);

            Cell cell1 = headerRow.createCell(1);
            cell1.setCellValue("Value");
            cell1.setCellStyle(headerStyle);

            int rowIndex = 1;

            Row r1 = sheet.createRow(rowIndex++);
            writeCell(r1, 0, "Total Users");
            writeCell(r1, 1, stats.getTotalUsers());

            Row r2 = sheet.createRow(rowIndex++);
            writeCell(r2, 0, "Total Projects");
            writeCell(r2, 1, stats.getTotalProjects());

            Row r3 = sheet.createRow(rowIndex++);
            writeCell(r3, 0, "Total Tasks");
            writeCell(r3, 1, stats.getTotalTasks());

            Row r4 = sheet.createRow(rowIndex++);
            writeCell(r4, 0, "Completed Tasks");
            writeCell(r4, 1, stats.getCompletedTasks());

            Row r5 = sheet.createRow(rowIndex++);
            writeCell(r5, 0, "Todo Tasks");
            writeCell(r5, 1, stats.getTodoTasks());

            Row r6 = sheet.createRow(rowIndex++);
            writeCell(r6, 0, "In Progress Tasks");
            writeCell(r6, 1, stats.getInProgressTasks());

            autoSizeColumns(sheet, 2);
            return writeWorkbook(workbook);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not export dashboard to Excel", ex);
        }
    }

    private void createHeader(
            Sheet sheet,
            String[] headers,
            CellStyle headerStyle) {

        Row headerRow = sheet.createRow(0);

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {

        Font font = workbook.createFont();
        font.setBold(true);

        CellStyle style = workbook.createCellStyle();
        style.setFont(font);

        return style;
    }

    private void writeCell(
            Row row,
            int column,
            Object value) {

        Cell cell = row.createCell(column);

        if (value == null) {
            cell.setBlank();
            return;
        }

        if (value instanceof Number number) {
            cell.setCellValue(number.doubleValue());
            return;
        }

        if (value instanceof Boolean bool) {
            cell.setCellValue(bool);
            return;
        }

        if (value instanceof LocalDate date) {
            cell.setCellValue(date.toString());
            return;
        }

        if (value instanceof LocalDateTime dateTime) {
            cell.setCellValue(dateTime.toString());
            return;
        }

        cell.setCellValue(value.toString());
    }

    private void autoSizeColumns(
            Sheet sheet,
            int numberOfColumns) {

        for (int i = 0; i < numberOfColumns; i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private byte[] writeWorkbook(Workbook workbook)
            throws IOException {

        try (ByteArrayOutputStream outputStream =
                     new ByteArrayOutputStream()) {

            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }
}
