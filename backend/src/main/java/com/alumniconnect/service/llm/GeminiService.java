package com.alumniconnect.service.llm;

import com.alumniconnect.dto.ai.AnswerEvaluationResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.web.client.RestTemplate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Slf4j
@Service
@ConditionalOnProperty(name = "llm.provider", havingValue = "gemini", matchIfMissing = true)
public class GeminiService implements LLMService {
    
    private static final Random random = new Random();

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final List<String> models = List.of(
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-2.0-flash"
    );
    private int currentModelIndex = 0;

    @Override
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    @CircuitBreaker(name = "llmService", fallbackMethod = "fallbackQuestionMethod")
    public String generateQuestion(String role, int round, String difficulty, String previousQuestion, String previousAnswer) {
        if (apiKey == null || apiKey.isEmpty()) return InterviewPrompts.FALLBACK_QUESTION;
        String prompt = String.format(InterviewPrompts.QUESTION_PROMPT, role, round, difficulty, 
                                      previousQuestion != null ? previousQuestion : "N/A", 
                                      previousAnswer != null ? previousAnswer : "N/A");
        return callGeminiApi(prompt);
    }

    public String fallbackQuestionMethod(String role, int round, String difficulty, String previousQuestion, String previousAnswer, Throwable t) {
        log.warn("Gemini Service Unavailable: Providing offline robust question for: {}", role);
        if (role == null || role.trim().isEmpty() || "N/A".equals(role)) {
            role = "Software Professional";
        }
        
        List<String> templates = List.of(
            "As a %s, how would you approach debugging a critical production issue that is affecting users?",
            "Can you describe a time when you had to design a scalable architecture or solution for a %s role?",
            "What are the most important design principles you follow as a %s, and why?",
            "How do you ensure security and performance optimization in your daily work as a %s?",
            "Describe a challenging project you've completed as a %s. What key technical decisions did you make?",
            "As a %s, how do you balance the trade-off between delivering features quickly and maintaining high code quality?"
        );
        
        String template = templates.get(random.nextInt(templates.size()));
        return String.format(template, role);
    }

    @Override
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    @CircuitBreaker(name = "llmService", fallbackMethod = "fallbackEvaluationMethod")
    public AnswerEvaluationResponse evaluateAnswer(String role, String question, String answer) {
        if (apiKey == null || apiKey.isEmpty()) return new AnswerEvaluationResponse(8, "Feedback locally generated.", "Good job.");
        String prompt = String.format(InterviewPrompts.ANSWER_EVALUATION_PROMPT, role, question, answer);
        String responseText = callGeminiApi(prompt);
        try {
            String cleanJson = extractJson(responseText);
            return objectMapper.readValue(cleanJson, AnswerEvaluationResponse.class);
        } catch (Exception e) {
            return new AnswerEvaluationResponse(6, "Answer received.", "Detail feedback extraction failed.");
        }
    }

    public AnswerEvaluationResponse fallbackEvaluationMethod(String role, String question, String answer, Throwable t) {
        log.warn("Gemini Service Unavailable: Providing offline robust evaluation.");
        if (answer == null || answer.trim().isEmpty()) {
            return new AnswerEvaluationResponse(0, "No answer provided.", "Please provide a detailed answer to allow for proper evaluation.");
        }
        
        int wordCount = answer.split("\\s+").length;
        int score = Math.max(2, Math.min(10, (int) (wordCount / 6.0)));
        
        String strength;
        String improvement;
        
        if (wordCount > 40) {
            strength = "You provided a detailed and comprehensive response.";
            improvement = "Ensure your explanations remain concise and highly structured.";
        } else if (wordCount > 15) {
            strength = "You provided a reasonable overview of the topic.";
            improvement = "Consider elaborating with specific technical examples or past experiences.";
        } else {
            strength = "Your answer was direct.";
            improvement = "Your response is too brief. Please elaborate significantly to demonstrate your expertise.";
            score = Math.max(1, score - 2); // penalize very short answers
        }
        
        return new AnswerEvaluationResponse(score, strength, improvement);
    }

    @Override
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    @CircuitBreaker(name = "llmService", fallbackMethod = "fallbackSummaryMethod")
    public String generateSummary(String role, String fullInterviewContext) {
        if (apiKey == null || apiKey.isEmpty()) return "Interview completed successfully.";
        String prompt = String.format(InterviewPrompts.INTERVIEW_SUMMARY_PROMPT, role, fullInterviewContext);
        return callGeminiApi(prompt).trim();
    }

    public String fallbackSummaryMethod(String role, String fullInterviewContext, Throwable t) {
        log.error("Gemini Circuit Breaker Summary: {}", t.getMessage());
        return "Interview complete. AI summary currently unavailable.";
    }

    @Override
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    @CircuitBreaker(name = "llmService", fallbackMethod = "fallbackResponseMethod")
    public String generateResponse(String prompt, String systemContext) {
        if (apiKey == null || apiKey.isEmpty()) return "Service unavailable.";
        String fullPrompt = String.format("%s\n\nUser Query: %s", systemContext, prompt);
        return callGeminiApi(fullPrompt).trim();
    }

    public String fallbackResponseMethod(String prompt, String systemContext, Throwable t) {
        log.error("Gemini Circuit Breaker Chatbot: {}", t.getMessage());
        return "I'm currently experiencing high traffic. Please try again soon.";
    }

    @Override
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    @CircuitBreaker(name = "llmService", fallbackMethod = "fallbackRawResponseMethod")
    public String generateRawResponse(String prompt) {
        if (apiKey == null || apiKey.isEmpty()) return "System default message.";
        return callGeminiApi(prompt).trim();
    }

    public String fallbackRawResponseMethod(String prompt, Throwable t) {
        log.error("Gemini Circuit Breaker Raw: {}", t.getMessage());
        return InterviewPrompts.FALLBACK_QUESTION;
    }

    private String extractJson(String response) {
        if (response == null || response.trim().isEmpty()) return "{}";
        
        // Remove markdown code blocks if present (e.g., ```json ... ```)
        String clean = response.replaceAll("```json", "").replaceAll("```", "").trim();
        
        int start = clean.indexOf("{");
        int end = clean.lastIndexOf("}");
        
        if (start != -1 && end != -1 && end > start) {
            return clean.substring(start, end + 1);
        }
        return clean;
    }

    private String callGeminiApi(String prompt) {
        return callWithModelRotation(prompt, 0);
    }

    private String callWithModelRotation(String prompt, int attempt) {
        if (attempt >= models.size()) {
            throw new RuntimeException("All Gemini models exhausted their quota.");
        }

        String modelName = models.get((currentModelIndex + attempt) % models.size());
        String fullUrl = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", 
                                      modelName, apiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);
        Map<String, Object> contentPart = new HashMap<>();
        contentPart.put("parts", List.of(textPart));
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(contentPart));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        log.info("Calling Gemini API [Model: {}] (Attempt {})...", modelName, attempt + 1);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, entity, String.class);
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            
            // If successful, update our current model index for future calls
            currentModelIndex = (currentModelIndex + attempt) % models.size();
            
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (org.springframework.web.client.HttpClientErrorException.TooManyRequests e) {
            log.warn("Quota exceeded for model {}. Rotating to next model...", modelName);
            return callWithModelRotation(prompt, attempt + 1);
        } catch (Exception e) {
            log.error("Failed to call Gemini API with model {}", modelName, e);
            throw new RuntimeException("Failed to call Gemini API", e);
        }
    }

}
