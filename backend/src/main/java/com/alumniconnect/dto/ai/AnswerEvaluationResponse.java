package com.alumniconnect.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerEvaluationResponse {
    private Integer score;
    private String strengths;
    private String improvements;
}
