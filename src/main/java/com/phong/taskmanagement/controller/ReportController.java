package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(
        name = "Report Export API",
        description = "APIs for exporting task reports as Excel and PDF"
)
public class ReportController {

    private final ReportService reportService;

    @Operation(
            summary = "Export tasks to Excel",
            description = "Download all tasks as an Excel spreadsheet"
    )
    @GetMapping(value = "/tasks/excel", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<InputStreamResource> exportTasksToExcel() {

        InputStreamResource resource = new InputStreamResource(
                reportService.exportTasksToExcel()
        );

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename("tasks.xlsx")
                                .build()
                                .toString()
                )
                .body(resource);
    }

    @Operation(
            summary = "Export tasks to PDF",
            description = "Download all tasks as a PDF report"
    )
    @GetMapping(value = "/tasks/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> exportTasksToPdf() {

        InputStreamResource resource = new InputStreamResource(
                reportService.exportTasksToPdf()
        );

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename("tasks.pdf")
                                .build()
                                .toString()
                )
                .body(resource);
    }
}
