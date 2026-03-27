package com.alumniconnect.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Entity
@Table(name = "connections")
public class Connection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(nullable = false, length = 20)
    private ConnectionStatus status;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Connection() {
    }

    public Connection(Long id, User requester, User receiver, ConnectionStatus status) {
        this.id = id;
        this.requester = requester;
        this.receiver = receiver;
        this.status = status;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null)
            status = ConnectionStatus.REQUESTED;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getRequester() {
        return requester;
    }

    public void setRequester(User requester) {
        this.requester = requester;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public ConnectionStatus getStatus() {
        return status;
    }

    public void setStatus(ConnectionStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Builder
    public static ConnectionBuilder builder() {
        return new ConnectionBuilder();
    }

    public static class ConnectionBuilder {
        private Long id;
        private User requester;
        private User receiver;
        private ConnectionStatus status;

        public ConnectionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ConnectionBuilder requester(User requester) {
            this.requester = requester;
            return this;
        }

        public ConnectionBuilder receiver(User receiver) {
            this.receiver = receiver;
            return this;
        }

        public ConnectionBuilder status(ConnectionStatus status) {
            this.status = status;
            return this;
        }

        public Connection build() {
            return new Connection(id, requester, receiver, status);
        }
    }
}
