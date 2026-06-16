package com.phong.taskmanagement.dto.response;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttachmentResponse {

    private Long id;

    private String fileName;

    private String fileType;

    private Long fileSize;

    private String filePath;

    private LocalDateTime uploadedAt;

    private Long taskId;

    private String taskTitle;
}
