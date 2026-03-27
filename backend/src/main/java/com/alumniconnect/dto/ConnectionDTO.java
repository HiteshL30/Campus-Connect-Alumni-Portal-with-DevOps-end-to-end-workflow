package com.alumniconnect.dto;

import com.alumniconnect.entity.ConnectionStatus;
import java.time.LocalDateTime;

/**
 * Hardened DTO for Connection requests using Java 17 Record.
 * Includes "connectedWith" and "sender" fields for easier frontend consumption.
 */
public record ConnectionDTO(
        Long id,
        Long requesterId,
        String requesterName,
        String requesterEmail,
        String requesterRole,
        String requesterDepartment,
        Long receiverId,
        String receiverName,
        String receiverEmail,
        String receiverRole,
        String receiverDepartment,
        ConnectionStatus status,
        LocalDateTime createdAt,
        // Helper fields for frontend
        Long connectedWithId,
        String connectedWithFirstName,
        String connectedWithLastName,
        String senderFirstName,
        String senderLastName) {

    public static ConnectionDTOBuilder builder() {
        return new ConnectionDTOBuilder();
    }

    public static class ConnectionDTOBuilder {
        private Long id;
        private Long requesterId;
        private String requesterName;
        private String requesterEmail;
        private String requesterRole;
        private String requesterDepartment;
        private Long receiverId;
        private String receiverName;
        private String receiverEmail;
        private String receiverRole;
        private String receiverDepartment;
        private ConnectionStatus status;
        private LocalDateTime createdAt;
        private Long connectedWithId;
        private String connectedWithFirstName;
        private String connectedWithLastName;
        private String senderFirstName;
        private String senderLastName;

        public ConnectionDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ConnectionDTOBuilder requesterId(Long requesterId) {
            this.requesterId = requesterId;
            return this;
        }

        public ConnectionDTOBuilder requesterName(String requesterName) {
            this.requesterName = requesterName;
            return this;
        }

        public ConnectionDTOBuilder requesterEmail(String requesterEmail) {
            this.requesterEmail = requesterEmail;
            return this;
        }

        public ConnectionDTOBuilder requesterRole(String requesterRole) {
            this.requesterRole = requesterRole;
            return this;
        }

        public ConnectionDTOBuilder requesterDepartment(String requesterDepartment) {
            this.requesterDepartment = requesterDepartment;
            return this;
        }

        public ConnectionDTOBuilder receiverId(Long receiverId) {
            this.receiverId = receiverId;
            return this;
        }

        public ConnectionDTOBuilder receiverName(String receiverName) {
            this.receiverName = receiverName;
            return this;
        }

        public ConnectionDTOBuilder receiverEmail(String receiverEmail) {
            this.receiverEmail = receiverEmail;
            return this;
        }

        public ConnectionDTOBuilder receiverRole(String receiverRole) {
            this.receiverRole = receiverRole;
            return this;
        }

        public ConnectionDTOBuilder receiverDepartment(String receiverDepartment) {
            this.receiverDepartment = receiverDepartment;
            return this;
        }

        public ConnectionDTOBuilder status(ConnectionStatus status) {
            this.status = status;
            return this;
        }

        public ConnectionDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ConnectionDTOBuilder connectedWithId(Long connectedWithId) {
            this.connectedWithId = connectedWithId;
            return this;
        }

        public ConnectionDTOBuilder connectedWithFirstName(String connectedWithFirstName) {
            this.connectedWithFirstName = connectedWithFirstName;
            return this;
        }

        public ConnectionDTOBuilder connectedWithLastName(String connectedWithLastName) {
            this.connectedWithLastName = connectedWithLastName;
            return this;
        }

        public ConnectionDTOBuilder senderFirstName(String senderFirstName) {
            this.senderFirstName = senderFirstName;
            return this;
        }

        public ConnectionDTOBuilder senderLastName(String senderLastName) {
            this.senderLastName = senderLastName;
            return this;
        }

        public ConnectionDTO build() {
            return new ConnectionDTO(
                    id, requesterId, requesterName, requesterEmail, requesterRole, requesterDepartment,
                    receiverId, receiverName, receiverEmail, receiverRole, receiverDepartment,
                    status, createdAt, connectedWithId, connectedWithFirstName, connectedWithLastName,
                    senderFirstName, senderLastName);
        }
    }
}
