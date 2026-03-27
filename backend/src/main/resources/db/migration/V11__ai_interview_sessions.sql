CREATE TABLE interview_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    score INT,
    strengths TEXT,
    improvements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_interview_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
