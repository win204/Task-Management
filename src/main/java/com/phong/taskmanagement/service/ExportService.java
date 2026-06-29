package com.phong.taskmanagement.service;

public interface ExportService {

    byte[] exportUsersToExcel();

    byte[] exportTasksToExcel();

    byte[] exportProjectsToExcel();

    byte[] exportActivityLogsToExcel(
            String username,
            String module,
            String action,
            String result,
            String ipAddress,
            String startDate,
            String endDate
    );

    byte[] exportDashboardToExcel();
}
