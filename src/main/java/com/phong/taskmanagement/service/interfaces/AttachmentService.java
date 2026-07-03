package com.phong.taskmanagement.service.interfaces;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.phong.taskmanagement.dto.response.AttachmentResponse;

public interface AttachmentService {

    AttachmentResponse uploadFile(
            MultipartFile file,
            Long taskId,
            String username
    );

    Resource downloadFile(Long id);

    void deleteAttachment(Long id);

    List<AttachmentResponse> getAttachmentsByTask(Long taskId);

    AttachmentResponse getAttachmentById(Long id);

    List<AttachmentResponse> getAllAttachments();
}
