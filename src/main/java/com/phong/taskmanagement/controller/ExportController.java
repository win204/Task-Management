package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.service.interfaces.ExportService;
import com.phong.taskmanagement.service.interfaces.ExportPdfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@Tag(
        name = "Export API",
        description = "APIs for exporting data to Excel"
)
public class ExportController {

    private static final MediaType EXCEL_MEDIA_TYPE =
            MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );

    private final ExportService exportService;
        private final ExportPdfService exportPdfService;

    @Operation(
            summary = "Export users to Excel",
            description = "Export all users to users.xlsx"
    )
    @GetMapping("/users/excel")
    public ResponseEntity<byte[]> exportUsersToExcel() {

        return buildExcelResponse(
                exportService.exportUsersToExcel(),
                "users.xlsx"
        );
    }

    @Operation(
            summary = "Export tasks to Excel",
            description = "Export all tasks to tasks.xlsx"
    )
    @GetMapping("/tasks/excel")
    public ResponseEntity<byte[]> exportTasksToExcel() {

        return buildExcelResponse(
                exportService.exportTasksToExcel(),
                "tasks.xlsx"
        );
    }

    @Operation(
            summary = "Export projects to Excel",
            description = "Export all projects to projects.xlsx"
    )
    @GetMapping("/projects/excel")
    public ResponseEntity<byte[]> exportProjectsToExcel() {

        return buildExcelResponse(
                exportService.exportProjectsToExcel(),
                "projects.xlsx"
        );
    }

    @Operation(
            summary = "Export users to PDF",
            description = "Export all users to users.pdf"
    )
    @GetMapping("/users/pdf")
    public ResponseEntity<byte[]> exportUsersToPdf() {

        return buildPdfResponse(
                exportPdfService.exportUsersToPdf(),
                "users.pdf"
        );
    }

    @Operation(
            summary = "Export tasks to PDF",
            description = "Export all tasks to tasks.pdf"
    )
    @GetMapping("/tasks/pdf")
    public ResponseEntity<byte[]> exportTasksToPdf() {

        return buildPdfResponse(
                exportPdfService.exportTasksToPdf(),
                "tasks.pdf"
        );
    }

    @Operation(
            summary = "Export projects to PDF",
            description = "Export all projects to projects.pdf"
    )
    @GetMapping("/projects/pdf")
    public ResponseEntity<byte[]> exportProjectsToPdf() {

        return buildPdfResponse(
                exportPdfService.exportProjectsToPdf(),
                "projects.pdf"
        );
    }

    @Operation(
            summary = "Export activity logs to Excel",
            description = "Export all activity logs to activity_logs.xlsx"
    )
    @GetMapping("/activity-logs/excel")
    public ResponseEntity<byte[]> exportActivityLogsToExcel(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String username,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String module,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String action,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String result,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String ipAddress,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String startDate,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String endDate) {

        return buildExcelResponse(
                exportService.exportActivityLogsToExcel(username, module, action, result, ipAddress, startDate, endDate),
                "activity_logs.xlsx"
        );
    }

    @Operation(
            summary = "Export activity logs to PDF",
            description = "Export all activity logs to activity_logs.pdf"
    )
    @GetMapping("/activity-logs/pdf")
    public ResponseEntity<byte[]> exportActivityLogsToPdf(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String username,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String module,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String action,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String result,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String ipAddress,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String startDate,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String endDate) {

        return buildPdfResponse(
                exportPdfService.exportActivityLogsToPdf(username, module, action, result, ipAddress, startDate, endDate),
                "activity_logs.pdf"
        );
    }

    @Operation(
            summary = "Export dashboard to Excel",
            description = "Export dashboard statistics to dashboard.xlsx"
    )
    @GetMapping("/dashboard/excel")
    public ResponseEntity<byte[]> exportDashboardToExcel() {

        return buildExcelResponse(
                exportService.exportDashboardToExcel(),
                "dashboard.xlsx"
        );
    }

    @Operation(
            summary = "Export dashboard to PDF",
            description = "Export dashboard statistics to dashboard.pdf"
    )
    @GetMapping("/dashboard/pdf")
    public ResponseEntity<byte[]> exportDashboardToPdf() {

        return buildPdfResponse(
                exportPdfService.exportDashboardToPdf(),
                "dashboard.pdf"
        );
    }

    private ResponseEntity<byte[]> buildExcelResponse(
            byte[] content,
            String fileName) {

        return ResponseEntity.ok()
                .contentType(EXCEL_MEDIA_TYPE)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(fileName)
                                .build()
                                .toString()
                )
                .body(content);
    }

    private ResponseEntity<byte[]> buildPdfResponse(
            byte[] content,
            String fileName) {

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(fileName)
                                .build()
                                .toString()
                )
                .body(content);
    }
}
