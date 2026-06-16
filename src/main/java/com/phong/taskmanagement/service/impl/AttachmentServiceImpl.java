package com.phong.taskmanagement.service.impl;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.phong.taskmanagement.dto.response.AttachmentResponse;
import com.phong.taskmanagement.entity.Attachment;
import com.phong.taskmanagement.entity.Task;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.repository.AttachmentRepository;
import com.phong.taskmanagement.repository.TaskRepository;
import com.phong.taskmanagement.service.AttachmentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl
        implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private AttachmentResponse mapToResponse(
            Attachment attachment) {

        return AttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileType(attachment.getFileType())
                .fileSize(attachment.getFileSize())
                .filePath(attachment.getFilePath())
                .uploadedAt(attachment.getUploadedAt())
                .taskId(
                        attachment.getTask() != null
                                ? attachment.getTask().getId()
                                : null
                )
                .taskTitle(
                        attachment.getTask() != null
                                ? attachment.getTask().getTitle()
                                : null
                )
                .build();
    }

    @Override
    @Transactional
    public AttachmentResponse uploadFile(
            MultipartFile file,
            Long taskId) {

        Task task = taskRepository.findById(
                taskId
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Task not found"
                ));

        String originalFileName = StringUtils.cleanPath(
                file.getOriginalFilename() != null
                        ? file.getOriginalFilename()
                        : "file"
        );

        if (originalFileName.contains("..")) {
            throw new IllegalArgumentException(
                    "Invalid file name"
            );
        }

        String uniqueFileName = UUID.randomUUID()
                + "_"
                + originalFileName;

        Path uploadPath = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(uploadPath);

            Path targetPath = uploadPath.resolve(
                    uniqueFileName
            ).normalize();

            if (!targetPath.startsWith(uploadPath)) {
                throw new IllegalArgumentException(
                        "Invalid file path"
                );
            }

            file.transferTo(targetPath);

            String storedPath = targetPath.toAbsolutePath().toString();

            Attachment attachment = Attachment.builder()
                    .fileName(originalFileName)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .filePath(storedPath)
                    .task(task)
                    .build();

            attachment = attachmentRepository.save(
                    attachment
            );

            return mapToResponse(attachment);

        } catch (IOException ex) {
            throw new IllegalArgumentException(
                    "Could not upload file: "
                            + originalFileName
            );
        }
    }

    @Override
    public Resource downloadFile(Long id) {

        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Attachment not found"
                        ));

        try {
            Path filePath = Paths.get(
                    attachment.getFilePath()
            ).toAbsolutePath().normalize();

            Resource resource =
                    new UrlResource(
                            filePath.toUri()
                    );

            if (!resource.exists()
                    || !resource.isReadable()) {
                throw new ResourceNotFoundException(
                        "File not found"
                );
            }

            return resource;

        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException(
                    "File not found"
            );
        }
    }

    @Override
    @Transactional
    public void deleteAttachment(Long id) {

        Attachment attachment = attachmentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Attachment not found"
                        ));

        try {
            Path filePath = Paths.get(
                    attachment.getFilePath()
            ).toAbsolutePath().normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new IllegalArgumentException(
                    "Could not delete physical file"
            );
        }

        attachmentRepository.delete(attachment);
    }

    @Override
    public List<AttachmentResponse> getAttachmentsByTask(Long taskId) {
        taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Task not found"
                ));

        return attachmentRepository.findByTaskId(taskId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AttachmentResponse getAttachmentById(Long id) {
        return attachmentRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Attachment not found"
                ));
    }

    @Override
    public List<AttachmentResponse>
    getAllAttachments() {

        return attachmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
}
