package com.alumniconnect.controller;

import com.alumniconnect.dto.ApiResponse;
import com.alumniconnect.dto.ChatDTO;
import com.alumniconnect.dto.ChatRequestDTO;
import com.alumniconnect.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;
    private final com.alumniconnect.service.MessageService messageService;

    public ChatController(ChatService chatService, com.alumniconnect.service.MessageService messageService) {
        this.chatService = chatService;
        this.messageService = messageService;
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<ApiResponse<List<com.alumniconnect.dto.MessageDTO>>> getChatMessages(
            @PathVariable("chatId") Long chatId) {
        return ResponseEntity.ok(ApiResponse.success(messageService.getChatMessages(chatId)));
    }

    @PostMapping("/{chatId}/messages")
    public ResponseEntity<ApiResponse<com.alumniconnect.dto.MessageDTO>> sendMessage(
            @PathVariable("chatId") Long chatId,
            @Valid @RequestBody com.alumniconnect.dto.MessageCreateRequest request) {
        request.setChatId(chatId);
        return ResponseEntity.ok(ApiResponse.success(messageService.sendMessage(request), "Message sent"));
    }

    @PostMapping("/{chatId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable("chatId") Long chatId) {
        messageService.markAsRead(chatId);
        return ResponseEntity.ok(ApiResponse.success(null, "Messages marked as read"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChatDTO>>> getMyChats() {
        return ResponseEntity.ok(ApiResponse.success(chatService.getMyChats()));
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<ApiResponse<ChatDTO>> getChatById(@PathVariable("chatId") Long chatId) {
        return ResponseEntity.ok(ApiResponse.success(chatService.getChatById(chatId)));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ALUMNI')")
    public ResponseEntity<ApiResponse<List<ChatDTO>>> getPendingRequests() {
        return ResponseEntity.ok(ApiResponse.success(chatService.getPendingRequests()));
    }

    @PostMapping("/request")
    public ResponseEntity<ApiResponse<ChatDTO>> requestChat(@Valid @RequestBody ChatRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.success(chatService.requestChat(request), "Chat request sent"));
    }

    @PostMapping("/{chatId}/accept")
    @PreAuthorize("hasRole('ALUMNI')")
    public ResponseEntity<ApiResponse<ChatDTO>> acceptChat(@PathVariable("chatId") Long chatId) {
        return ResponseEntity.ok(ApiResponse.success(chatService.acceptChat(chatId), "Chat request accepted"));
    }

    @PostMapping("/{chatId}/reject")
    @PreAuthorize("hasRole('ALUMNI')")
    public ResponseEntity<ApiResponse<ChatDTO>> rejectChat(@PathVariable("chatId") Long chatId) {
        return ResponseEntity.ok(ApiResponse.success(chatService.rejectChat(chatId), "Chat request rejected"));
    }

}
