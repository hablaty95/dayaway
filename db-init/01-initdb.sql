-- ======================
-- Table: vacation_requests
-- ======================
CREATE TABLE IF NOT EXISTS vacation_requests (
    id SERIAL PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    first_day DATE NOT NULL,
    last_day DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraint: end date must be same or after start date
    CONSTRAINT chk_vacation_dates CHECK (last_day >= first_day),

    -- Constraint: employee name cannot be blank or just spaces
    CONSTRAINT chk_employee_name_not_blank CHECK (trim(employee_name) <> '')
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraint: resolver name cannot be blank or just spaces
    CONSTRAINT chk_resolver_name_not_blank CHECK (trim(resolver_name) <> '')
);

-- Optional: index for faster lookups by vacation request
CREATE INDEX IF NOT EXISTS idx_resolutions_vacation_request_id
    ON vacation_resolutions(vacation_request_id);

-- ======================
-- Triggers for business rules
-- ======================

CREATE OR REPLACE FUNCTION validate_vacation_request_dates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.first_day < CURRENT_DATE + INTERVAL '2 days' THEN
        RAISE EXCEPTION 'Vacation must start at least 2 days in the future.';
    END IF;

    IF NEW.last_day < NEW.first_day THEN
        RAISE EXCEPTION 'End date must be greater than or equal to start date.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_validate_vacation_dates
BEFORE INSERT OR UPDATE ON vacation_requests
FOR EACH ROW
EXECUTE FUNCTION validate_vacation_request_dates();