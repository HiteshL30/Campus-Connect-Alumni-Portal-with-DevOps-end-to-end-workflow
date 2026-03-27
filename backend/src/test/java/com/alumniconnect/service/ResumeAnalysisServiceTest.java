package com.alumniconnect.service;

import com.alumniconnect.entity.ResumeAnalysis;
import com.alumniconnect.entity.User;
import com.alumniconnect.repository.ResumeAnalysisRepository;
import com.alumniconnect.service.llm.LLMService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.nio.file.Paths;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ResumeAnalysisServiceTest {

    @Mock private LLMService llmService;
    @Mock private ResumeAnalysisRepository analysisRepository;
    @Mock private ResumeParserService parserService;
    @Mock private StorageService storageService;

    private ResumeAnalysisService resumeAnalysisService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        resumeAnalysisService = new ResumeAnalysisService(llmService, analysisRepository, parserService, storageService);
    }

    @Test
    void testGetOrAnalyzeResume_Existing() {
        User user = new User();
        user.setId(1L);
        ResumeAnalysis existing = new ResumeAnalysis();
        when(analysisRepository.findByUserId(1L)).thenReturn(Optional.of(existing));

        ResumeAnalysis result = resumeAnalysisService.getOrAnalyzeResume(user, "resume.pdf");

        assertEquals(existing, result);
        verify(analysisRepository).findByUserId(1L);
        verifyNoInteractions(llmService);
    }

    @Test
    void testGetOrAnalyzeResume_New() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        
        when(analysisRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(storageService.load(anyString())).thenReturn(Paths.get("resume.pdf"));
        when(parserService.extractTextFromPath(any())).thenReturn("Resume content");
        when(llmService.generateSummary(anyString(), anyString())).thenReturn("Summary");
        when(llmService.generateQuestion(anyString(), anyInt(), anyString(), anyString(), any())).thenReturn("{\"skills\":[\"Java\"],\"technologies\":[\"Spring\"],\"projects\":[\"P1\"]}");
        when(analysisRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        ResumeAnalysis result = resumeAnalysisService.getOrAnalyzeResume(user, "resume.pdf");

        assertNotNull(result);
        assertEquals("Java", result.getSkills());
        assertEquals("Summary", result.getSummary());
        verify(analysisRepository).save(any());
    }
}
