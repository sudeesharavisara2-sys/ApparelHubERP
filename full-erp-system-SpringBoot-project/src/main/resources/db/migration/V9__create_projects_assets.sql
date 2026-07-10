-- ============================================================
-- V9: Projects & Assets
-- ============================================================

-- projects
CREATE TABLE projects (
    id              BIGSERIAL PRIMARY KEY,
    project_code    VARCHAR(30) UNIQUE,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    client_name     VARCHAR(150),
    manager_id      BIGINT REFERENCES employees(id),
    start_date      DATE,
    end_date        DATE,
    budget          NUMERIC(18,2) DEFAULT 0,
    actual_cost     NUMERIC(18,2) DEFAULT 0,
    progress        INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    status          VARCHAR(20) NOT NULL DEFAULT 'Planning'
                        CHECK (status IN ('Planning','Active','On Hold','Completed','Cancelled')),
    priority        VARCHAR(10) DEFAULT 'Normal'
                        CHECK (priority IN ('Low','Normal','High','Critical')),
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_projects_manager ON projects(manager_id);
CREATE INDEX idx_projects_status  ON projects(status);

-- milestones
CREATE TABLE milestones (
    id              BIGSERIAL PRIMARY KEY,
    project_id      BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name            VARCHAR(150) NOT NULL,
    due_date        DATE,
    completed_date  DATE,
    status          VARCHAR(20) NOT NULL DEFAULT 'Pending'
                        CHECK (status IN ('Pending','In Progress','Completed','Overdue')),
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_milestones_project ON milestones(project_id);
CREATE INDEX idx_milestones_status  ON milestones(status);

-- tasks
CREATE TABLE tasks (
    id              BIGSERIAL PRIMARY KEY,
    project_id      BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id    BIGINT REFERENCES milestones(id),
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    priority        VARCHAR(10) DEFAULT 'Normal'
                        CHECK (priority IN ('Low','Normal','High','Urgent')),
    status          VARCHAR(20) NOT NULL DEFAULT 'Todo'
                        CHECK (status IN ('Todo','In Progress','Review','Done','Cancelled')),
    assigned_to     BIGINT REFERENCES employees(id),
    start_date      DATE,
    due_date        DATE,
    completed_date  DATE,
    estimated_hours NUMERIC(8,2) DEFAULT 0,
    actual_hours    NUMERIC(8,2) DEFAULT 0,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tasks_project   ON tasks(project_id);
CREATE INDEX idx_tasks_assigned  ON tasks(assigned_to);
CREATE INDEX idx_tasks_status    ON tasks(status);

-- time_entries
CREATE TABLE time_entries (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     BIGINT NOT NULL REFERENCES employees(id),
    task_id         BIGINT REFERENCES tasks(id),
    project_id      BIGINT REFERENCES projects(id),
    date            DATE NOT NULL,
    hours           NUMERIC(6,2) NOT NULL DEFAULT 0,
    description     TEXT,
    is_billable     BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_time_entries_employee ON time_entries(employee_id);
CREATE INDEX idx_time_entries_project  ON time_entries(project_id);
CREATE INDEX idx_time_entries_task     ON time_entries(task_id);
CREATE INDEX idx_time_entries_date     ON time_entries(date);

-- assets
CREATE TABLE assets (
    id              BIGSERIAL PRIMARY KEY,
    asset_code      VARCHAR(30) NOT NULL UNIQUE,
    name            VARCHAR(150) NOT NULL,
    category        VARCHAR(100),
    description     TEXT,
    purchase_date   DATE,
    purchase_price  NUMERIC(18,2) DEFAULT 0,
    current_value   NUMERIC(18,2) DEFAULT 0,
    location        VARCHAR(150),
    assigned_to     BIGINT REFERENCES employees(id),
    serial_number   VARCHAR(100),
    status          VARCHAR(20) NOT NULL DEFAULT 'Active'
                        CHECK (status IN ('Active','Under Maintenance','Disposed','Transferred')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_assets_status   ON assets(status);
CREATE INDEX idx_assets_assigned ON assets(assigned_to);
CREATE INDEX idx_assets_category ON assets(category);

-- asset_maintenance
CREATE TABLE asset_maintenance (
    id                  BIGSERIAL PRIMARY KEY,
    asset_id            BIGINT NOT NULL REFERENCES assets(id),
    maintenance_type    VARCHAR(50)
                            CHECK (maintenance_type IN ('Preventive','Corrective','Overhaul')),
    description         TEXT,
    scheduled_date      DATE,
    completed_date      DATE,
    cost                NUMERIC(18,2) DEFAULT 0,
    performed_by        VARCHAR(150),
    status              VARCHAR(20) NOT NULL DEFAULT 'Scheduled'
                            CHECK (status IN ('Scheduled','In Progress','Completed','Cancelled')),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_asset_maint_asset  ON asset_maintenance(asset_id);
CREATE INDEX idx_asset_maint_status ON asset_maintenance(status);

-- asset_transfers
CREATE TABLE asset_transfers (
    id              BIGSERIAL PRIMARY KEY,
    asset_id        BIGINT NOT NULL REFERENCES assets(id),
    from_employee   BIGINT REFERENCES employees(id),
    to_employee     BIGINT REFERENCES employees(id),
    from_location   VARCHAR(150),
    to_location     VARCHAR(150),
    transfer_date   DATE NOT NULL,
    reason          TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'Pending'
                        CHECK (status IN ('Pending','Approved','Completed','Rejected')),
    requested_by    BIGINT REFERENCES employees(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_asset_trans_asset  ON asset_transfers(asset_id);
CREATE INDEX idx_asset_trans_status ON asset_transfers(status);

-- asset_depreciation
CREATE TABLE asset_depreciation (
    id              BIGSERIAL PRIMARY KEY,
    asset_id        BIGINT NOT NULL REFERENCES assets(id),
    period_year     INT NOT NULL,
    period_month    INT NOT NULL CHECK (period_month BETWEEN 1 AND 12),
    opening_value   NUMERIC(18,2) DEFAULT 0,
    depreciation    NUMERIC(18,2) DEFAULT 0,
    closing_value   NUMERIC(18,2) DEFAULT 0,
    method          VARCHAR(30) DEFAULT 'Straight-Line',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_assetdep_asset  ON asset_depreciation(asset_id);
CREATE INDEX idx_assetdep_period ON asset_depreciation(period_year, period_month);
