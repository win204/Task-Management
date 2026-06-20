package com.phong.taskmanagement.service.impl;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.phong.taskmanagement.entity.Project;
import com.phong.taskmanagement.entity.Task;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.repository.ProjectRepository;
import com.phong.taskmanagement.repository.TaskRepository;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public ByteArrayInputStream exportTasksToExcel() {
        List<Task> tasks = taskRepository.findAll();
        try (Workbook workbook = new SXSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Tasks");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Title", "Status", "Priority", "Project", "Assignee", "Due Date"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowIdx = 1;
            for (Task task : tasks) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(task.getId());
                row.createCell(1).setCellValue(task.getTitle() != null ? task.getTitle() : "");
                row.createCell(2).setCellValue(task.getStatus() != null ? task.getStatus() : "");
                row.createCell(3).setCellValue(task.getPriority() != null ? task.getPriority() : "");
                row.createCell(4).setCellValue(task.getProject() != null ? task.getProject().getProjectName() : "");
                row.createCell(5).setCellValue(task.getAssignee() != null ? task.getAssignee().getUsername() : "");
                row.createCell(6).setCellValue(task.getDueDate() != null ? task.getDueDate().toString() : "");
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to export tasks to Excel", e);
        }
    }

    @Override
    public ByteArrayInputStream exportProjectsToExcel() {
        List<Project> projects = projectRepository.findAll();
        try (Workbook workbook = new SXSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Projects");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Name", "Description", "Status"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowIdx = 1;
            for (Project project : projects) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(project.getId());
                row.createCell(1).setCellValue(project.getProjectName() != null ? project.getProjectName() : "");
                row.createCell(2).setCellValue(project.getDescription() != null ? project.getDescription() : "");
                row.createCell(3).setCellValue(project.getStatus() != null ? project.getStatus() : "");
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to export projects to Excel", e);
        }
    }

    @Override
    public ByteArrayInputStream exportUsersToExcel() {
        List<User> users = userRepository.findAll();
        try (Workbook workbook = new SXSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Users");

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Username", "Email", "Full Name", "Status"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowIdx = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getUsername() != null ? user.getUsername() : "");
                row.createCell(2).setCellValue(user.getEmail() != null ? user.getEmail() : "");
                row.createCell(3).setCellValue(user.getFullName() != null ? user.getFullName() : "");
                row.createCell(4).setCellValue(user.getActive() != null ? (user.getActive() ? "Active" : "Inactive") : "Unknown");
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to export users to Excel", e);
        }
    }

    @Override
    public ByteArrayInputStream exportTasksToPdf() {
        List<Task> tasks = taskRepository.findAll();
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Task Report", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1f, 3f, 2f, 2f, 2f, 2f, 2f});

            Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            String[] headers = {"ID", "Title", "Status", "Priority", "Project", "Assignee", "Due Date"};
            
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headFont));
                cell.setHorizontalAlignment(com.lowagie.text.Element.ALIGN_CENTER);
                cell.setBackgroundColor(new Color(220, 220, 220));
                cell.setPadding(5);
                table.addCell(cell);
            }

            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA);
            for (Task task : tasks) {
                table.addCell(new Phrase(String.valueOf(task.getId()), bodyFont));
                table.addCell(new Phrase(task.getTitle() != null ? task.getTitle() : "", bodyFont));
                table.addCell(new Phrase(task.getStatus() != null ? task.getStatus() : "", bodyFont));
                table.addCell(new Phrase(task.getPriority() != null ? task.getPriority() : "", bodyFont));
                table.addCell(new Phrase(task.getProject() != null ? task.getProject().getProjectName() : "", bodyFont));
                table.addCell(new Phrase(task.getAssignee() != null ? task.getAssignee().getUsername() : "", bodyFont));
                table.addCell(new Phrase(task.getDueDate() != null ? task.getDueDate().toString() : "", bodyFont));
            }

            document.add(table);
            document.close();
            
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to export tasks to PDF", e);
        }
    }
}
