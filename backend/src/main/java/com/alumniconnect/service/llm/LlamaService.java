package com.alumniconnect.service.llm;

import com.alumniconnect.dto.ai.AnswerEvaluationResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Slf4j
@Service
@ConditionalOnProperty(name = "llm.provider", havingValue = "llama")
public class LlamaService implements LLMService {
    
    private static final Random random = new Random();

    @Value("${llm.llama.url:http://localhost:11434/api/generate}")
    private String apiUrl;

    @Value("${llm.llama.model:llama3}")
    private String modelName;

    @Value("${llm.llama.timeout:10s}")
    private Duration timeout;

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public LlamaService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    @CircuitBreaker(name = "llmService", fallbackMethod = "fallbackQuestionMethod")
    public String generateQuestion(String role, int round, String difficulty, String previousQuestion, String previousAnswer) {
        String prompt = String.format(
                InterviewPrompts.QUESTION_PROMPT,
                role, round, difficulty, 
                previousQuestion != null ? previousQuestion : "N/A", 
                previousAnswer != null ? previousAnswer : "N/A"
        );
        
        return callLlamaApi(prompt).block();
    }

    public String fallbackQuestionMethod(String role, int round, String difficulty, String previousQuestion, String previousAnswer, Throwable t) {
        log.warn("Llama Service Unavailable: Providing offline robust question for: {}", role);
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
        String prompt = String.format(InterviewPrompts.ANSWER_EVALUATION_PROMPT, role, question, answer);
        
        try {
            String response = callLlamaApi(prompt).block();
            String cleanJson = extractJson(response);
            return objectMapper.readValue(cleanJson, AnswerEvaluationResponse.class);
        } catch (Exception e) {
            log.error("Failed to parse evaluation response from Llama: {}", e.getMessage());
            return new AnswerEvaluationResponse(6, "Answer recorded.", "Detailed AI feedback is currently unavailable for this response.");
        }
    }

    public AnswerEvaluationResponse fallbackEvaluationMethod(String role, String question, String answer, Throwable t) {
        log.warn("Llama Service Unavailable: Providing offline robust evaluation.");
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
        String prompt = String.format(InterviewPrompts.INTERVIEW_SUMMARY_PROMPT, role, fullInterviewContext);
        return callLlamaApi(prompt).block();
    }

    public String fallbackSummaryMethod(String role, String fullInterviewContext, Throwable t) {
        log.error("Circuit Breaker triggered for generateSummary. Reason: {}", t.getMessage());
        return "The interview is complete. Detailed AI summary is currently unavailable due to high demand.";
    }

    private String extractJson(String response) {
        if (response == null || response.trim().isEmpty()) return "{}";
        
        // Remove markdown code blocks if present
        String clean = response.replaceAll("```json", "").replaceAll("```", "").trim();
        
        int start = clean.indexOf("{");
        int end = clean.lastIndexOf("}");
        
        if (start != -1 && end != -1 && end > start) {
            return clean.substring(start, end + 1);
        }
        return clean;
    }

    private Mono<String> callLlamaApi(String prompt) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", modelName);
        requestBody.put("prompt", prompt);
        requestBody.put("stream", false);

        log.info("Calling Llama API [Model: {}] with prompt type: {}", modelName, getPromptType(prompt));

        long startTime = System.currentTimeMillis();

        return webClient.post()
                .uri(apiUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(timeout)
                .map(response -> {
                    long latency = System.currentTimeMillis() - startTime;
                    log.info("Llama API Response received. Latency: {}ms", latency);
                    try {
                        JsonNode rootNode = objectMapper.readTree(response);
                        return rootNode.path("response").asText();
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to parse Llama response", e);
                    }
                })
                .onErrorResume(e -> {
                    log.error("Error calling Llama API: {}", e.getMessage());
                    return Mono.error(e);
                });
    }

    @Override
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    @CircuitBreaker(name = "llmService", fallbackMethod = "fallbackResponseMethod")
    public String generateResponse(String prompt, String systemContext) {
        String fullPrompt = String.format("%s\n\nUser Query: %s", systemContext, prompt);
        return callLlamaApi(fullPrompt).block();
    }

    public String fallbackResponseMethod(String prompt, String systemContext, Throwable t) {
        log.error("Circuit Breaker triggered for generateResponse. Reason: {}", t.getMessage());
        return "I'm currently experiencing technical difficulties. Please try again later.";
    }

    @Override
    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    @CircuitBreaker(name = "llmService", fallbackMethod = "fallbackRawResponseMethod")
    public String generateRawResponse(String prompt) {
        return callLlamaApi(prompt).block();
    }

    public String fallbackRawResponseMethod(String prompt, Throwable t) {
        log.error("Circuit Breaker triggered for generateRawResponse in Llama. Reason: {}", t.getMessage());
        return InterviewPrompts.FALLBACK_QUESTION;
    }

    private String getPromptType(String prompt) {
        if (prompt.contains("Evaluate the following")) return "EVALUATION";
        if (prompt.contains("technical interviewer")) return "QUESTION";
        if (prompt.contains("hiring manager")) return "SUMMARY";
        if (prompt.contains("User Query:")) return "CHATBOT";
        return "UNKNOWN";
    }
}
