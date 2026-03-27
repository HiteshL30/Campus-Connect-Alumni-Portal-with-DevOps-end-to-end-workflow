package com.alumniconnect.dto;

import jakarta.validation.constraints.NotNull;

public class ConnectionRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    public ConnectionRequest() {
    }

    public ConnectionRequest(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
