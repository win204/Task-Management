package com.phong.taskmanagement.service;

public interface ExportPdfService {

    byte[] exportUsersToPdf();

    byte[] exportTasksToPdf();

    byte[] exportProjectsToPdf();
}
