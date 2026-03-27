package com.alumniconnect.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StartInterviewRequest {
    @NotBlank(message = "Role is required")
    private String role;
}
