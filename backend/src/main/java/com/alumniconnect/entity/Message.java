package com.alumniconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String resumeUrl;

    private Boolean isRead;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Message() {
    }

    public Message(Long id, Chat chat, User sender, String content, String resumeUrl, Boolean isRead) {
        this.id = id;
        this.chat = chat;
        this.sender = sender;
        this.content = content;
        this.resumeUrl = resumeUrl;
        this.isRead = isRead;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isRead == null)
            isRead = false;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
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

    // Builder
    public static MessageBuilder builder() {
        return new MessageBuilder();
    }

    public static class MessageBuilder {
        private Long id;
        private Chat chat;
        private User sender;
        private String content;
        private String resumeUrl;
        private Boolean isRead;

        public MessageBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public MessageBuilder chat(Chat chat) {
            this.chat = chat;
            return this;
        }

        public MessageBuilder sender(User sender) {
            this.sender = sender;
            return this;
        }

        public MessageBuilder content(String content) {
            this.content = content;
            return this;
        }

        public MessageBuilder resumeUrl(String resumeUrl) {
            this.resumeUrl = resumeUrl;
            return this;
        }

        public MessageBuilder isRead(Boolean isRead) {
            this.isRead = isRead;
            return this;
        }

        public Message build() {
            return new Message(id, chat, sender, content, resumeUrl, isRead);
        }
    }
}
