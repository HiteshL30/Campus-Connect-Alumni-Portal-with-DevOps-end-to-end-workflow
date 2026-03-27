package com.alumniconnect.service.llm;

import com.alumniconnect.dto.ai.AnswerEvaluationResponse;

public interface LLMService {
    String generateQuestion(String role, int round, String difficulty, String previousQuestion, String previousAnswer);
    AnswerEvaluationResponse evaluateAnswer(String role, String question, String answer);
    String generateSummary(String role, String fullInterviewContext);
    String generateResponse(String prompt, String systemContext);
    String generateRawResponse(String prompt);
}
