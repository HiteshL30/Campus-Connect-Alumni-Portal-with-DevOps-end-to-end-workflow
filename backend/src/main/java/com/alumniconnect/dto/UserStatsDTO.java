package com.alumniconnect.dto;

public class UserStatsDTO {
    private long unreadMessages;
    private long pendingConnections;

    public UserStatsDTO() {
    }

    public UserStatsDTO(long unreadMessages, long pendingConnections) {
        this.unreadMessages = unreadMessages;
        this.pendingConnections = pendingConnections;
    }

    public long getUnreadMessages() {
        return unreadMessages;
    }

    public void setUnreadMessages(long unreadMessages) {
        this.unreadMessages = unreadMessages;
    }

    public long getPendingConnections() {
        return pendingConnections;
    }

    public void setPendingConnections(long pendingConnections) {
        this.pendingConnections = pendingConnections;
    }
}
