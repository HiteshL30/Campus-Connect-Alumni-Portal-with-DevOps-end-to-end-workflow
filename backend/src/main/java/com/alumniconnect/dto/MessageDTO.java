package com.alumniconnect.dto;

import java.time.LocalDateTime;

public class MessageDTO {
    private Long id;
    private Long chatId;
    private Long senderId;
    private String senderName;
    private String content;
    private String resumeUrl;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public MessageDTO() {
    }

    public MessageDTO(Long id, Long chatId, Long senderId, String senderName, String content,
            String resumeUrl, Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.chatId = chatId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.resumeUrl = resumeUrl;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
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

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static MessageDTOBuilder builder() {
        return new MessageDTOBuilder();
    }

    public static class MessageDTOBuilder {
        private Long id;
        private Long chatId;
        private Long senderId;
        private String senderName;
        private String content;
        private String resumeUrl;
        private Boolean isRead;
        private LocalDateTime createdAt;

        public MessageDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public MessageDTOBuilder chatId(Long chatId) {
            this.chatId = chatId;
            return this;
        }

        public MessageDTOBuilder senderId(Long senderId) {
            this.senderId = senderId;
            return this;
        }

        public MessageDTOBuilder senderName(String senderName) {
            this.senderName = senderName;
            return this;
        }

        public MessageDTOBuilder content(String content) {
            this.content = content;
            return this;
        }

        public MessageDTOBuilder resumeUrl(String resumeUrl) {
            this.resumeUrl = resumeUrl;
            return this;
        }

        public MessageDTOBuilder isRead(Boolean isRead) {
            this.isRead = isRead;
            return this;
        }

        public MessageDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public MessageDTO build() {
            return new MessageDTO(id, chatId, senderId, senderName, content, resumeUrl, isRead, createdAt);
        }
    }
}
