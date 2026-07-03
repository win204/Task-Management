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
import com.phong.taskmanagement.domain.entity.Attachment;
import com.phong.taskmanagement.domain.entity.Task;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.domain.repository.AttachmentRepository;
import com.phong.taskmanagement.domain.repository.TaskRepository;
import com.phong.taskmanagement.domain.repository.UserRepository;
import com.phong.taskmanagement.domain.entity.User;
import com.phong.taskmanagement.service.interfaces.AttachmentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl
        implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

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
                .uploadedById(
                        attachment.getUploadedBy() != null
                                ? attachment.getUploadedBy().getId()
                                : null
                )
                .uploadedByName(
                        attachment.getUploadedBy() != null
                                ? attachment.getUploadedBy().getFullName()
                                : null
                )
                .build();
    }

    @Override
    @Transactional
    public AttachmentResponse uploadFile(
            MultipartFile file,
            Long taskId,
            String username) {

        Task task = taskRepository.findById(
                taskId
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Task not found"
                ));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (file.getSize() > 20 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 20MB limit");
        }

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

        String fileNameLower = originalFileName.toLowerCase();
        boolean validExtension = fileNameLower.endsWith(".pdf") ||
                fileNameLower.endsWith(".doc") || fileNameLower.endsWith(".docx") ||
                fileNameLower.endsWith(".xls") || fileNameLower.endsWith(".xlsx") ||
                fileNameLower.endsWith(".ppt") || fileNameLower.endsWith(".pptx") ||
                fileNameLower.endsWith(".jpg") || fileNameLower.endsWith(".jpeg") ||
                fileNameLower.endsWith(".png") ||
                fileNameLower.endsWith(".txt") ||
                fileNameLower.endsWith(".zip");

        if (!validExtension) {
            throw new IllegalArgumentException(
                    "File type not supported"
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
                    .uploadedBy(user)
                    .build();

            attachment = attachmentRepository.save(
                    attachment
            );

            return mapToResponse(attachment);

        } catch (IOException ex) {
            throw new IllegalArgumentException(
                    "Could not upload file: "
                            + originalFileName, ex
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
                    "File not found", ex
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
                    "Could not delete physical file", ex
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
