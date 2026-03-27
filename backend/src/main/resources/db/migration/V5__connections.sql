-- V5__connections.sql
CREATE TABLE connections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    requester_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_conn_requester FOREIGN KEY (requester_id) REFERENCES users(id),
    CONSTRAINT fk_conn_receiver FOREIGN KEY (receiver_id) REFERENCES users(id),
    CONSTRAINT uc_conn_requester_receiver UNIQUE (requester_id, receiver_id),
    INDEX idx_conn_requester (requester_id),
    INDEX idx_conn_receiver (receiver_id),
    INDEX idx_conn_status (status)
);
