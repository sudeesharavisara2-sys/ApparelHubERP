-- ============================================================
-- V3: HR Operational — Attendance, Leave, Payroll, Recruitment
-- ============================================================

-- attendance
CREATE TABLE attendance (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     BIGINT NOT NULL REFERENCES employees(id),
    date            DATE NOT NULL,
    clock_in        TIMESTAMP,
    clock_out       TIMESTAMP,
    status          VARCHAR(20) DEFAULT 'Present'
                        CHECK (status IN ('Present','Absent','Late','Early Leave','WFH')),
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date     ON attendance(date);
CREATE INDEX idx_attendance_status   ON attendance(status);
CREATE UNIQUE INDEX uq_attendance_emp_date ON attendance(employee_id, date);

-- leave_requests
CREATE TABLE leave_requests (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     BIGINT NOT NULL REFERENCES employees(id),
    leave_type      VARCHAR(50) NOT NULL
                        CHECK (leave_type IN ('Annual','Sick','Maternity','Paternity','Unpaid','Other')),
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    total_days      INT NOT NULL DEFAULT 1,
    reason          TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'Pending'
                        CHECK (status IN ('Pending','Approved','Rejected','Cancelled')),
    approved_by     BIGINT REFERENCES users(id),
    approved_at     TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_leave_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_status   ON leave_requests(status);
CREATE INDEX idx_leave_dates    ON leave_requests(start_date, end_date);

-- payroll
CREATE TABLE payroll (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     BIGINT NOT NULL REFERENCES employees(id),
    period_month    INT NOT NULL CHECK (period_month BETWEEN 1 AND 12),
    period_year     INT NOT NULL,
    base_salary     NUMERIC(18,2) NOT NULL DEFAULT 0,
    allowances      NUMERIC(18,2) DEFAULT 0,
    deductions      NUMERIC(18,2) DEFAULT 0,
    bonus           NUMERIC(18,2) DEFAULT 0,
    tax             NUMERIC(18,2) DEFAULT 0,
    net_salary      NUMERIC(18,2) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'Draft'
                        CHECK (status IN ('Draft','Approved','Paid')),
    paid_at         TIMESTAMP,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_payroll_employee ON payroll(employee_id);
CREATE INDEX idx_payroll_period   ON payroll(period_year, period_month);
CREATE INDEX idx_payroll_status   ON payroll(status);
CREATE UNIQUE INDEX uq_payroll_emp_period ON payroll(employee_id, period_month, period_year);

-- recruitment
CREATE TABLE recruitment (
    id              BIGSERIAL PRIMARY KEY,
    job_title       VARCHAR(150) NOT NULL,
    department_id   BIGINT REFERENCES departments(id),
    description     TEXT,
    requirements    TEXT,
    positions       INT NOT NULL DEFAULT 1,
    status          VARCHAR(20) NOT NULL DEFAULT 'Open'
                        CHECK (status IN ('Open','In Review','Closed','Cancelled')),
    posted_date     DATE,
    closing_date    DATE,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_recruitment_department ON recruitment(department_id);
CREATE INDEX idx_recruitment_status     ON recruitment(status);
