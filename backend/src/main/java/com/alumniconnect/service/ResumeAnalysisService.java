package com.alumniconnect.service;

import com.alumniconnect.entity.ResumeAnalysis;
import com.alumniconnect.entity.User;
import com.alumniconnect.repository.ResumeAnalysisRepository;
import com.alumniconnect.service.llm.InterviewPrompts;
import com.alumniconnect.service.llm.LLMService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeAnalysisService {

    private final LLMService llmService;
    private final ResumeAnalysisRepository analysisRepository;
    private final ResumeParserService parserService;
    private final StorageService storageService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResumeAnalysis getOrAnalyzeResume(User user, String resumeUrl) {
        Optional<ResumeAnalysis> existing = analysisRepository.findByUserId(user.getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        log.info("Analyzing resume for user: {}", user.getEmail());
        try {
            String resumeText = parserService.extractTextFromPath(storageService.load(resumeUrl));
            
            // Generate summary
            String summaryPrompt = String.format(InterviewPrompts.RESUME_SUMMARY_PROMPT, resumeText);
            String summary = llmService.generateSummary("N/A", summaryPrompt); // Reusing summary method for general text

            // Extract structured data
            String analysisPrompt = String.format(InterviewPrompts.RESUME_ANALYSIS_PROMPT, resumeText);
            // We use generateQuestion here as a workaround to get a raw string, 
            // but ideally we'd have a generic "callLLM" method. 
            // However, evaluateAnswer also returns JSON, let's see if we can use a raw LLM call.
            // Since LLMService only has specific methods, I'll use generateSummary as a hack or add a generic method.
            // Let's assume generateSummary can be used for summary, and maybe generateQuestion for analysis.
            // Actually, generateQuestion is perfect for raw string responses.
            
            String analysisJson = llmService.generateQuestion("N/A", 0, "N/A", analysisPrompt, null);
            String cleanJson = extractJson(analysisJson);
            
            ResumeAnalysisDto dto = objectMapper.readValue(cleanJson, ResumeAnalysisDto.class);

            ResumeAnalysis analysis = ResumeAnalysis.builder()
                    .user(user)
                    .skills(String.join(", ", dto.getSkills()))
                    .technologies(String.join(", ", dto.getTechnologies()))
                    .projects(String.join(", ", dto.getProjects()))
                    .summary(summary)
                    .build();

            return analysisRepository.save(analysis);
        } catch (Exception e) {
            log.error("Failed to analyze resume for user: {}. Error: {}", user.getEmail(), e.getMessage());
            return null;
        }
    }

    private String extractJson(String response) {
        if (response == null) return "{}";
        int start = response.indexOf("{");
        int end = response.lastIndexOf("}");
        if (start != -1 && end != -1 && end > start) {
            return response.substring(start, end + 1);
        }
        return response;
    }

    @lombok.Data
    private static class ResumeAnalysisDto {
        private java.util.List<String> skills;
        private java.util.List<String> technologies;
        private java.util.List<String> projects;
    }
}
