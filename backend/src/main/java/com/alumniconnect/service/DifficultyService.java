package com.alumniconnect.service;

import com.alumniconnect.entity.Difficulty;
import org.springframework.stereotype.Service;

@Service
public class DifficultyService {

    /**
     * score >= 8: HARD
     * score 5-7: MEDIUM
     * score <= 4: EASY
     */
    public Difficulty calculateNextDifficulty(Integer score) {
        if (score == null) {
            return Difficulty.MEDIUM;
        }
        
        // More granular transitions
        if (score >= 9) {
            return Difficulty.HARD;
        } else if (score >= 7) {
            return Difficulty.MEDIUM; // High medium
        } else if (score >= 5) {
            return Difficulty.MEDIUM; // Standard medium
        } else if (score >= 3) {
            return Difficulty.EASY; // Challenging easy
        } else {
            return Difficulty.EASY; // Core easy
        }
    }
}
