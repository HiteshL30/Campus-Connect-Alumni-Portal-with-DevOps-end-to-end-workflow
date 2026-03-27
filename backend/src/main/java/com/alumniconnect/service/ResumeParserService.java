package com.alumniconnect.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Path;

@Service
@Slf4j
public class ResumeParserService {

    public String extractTextFromPath(Path filePath) {
        log.info("Extracting text from PDF: {}", filePath);
        try (PDDocument document = Loader.loadPDF(filePath.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (IOException e) {
            log.error("Failed to extract text from PDF", e);
            throw new RuntimeException("Failed to parse resume PDF", e);
        }
    }
}
