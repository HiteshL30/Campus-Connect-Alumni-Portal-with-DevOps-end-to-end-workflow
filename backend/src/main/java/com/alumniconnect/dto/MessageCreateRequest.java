package com.alumniconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MessageCreateRequest {
    @NotNull(message = "Chat ID is required")
    private Long chatId;

    @NotBlank(message = "Content is required")
    private String content;

    private String resumeUrl;

    public MessageCreateRequest() {
    }

    public MessageCreateRequest(Long chatId, String content, String resumeUrl) {
        this.chatId = chatId;
        this.content = content;
        this.resumeUrl = resumeUrl;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }
}
