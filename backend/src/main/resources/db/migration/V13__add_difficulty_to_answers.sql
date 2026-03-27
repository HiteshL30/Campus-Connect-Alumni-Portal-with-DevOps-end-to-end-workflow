-- Add difficulty column to interview_answers table
-- Default to MEDIUM for existing backwards compatibility

ALTER TABLE interview_answers 
ADD COLUMN difficulty VARCHAR(20) DEFAULT 'MEDIUM' NOT NULL;
