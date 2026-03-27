-- V6__chats.sql
CREATE TABLE chats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user1_id BIGINT NOT NULL,
    user2_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_user1 FOREIGN KEY (user1_id) REFERENCES users(id),
    CONSTRAINT fk_chat_user2 FOREIGN KEY (user2_id) REFERENCES users(id),
    CONSTRAINT uc_chat_users UNIQUE (user1_id, user2_id),
    INDEX idx_chat_user1 (user1_id),
    INDEX idx_chat_user2 (user2_id),
    INDEX idx_chat_updated_at (updated_at)
);
