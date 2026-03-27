package com.alumniconnect.controller;

import com.alumniconnect.dto.ai.ChatbotRequest;
import com.alumniconnect.dto.ai.ChatbotResponse;
import com.alumniconnect.service.SupportChatbotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class SupportChatbotController {

    private final SupportChatbotService chatbotService;

    @PostMapping("/query")
    public ResponseEntity<ChatbotResponse> queryChatbot(@Valid @RequestBody ChatbotRequest request) {
        String responseText = chatbotService.getChatbotResponse(request.getQuery());
        return ResponseEntity.ok(new ChatbotResponse(responseText));
    }
}
