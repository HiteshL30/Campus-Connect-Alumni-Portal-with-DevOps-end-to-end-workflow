-- V3__jobs.sql
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    job_type VARCHAR(255),
    salary VARCHAR(255),
    requirements TEXT,
    application_url VARCHAR(2048),
    expiry_date DATETIME,
    allowed_batch VARCHAR(255),
    allowed_department VARCHAR(255),
    posted_by BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_poster FOREIGN KEY (posted_by) REFERENCES users(id),
    INDEX idx_job_posted_by (posted_by),
    INDEX idx_job_active_expiry (is_active, expiry_date)
);
