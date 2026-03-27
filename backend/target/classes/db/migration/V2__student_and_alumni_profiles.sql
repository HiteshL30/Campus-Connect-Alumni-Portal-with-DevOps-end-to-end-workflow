-- V2__student_and_alumni_profiles.sql
CREATE TABLE student_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    student_id VARCHAR(255),
    major VARCHAR(255),
    graduation_year INT,
    bio TEXT,
    skills TEXT,
    interests TEXT,
    linkedin_url VARCHAR(255),
    resume_url VARCHAR(255),
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_user (user_id)
);

CREATE TABLE alumni_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    graduation_year INT,
    current_company VARCHAR(255),
    current_position VARCHAR(255),
    industry VARCHAR(255),
    location VARCHAR(255),
    bio TEXT,
    skills TEXT,
    linkedin_url VARCHAR(255),
    available_for_mentoring BOOLEAN,
    resume_url TEXT,
    batch INT,
    CONSTRAINT fk_alumni_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_alumni_user (user_id)
);
