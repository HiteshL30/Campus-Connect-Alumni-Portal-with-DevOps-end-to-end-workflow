package com.alumniconnect.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAnswerResponse {
    private AnswerEvaluationResponse evaluation;
    private InterviewQuestionResponse nextQuestion; 
    private boolean isFinished;
}
