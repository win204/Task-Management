package com.phong.taskmanagement.service;

import java.io.ByteArrayInputStream;

public interface ReportService {
    ByteArrayInputStream exportTasksToExcel();
    ByteArrayInputStream exportProjectsToExcel();
    ByteArrayInputStream exportUsersToExcel();
    ByteArrayInputStream exportTasksToPdf();
}
