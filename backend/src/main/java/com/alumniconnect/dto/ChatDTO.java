package com.alumniconnect.dto;

import com.alumniconnect.entity.ChatStatus;
import java.time.LocalDateTime;

public class ChatDTO {
    private Long id;
    private Long user1Id;
    private String user1Name;
    private Long user2Id;
    private String user2Name;
    private ChatStatus status;
    private LocalDateTime createdAt;
    private MessageDTO lastMessage;

    public ChatDTO() {
    }

    public ChatDTO(Long id, Long user1Id, String user1Name, Long user2Id, String user2Name,
            ChatStatus status, LocalDateTime createdAt, MessageDTO lastMessage) {
        this.id = id;
        this.user1Id = user1Id;
        this.user1Name = user1Name;
        this.user2Id = user2Id;
        this.user2Name = user2Name;
        this.status = status;
        this.createdAt = createdAt;
        this.lastMessage = lastMessage;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUser1Id() {
        return user1Id;
    }

    public void setUser1Id(Long user1Id) {
        this.user1Id = user1Id;
    }

    public String getUser1Name() {
        return user1Name;
    }

    public void setUser1Name(String user1Name) {
        this.user1Name = user1Name;
    }

    public Long getUser2Id() {
        return user2Id;
    }

    public void setUser2Id(Long user2Id) {
        this.user2Id = user2Id;
    }

    public String getUser2Name() {
        return user2Name;
    }

    public void setUser2Name(String user2Name) {
        this.user2Name = user2Name;
    }

    public ChatStatus getStatus() {
        return status;
    }

    public void setStatus(ChatStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public MessageDTO getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(MessageDTO lastMessage) {
        this.lastMessage = lastMessage;
    }

    public static ChatDTOBuilder builder() {
        return new ChatDTOBuilder();
    }

    public static class ChatDTOBuilder {
        private Long id;
        private Long user1Id;
        private String user1Name;
        private Long user2Id;
        private String user2Name;
        private ChatStatus status;
        private LocalDateTime createdAt;
        private MessageDTO lastMessage;

        public ChatDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ChatDTOBuilder user1Id(Long user1Id) {
            this.user1Id = user1Id;
            return this;
        }

        public ChatDTOBuilder user1Name(String user1Name) {
            this.user1Name = user1Name;
            return this;
        }

        public ChatDTOBuilder user2Id(Long user2Id) {
            this.user2Id = user2Id;
            return this;
        }

        public ChatDTOBuilder user2Name(String user2Name) {
            this.user2Name = user2Name;
            return this;
        }

        public ChatDTOBuilder status(ChatStatus status) {
            this.status = status;
            return this;
        }

        public ChatDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ChatDTOBuilder lastMessage(MessageDTO lastMessage) {
            this.lastMessage = lastMessage;
            return this;
        }

        public ChatDTO build() {
            return new ChatDTO(id, user1Id, user1Name, user2Id, user2Name, status, createdAt, lastMessage);
        }
    }
}
