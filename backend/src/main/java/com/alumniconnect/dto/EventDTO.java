package com.alumniconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private String location;
    private String eventType;
    private Integer maxAttendees;
    private String registrationLink;
    private Long createdById;
    private String createdByName;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
