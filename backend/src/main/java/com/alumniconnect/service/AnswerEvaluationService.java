package com.alumniconnect.service;

import com.alumniconnect.dto.ai.AnswerEvaluationResponse;
import com.alumniconnect.service.llm.LLMService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnswerEvaluationService {

    private final LLMService llmService;

    public AnswerEvaluationResponse evaluateAnswer(String role, String question, String answer) {
        if (answer == null || answer.trim().isEmpty()) {
            return AnswerEvaluationResponse.builder()
                    .score(0)
                    .strengths("None. No answer provided.")
                    .improvements("Please provide a verbal or typed response.")
                    .build();
        }

        // Defer to LLM to evaluate the answer against the question
        return llmService.evaluateAnswer(role, question, answer);
    }
}
