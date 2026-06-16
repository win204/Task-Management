package com.phong.taskmanagement.service;

public interface ExportService {

    byte[] exportUsersToExcel();

    byte[] exportTasksToExcel();

    byte[] exportProjectsToExcel();
}
