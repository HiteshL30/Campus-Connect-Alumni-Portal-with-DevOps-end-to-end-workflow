-- Drop old table if exists
DROP TABLE IF EXISTS interview_sessions;

-- Create Multi-round Interview Session Table
CREATE TABLE interview_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'STARTED',
    current_round INT NOT NULL DEFAULT 1,
    total_score INT,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_mock_interview_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Interview Answers Table
CREATE TABLE interview_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    round_number INT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    score INT,
    strengths TEXT,
    improvements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mock_interview_answers_session FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_session_round (session_id, round_number)
);
