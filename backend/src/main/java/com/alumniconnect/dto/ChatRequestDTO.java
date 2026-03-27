package com.alumniconnect.dto;

import jakarta.validation.constraints.NotNull;

public class ChatRequestDTO {
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    private String initialMessage;

    public ChatRequestDTO() {
    }

    public ChatRequestDTO(Long receiverId, String initialMessage) {
        this.receiverId = receiverId;
        this.initialMessage = initialMessage;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getInitialMessage() {
        return initialMessage;
    }

    public void setInitialMessage(String initialMessage) {
        this.initialMessage = initialMessage;
    }

    // Temporary compatibility for alumniId
    public void setAlumniId(Long alumniId) {
        this.receiverId = alumniId;
    }

    public Long getAlumniId() {
        return receiverId;
    }
}
