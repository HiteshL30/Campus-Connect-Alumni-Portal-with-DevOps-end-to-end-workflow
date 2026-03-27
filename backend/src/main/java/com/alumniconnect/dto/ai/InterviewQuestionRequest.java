package com.alumniconnect.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InterviewQuestionRequest {
    @NotBlank(message = "Role is required")
    private String role;
}
