package com.alumniconnect.service;

import org.junit.jupiter.api.Test;
import java.nio.file.Path;
import java.nio.file.Paths;
import static org.junit.jupiter.api.Assertions.*;

class ResumeParserServiceTest {

    private final ResumeParserService parserService = new ResumeParserService();

    @Test
    void testExtractTextFromNonExistentFile() {
        Path path = Paths.get("non_existent.pdf");
        assertThrows(RuntimeException.class, () -> parserService.extractTextFromPath(path));
    }
}
