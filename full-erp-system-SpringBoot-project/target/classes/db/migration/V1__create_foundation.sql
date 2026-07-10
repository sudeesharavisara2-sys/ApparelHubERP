-- ============================================================
-- V1: Foundation — Roles, Permissions, Audit, Settings
-- ============================================================

-- roles
CREATE TABLE roles (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_system   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_roles_name ON roles(name);

-- permissions
CREATE TABLE permissions (
    id          BIGSERIAL PRIMARY KEY,
    module      VARCHAR(100) NOT NULL,
    sub_module  VARCHAR(100) NOT NULL,
    action      VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    UNIQUE (module, sub_module, action)
);
CREATE INDEX idx_permissions_module ON permissions(module);

-- role_permissions
CREATE TABLE role_permissions (
    role_id       BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id)       REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- settings
CREATE TABLE settings (
    id          BIGSERIAL PRIMARY KEY,
    key         VARCHAR(100) NOT NULL UNIQUE,
    value       TEXT,
    description VARCHAR(255),
    type        VARCHAR(50) DEFAULT 'string',
    updated_by  BIGINT,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_settings_key ON settings(key);
