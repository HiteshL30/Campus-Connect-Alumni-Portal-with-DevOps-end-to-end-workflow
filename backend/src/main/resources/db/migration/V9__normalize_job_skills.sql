-- V9__normalize_job_skills.sql
-- Normalizing job skills into a separate table
CREATE TABLE job_required_skills (
    job_id BIGINT NOT NULL,
    skill VARCHAR(100) NOT NULL,
    PRIMARY KEY (job_id, skill),
    CONSTRAINT fk_job_skills_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Index for efficient skill-based lookups
CREATE INDEX idx_job_skills_name ON job_required_skills(skill);
