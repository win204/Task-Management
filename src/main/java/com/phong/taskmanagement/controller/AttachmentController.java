package com.phong.taskmanagement.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.phong.taskmanagement.dto.response.ApiResponse;
import com.phong.taskmanagement.dto.response.AttachmentResponse;
import com.phong.taskmanagement.service.AttachmentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
@Tag(
        name = "Attachment API",
        description = "APIs for managing attachments"
)
public class AttachmentController {

    private final AttachmentService attachmentService;

    @Operation(
            summary = "Upload attachment",
            description = "Upload a file and attach it to a task"
    )
    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ApiResponse<AttachmentResponse> uploadFile(
            @Parameter(description = "Task id")
            @RequestParam Long taskId,

            @Parameter(description = "File to upload")
            @RequestParam("file") MultipartFile file,
            org.springframework.security.core.Authentication authentication) {

        String username = authentication.getName();
        AttachmentResponse response = attachmentService
                .uploadFile(file, taskId, username);
        return ApiResponse.success(response, "File uploaded successfully");
    }

    @Operation(
            summary = "Download attachment",
            description = "Download attachment file by id"
    )
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Long id) {

        Resource resource = attachmentService
                .downloadFile(id);

        AttachmentResponse attachment = attachmentService
                .getAttachmentById(id);

        String filename = attachment.getFileName() != null
                ? attachment.getFileName()
                : "attachment";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        attachment.getFileType() != null
                                ? attachment.getFileType()
                                : MediaType.APPLICATION_OCTET_STREAM_VALUE
                ))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(filename)
                                .build()
                                .toString()
                )
                .body(resource);
    }

    @Operation(
            summary = "Delete attachment",
            description = "Delete attachment metadata and physical file"
    )
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAttachment(
            @PathVariable Long id) {

        attachmentService.deleteAttachment(id);
        return ApiResponse.success(null, "Attachment deleted successfully");
    }

    @Operation(
            summary = "Get attachments by task",
            description = "Retrieve attachments by task id"
    )
    @GetMapping("/task/{taskId}")
    public ApiResponse<List<AttachmentResponse>>
    getAttachmentsByTask(@PathVariable Long taskId) {

        List<AttachmentResponse> response = attachmentService
                .getAttachmentsByTask(taskId);
        return ApiResponse.success(response, "Attachments retrieved successfully");
    }
}
