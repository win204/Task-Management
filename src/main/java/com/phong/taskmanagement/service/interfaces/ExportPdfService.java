package com.phong.taskmanagement.service.interfaces;

public interface ExportPdfService {

    byte[] exportUsersToPdf();

    byte[] exportTasksToPdf();

    byte[] exportProjectsToPdf();

    byte[] exportActivityLogsToPdf(
            String username,
            String module,
            String action,
            String result,
            String ipAddress,
            String startDate,
            String endDate
    );

    byte[] exportDashboardToPdf();
}
