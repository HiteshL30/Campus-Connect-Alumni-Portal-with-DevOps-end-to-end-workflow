package com.alumniconnect.service;

import com.alumniconnect.dto.ai.*;
import com.alumniconnect.entity.*;
import com.alumniconnect.exception.ResourceNotFoundException;
import com.alumniconnect.repository.InterviewAnswerRepository;
import com.alumniconnect.repository.InterviewSessionRepository;
import com.alumniconnect.repository.StudentProfileRepository;
import com.alumniconnect.repository.UserRepository;
import com.alumniconnect.service.llm.InterviewPrompts;
import com.alumniconnect.service.llm.LLMService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MockInterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewAnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final LLMService llmService;
    private final AnswerEvaluationService answerEvaluationService;
    private final DifficultyService difficultyService;
    private final RateLimitService rateLimitService;
    private final ResumeAnalysisService resumeAnalysisService;
    private final StudentProfileRepository studentProfileRepository;
    
    public static final int MAX_ROUNDS = 5;

    @Transactional
    public InterviewQuestionResponse startInterview(String role, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!rateLimitService.isAllowed(user.getId())) {
            log.warn("Rate limit exceeded for user: {}", email);
            throw new RuntimeException("Rate limit exceeded. You can only start 10 interview sessions per hour.");
        }

        InterviewSession session = new InterviewSession();
        session.setUser(user);
        session.setRole(role);
        session.setStatus(InterviewStatus.IN_PROGRESS);
        session.setCurrentRound(1);
        session = sessionRepository.save(session);

        String questionText;
        Optional<StudentProfile> profileOpt = studentProfileRepository.findByUser(user);
        
        if (profileOpt.isPresent() && profileOpt.get().getResumeUrl() != null) {
            ResumeAnalysis analysis = resumeAnalysisService.getOrAnalyzeResume(user, profileOpt.get().getResumeUrl());
            if (analysis != null) {
                log.info("Generating resume-based question for user: {}", email);
                String prompt = String.format(
                        InterviewPrompts.RESUME_BASED_QUESTION_PROMPT,
                        role, analysis.getSummary(), 1, Difficulty.MEDIUM.name(), 
                        "N/A", "N/A"
                );
                questionText = llmService.generateRawResponse(prompt);
            } else {
                questionText = llmService.generateQuestion(role, 1, Difficulty.MEDIUM.name(), null, null);
            }
        } else {
            questionText = llmService.generateQuestion(role, 1, Difficulty.MEDIUM.name(), null, null);
        }

        // Record the round 1 question
        InterviewAnswer answerRecord = InterviewAnswer.builder()
                .session(session)
                .roundNumber(1)
                .difficulty(Difficulty.MEDIUM)
                .question(questionText)
                .build();
        answerRepository.save(answerRecord);

        return InterviewQuestionResponse.builder()
                .sessionId(session.getId())
                .round(1)
                .difficulty(Difficulty.MEDIUM.name())
                .question(questionText)
                .isComplete(false)
                .build();
    }

    @Transactional
    public SubmitAnswerResponse submitAnswer(SubmitAnswerRequest request, String email) {
        InterviewSession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to access this session.");
        }
        
        if (session.getStatus() == InterviewStatus.COMPLETED) {
            throw new RuntimeException("Interview session is already completed.");
        }

        int currentRound = session.getCurrentRound();
        
        // Find current un-answered question
        InterviewAnswer currentAnswer = answerRepository.findBySessionIdOrderByRoundNumberAsc(session.getId())
                .stream()
                .filter(a -> a.getRoundNumber() == currentRound)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Question record for current round not found."));

        // Evaluate user answer
        AnswerEvaluationResponse evaluation = answerEvaluationService.evaluateAnswer(session.getRole(), currentAnswer.getQuestion(), request.getAnswer());
        
        // Save answer and score
        currentAnswer.setAnswer(request.getAnswer());
        currentAnswer.setScore(evaluation.getScore());
        currentAnswer.setStrengths(evaluation.getStrengths());
        currentAnswer.setImprovements(evaluation.getImprovements());
        answerRepository.save(currentAnswer);

        // Advance to next round or finish
        if (currentRound >= MAX_ROUNDS) {
            // Finish interview
            return concludeInterview(session, evaluation);
        } else {
            // Determine adaptive difficulty
            Difficulty nextDifficulty = difficultyService.calculateNextDifficulty(evaluation.getScore());

            // Generate follow-up context
            int nextRound = currentRound + 1;
            String nextQuestionText = llmService.generateQuestion(
                    session.getRole(), 
                    nextRound, 
                    nextDifficulty.name(), 
                    currentAnswer.getQuestion(), 
                    request.getAnswer());
            
            InterviewAnswer nextAnswer = InterviewAnswer.builder()
                    .session(session)
                    .roundNumber(nextRound)
                    .difficulty(nextDifficulty)
                    .question(nextQuestionText)
                    .build();
            answerRepository.save(nextAnswer);

            session.setCurrentRound(nextRound);
            sessionRepository.save(session);

            return SubmitAnswerResponse.builder()
                    .evaluation(evaluation)
                    .nextQuestion(InterviewQuestionResponse.builder()
                            .sessionId(session.getId())
                            .round(nextRound)
                            .difficulty(nextDifficulty.name())
                            .question(nextQuestionText)
                            .isComplete(false)
                            .build())
                    .isFinished(false)
                    .build();
        }
    }
    
    @Transactional
    public InterviewSummaryResponse forceFinishInterview(Long sessionId, String email) {
    	InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
    	if (!session.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to access this session.");
        }
    	
    	if (session.getStatus() == InterviewStatus.COMPLETED) {
            return InterviewSummaryResponse.builder()
                    .sessionId(session.getId())
                    .totalScore(session.getTotalScore())
                    .summary(session.getSummary())
                    .build();
        }
    	
    	// Treat current answered context as total and conclude
    	concludeInterview(session, null);
    	return InterviewSummaryResponse.builder()
                .sessionId(session.getId())
                .totalScore(session.getTotalScore())
                .summary(session.getSummary())
                .build();
    }

    private SubmitAnswerResponse concludeInterview(InterviewSession session, AnswerEvaluationResponse lastEvaluation) {
        List<InterviewAnswer> answers = answerRepository.findBySessionIdOrderByRoundNumberAsc(session.getId());
        
        // Only evaluate answered rounds
        List<InterviewAnswer> completedAnswers = answers.stream()
        		.filter(a -> a.getScore() != null)
        		.collect(Collectors.toList());
        
        int totalScore = 0;
        if (!completedAnswers.isEmpty()) {
            double average = completedAnswers.stream()
                    .mapToInt(InterviewAnswer::getScore)
                    .average()
                    .orElse(0.0);
            totalScore = (int) Math.round(average);
        }

        String fullContext = completedAnswers.stream()
                .map(a -> String.format("Round %d | Q: %s | A: %s | Score: %d", 
                        a.getRoundNumber(), a.getQuestion(), a.getAnswer(), a.getScore()))
                .collect(Collectors.joining("\n"));

        String summary = llmService.generateSummary(session.getRole(), fullContext);

        session.setStatus(InterviewStatus.COMPLETED);
        session.setTotalScore(totalScore);
        session.setSummary(summary);
        session.setCompletedAt(LocalDateTime.now());
        sessionRepository.save(session);

        return SubmitAnswerResponse.builder()
                .evaluation(lastEvaluation)
                .nextQuestion(InterviewQuestionResponse.builder()
                        .sessionId(session.getId())
                        .isComplete(true)
                        .build())
                .isFinished(true)
                .build();
    }

    public List<InterviewSession> getHistory(String email) {
        return sessionRepository.findByUserEmailOrderByCreatedAtDesc(email);
    }
}
