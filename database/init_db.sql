-- init_db.sql
-- Create table for storing fake news verification queries

CREATE TABLE IF NOT EXISTS checks (
    id SERIAL PRIMARY KEY,
    query_text TEXT NOT NULL,
    verdict VARCHAR(50) NOT NULL,
    score FLOAT NOT NULL,
    evidence JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
