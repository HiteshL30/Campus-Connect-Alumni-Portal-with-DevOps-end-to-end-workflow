CREATE TABLE resume_analysis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skills TEXT,
    technologies TEXT,
    projects TEXT,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resume_analysis_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
