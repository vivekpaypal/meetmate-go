CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    company VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    interested_track VARCHAR(50) NOT NULL CHECK (interested_track IN ('ai-ml', 'software-engineering', 'devops-cloud', 'all')),
    newsletter BOOLEAN DEFAULT FALSE,
    terms BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_deleted_at ON registrations(deleted_at);
