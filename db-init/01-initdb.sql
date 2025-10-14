-- ======================
-- Table: vacation_requests
-- ======================
CREATE TABLE IF NOT EXISTS vacation_requests (
    id SERIAL PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    first_day DATE NOT NULL,
    last_day DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- Table: vacation_resolutions
-- ======================
CREATE TABLE IF NOT EXISTS vacation_resolutions (
    id SERIAL PRIMARY KEY,
    vacation_request_id INT NOT NULL REFERENCES vacation_requests(id) ON DELETE CASCADE,
    decision BOOLEAN NOT NULL,  -- true = approved, false = rejected
    resolver_name VARCHAR(100) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: index for faster lookups by vacation request
CREATE INDEX IF NOT EXISTS idx_resolutions_vacation_request_id
    ON vacation_resolutions(vacation_request_id);
