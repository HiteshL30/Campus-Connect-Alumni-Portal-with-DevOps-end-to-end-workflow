package com.alumniconnect.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private LocalDateTime eventDate;
    private String location;
    private String eventType;
    private Integer maxAttendees;
    @jakarta.validation.constraints.Pattern(regexp = "^(https?://.*)?$", message = "Registration link must be a valid URL starting with http:// or https://")
    private String registrationLink;
}
