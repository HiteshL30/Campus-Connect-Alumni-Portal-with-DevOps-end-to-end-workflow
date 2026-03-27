package com.alumniconnect.dto;

import com.alumniconnect.entity.NotificationType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class NotificationDTO {
    private Long id;
    private NotificationType type;
    private String message;
    private Long relatedId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
