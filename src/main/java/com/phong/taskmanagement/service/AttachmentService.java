package com.phong.taskmanagement.service;

import com.phong.taskmanagement.dto.request.CreateAttachmentRequest;
import com.phong.taskmanagement.entity.Attachment;

import java.util.List;

public interface AttachmentService {

    Attachment createAttachment(CreateAttachmentRequest request);

    List<Attachment> getAllAttachments();
}