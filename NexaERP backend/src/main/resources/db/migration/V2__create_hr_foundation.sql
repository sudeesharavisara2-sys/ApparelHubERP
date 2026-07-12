-- ============================================================
-- V2: HR Foundation — Departments, Employees, Users
-- ============================================================

-- departments (self-ref: parent_dept_id, manager set after employees)
CREATE TABLE departments (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(20) UNIQUE,
    description     VARCHAR(255),
    parent_dept_id  BIGINT REFERENCES departments(id),
    manager_id      BIGINT,                 -- FK added after employees
    budget          NUMERIC(18,2) DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_departments_parent   ON departments(parent_dept_id);
CREATE INDEX idx_departments_active   ON departments(is_active);

-- employees
CREATE TABLE employees (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     VARCHAR(20) NOT NULL UNIQUE,
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    phone           VARCHAR(20),
    department_id   BIGINT REFERENCES departments(id),
    position        VARCHAR(100),
    hire_date       DATE,
    end_date        DATE,
    status          VARCHAR(20) NOT NULL DEFAULT 'Active'
                        CHECK (status IN ('Active','Inactive','On Leave','Terminated')),
    salary          NUMERIC(18,2) DEFAULT 0,
    address         TEXT,
    photo_url       VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_status     ON employees(status);
CREATE INDEX idx_employees_email      ON employees(email);

-- Now add the FK for departments.manager_id
ALTER TABLE departments ADD CONSTRAINT fk_dept_manager
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL;

-- users
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(50) NOT NULL UNIQUE,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    employee_id     BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login      TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_username   ON users(username);
CREATE INDEX idx_users_email      ON users(email);
CREATE INDEX idx_users_employee   ON users(employee_id);
CREATE INDEX idx_users_active     ON users(is_active);

-- user_roles (many-to-many)
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- audit_logs (depends on users)
CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT REFERENCES users(id) ON DELETE SET NULL,
    module      VARCHAR(100),
    action      VARCHAR(50),
    entity      VARCHAR(100),
    entity_id   BIGINT,
    old_values  JSONB,
    new_values  JSONB,
    ip_address  VARCHAR(45),
    timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_user_id   ON audit_logs(user_id);
CREATE INDEX idx_audit_module    ON audit_logs(module);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_entity    ON audit_logs(entity, entity_id);

-- Add FK settings → users
ALTER TABLE settings ADD CONSTRAINT fk_settings_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;
