package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.service.ExportPdfService;
import com.phong.taskmanagement.service.ExportService;
import com.phong.taskmanagement.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ExportService exportService;
    private final ExportPdfService exportPdfService;

    @Override
    public ByteArrayInputStream exportTasksToExcel() {
        return new ByteArrayInputStream(exportService.exportTasksToExcel());
    }

    @Override
    public ByteArrayInputStream exportTasksToPdf() {
        return new ByteArrayInputStream(exportPdfService.exportTasksToPdf());
    }
}
