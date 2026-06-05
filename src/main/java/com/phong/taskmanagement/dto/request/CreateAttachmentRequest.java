package com.phong.taskmanagement.dto.request;

import lombok.Data;

@Data
public class CreateAttachmentRequest {

    private String fileName;

    private String filePath;

    private Long taskId;
}