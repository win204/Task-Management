package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.entity.Project;
import com.phong.taskmanagement.entity.Task;
import com.phong.taskmanagement.entity.User;
import com.phong.taskmanagement.repository.ProjectRepository;
import com.phong.taskmanagement.repository.TaskRepository;
import com.phong.taskmanagement.repository.UserRepository;
import com.phong.taskmanagement.service.ExportPdfService;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportPdfServiceImpl implements ExportPdfService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public byte[] exportUsersToPdf() {
        List<User> users = userRepository.findAll();
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph title = new Paragraph("Users Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);

            addTableHeader(table, new String[]{"Id","Username","Full Name","Email","Phone","Active","Created Date"});

            for (User u : users) {
                table.addCell(safeText(u.getId()));
                table.addCell(safeText(u.getUsername()));
                table.addCell(safeText(u.getFullName()));
                table.addCell(safeText(u.getEmail()));
                table.addCell(safeText(u.getPhone()));
                table.addCell(safeText(u.getActive()));
                table.addCell(u.getCreatedAt() != null ? u.getCreatedAt().format(DATE_TIME_FORMATTER) : "");
            }

            document.add(table);
            document.close();
            return baos.toByteArray();
        } catch (Exception ex) {
            throw new RuntimeException("Failed to export users to PDF", ex);
        }
    }

    @Override
    public byte[] exportTasksToPdf() {
        List<Task> tasks = taskRepository.findAll();
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph title = new Paragraph("Tasks Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);

            addTableHeader(table, new String[]{"Id","Title","Status","Priority","Project Name","Assignee Name","Due Date"});

            for (Task t : tasks) {
                table.addCell(safeText(t.getId()));
                table.addCell(safeText(t.getTitle()));
                table.addCell(safeText(t.getStatus()));
                table.addCell(safeText(t.getPriority()));

                Project p = t.getProject();
                table.addCell(p != null ? safeText(p.getProjectName()) : "");

                User a = t.getAssignee();
                table.addCell(a != null ? safeText(a.getFullName() != null ? a.getFullName() : a.getUsername()) : "");

                table.addCell(t.getDueDate() != null ? t.getDueDate().format(DATE_FORMATTER) : "");
            }

            document.add(table);
            document.close();
            return baos.toByteArray();
        } catch (Exception ex) {
            throw new RuntimeException("Failed to export tasks to PDF", ex);
        }
    }

    @Override
    public byte[] exportProjectsToPdf() {
        List<Project> projects = projectRepository.findAll();
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph title = new Paragraph("Projects Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);

            addTableHeader(table, new String[]{"Id","Project Code","Project Name","Status","Start Date","End Date"});

            for (Project p : projects) {
                table.addCell(safeText(p.getId()));
                table.addCell(safeText(p.getProjectCode()));
                table.addCell(safeText(p.getProjectName()));
                table.addCell(safeText(p.getStatus()));
                table.addCell(p.getStartDate() != null ? p.getStartDate().format(DATE_FORMATTER) : "");
                table.addCell(p.getEndDate() != null ? p.getEndDate().format(DATE_FORMATTER) : "");
            }

            document.add(table);
            document.close();
            return baos.toByteArray();
        } catch (Exception ex) {
            throw new RuntimeException("Failed to export projects to PDF", ex);
        }
    }

    private void addTableHeader(PdfPTable table, String[] headers) {
        Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
    }

    private String safeText(Object o) {
        return o == null ? "" : String.valueOf(o);
    }
}
