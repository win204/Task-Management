package com.phong.taskmanagement.controller;

import com.phong.taskmanagement.dto.request.CreateAttachmentRequest;
import com.phong.taskmanagement.entity.Attachment;
import com.phong.taskmanagement.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping
    public Attachment createAttachment(
            @RequestBody CreateAttachmentRequest request) {

        return attachmentService.createAttachment(request);
    }

    @GetMapping
    public List<Attachment> getAllAttachments() {
        return attachmentService.getAllAttachments();
    }
}