package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.entity.Project;
import com.phong.taskmanagement.entity.Task;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.repository.ProjectRepository;
import com.phong.taskmanagement.repository.TaskRepository;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.service.ExportService;
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

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

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
