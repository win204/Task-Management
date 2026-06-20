package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Report API", description = "APIs for exporting reports")
public class ReportController {

    private final ReportService reportService;

    @Operation(summary = "Export tasks to Excel")
    @GetMapping("/tasks/excel")
    public ResponseEntity<InputStreamResource> exportTasksToExcel() {
        ByteArrayInputStream in = reportService.exportTasksToExcel();
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=tasks_report.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @Operation(summary = "Export projects to Excel")
    @GetMapping("/projects/excel")
    public ResponseEntity<InputStreamResource> exportProjectsToExcel() {
        ByteArrayInputStream in = reportService.exportProjectsToExcel();
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=projects_report.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @Operation(summary = "Export users to Excel")
    @GetMapping("/users/excel")
    public ResponseEntity<InputStreamResource> exportUsersToExcel() {
        ByteArrayInputStream in = reportService.exportUsersToExcel();
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=users_report.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @Operation(summary = "Export tasks to PDF")
    @GetMapping("/tasks/pdf")
    public ResponseEntity<InputStreamResource> exportTasksToPdf() {
        ByteArrayInputStream in = reportService.exportTasksToPdf();
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=tasks_report.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }
}
