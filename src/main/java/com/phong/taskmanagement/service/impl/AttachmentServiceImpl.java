package com.phong.taskmanagement.service.impl;

import com.phong.taskmanagement.dto.request.CreateAttachmentRequest;
import com.phong.taskmanagement.entity.Attachment;
import com.phong.taskmanagement.entity.Task;
import com.phong.taskmanagement.exception.ResourceNotFoundException;
import com.phong.taskmanagement.repository.AttachmentRepository;
import com.phong.taskmanagement.repository.TaskRepository;
import com.phong.taskmanagement.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;

    @Override
    public Attachment createAttachment(CreateAttachmentRequest request) {

        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Task not found"));

        Attachment attachment = Attachment.builder()
                .fileName(request.getFileName())
                .filePath(request.getFilePath())
                .task(task)
                .build();

        return attachmentRepository.save(attachment);
    }

    @Override
    public List<Attachment> getAllAttachments() {
        return attachmentRepository.findAll();
    }
}