-- ============================================================
-- V8: Manufacturing — BOM, Production Orders, Work Orders, QC
-- ============================================================

-- bill_of_materials
CREATE TABLE bill_of_materials (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT NOT NULL REFERENCES products(id),
    name            VARCHAR(150),
    version         VARCHAR(20) DEFAULT '1.0',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    description     TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_bom_product    ON bill_of_materials(product_id);
CREATE INDEX idx_bom_active     ON bill_of_materials(is_active);

-- bom_items
CREATE TABLE bom_items (
    id              BIGSERIAL PRIMARY KEY,
    bom_id          BIGINT NOT NULL REFERENCES bill_of_materials(id) ON DELETE CASCADE,
    component_id    BIGINT NOT NULL REFERENCES products(id),
    quantity        NUMERIC(18,3) NOT NULL DEFAULT 1,
    unit            VARCHAR(20),
    notes           TEXT
);
CREATE INDEX idx_bom_items_bom  ON bom_items(bom_id);
CREATE INDEX idx_bom_items_comp ON bom_items(component_id);

-- production_orders
CREATE TABLE production_orders (
    id                  BIGSERIAL PRIMARY KEY,
    order_number        VARCHAR(30) NOT NULL UNIQUE,
    product_id          BIGINT NOT NULL REFERENCES products(id),
    bom_id              BIGINT REFERENCES bill_of_materials(id),
    planned_qty         NUMERIC(18,3) NOT NULL DEFAULT 0,
    produced_qty        NUMERIC(18,3) DEFAULT 0,
    planned_start       DATE,
    planned_end         DATE,
    actual_start        TIMESTAMP,
    actual_end          TIMESTAMP,
    status              VARCHAR(20) NOT NULL DEFAULT 'Draft'
                            CHECK (status IN ('Draft','Scheduled','In Progress','Completed','Cancelled')),
    priority            VARCHAR(10) DEFAULT 'Normal'
                            CHECK (priority IN ('Low','Normal','High','Urgent')),
    notes               TEXT,
    created_by          BIGINT REFERENCES users(id),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_po_product ON production_orders(product_id);
CREATE INDEX idx_prod_order_status  ON production_orders(status);
CREATE INDEX idx_po_dates   ON production_orders(planned_start, planned_end);

-- work_orders
CREATE TABLE work_orders (
    id                  BIGSERIAL PRIMARY KEY,
    work_order_number   VARCHAR(30) NOT NULL UNIQUE,
    production_order_id BIGINT REFERENCES production_orders(id),
    work_center         VARCHAR(100),
    operation           VARCHAR(150),
    planned_hours       NUMERIC(8,2) DEFAULT 0,
    actual_hours        NUMERIC(8,2) DEFAULT 0,
    planned_start       TIMESTAMP,
    planned_end         TIMESTAMP,
    actual_start        TIMESTAMP,
    actual_end          TIMESTAMP,
    status              VARCHAR(20) NOT NULL DEFAULT 'Pending'
                            CHECK (status IN ('Pending','In Progress','Completed','Cancelled')),
    assigned_to         BIGINT REFERENCES employees(id),
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_wo_production ON work_orders(production_order_id);
CREATE INDEX idx_wo_status     ON work_orders(status);
CREATE INDEX idx_wo_assigned   ON work_orders(assigned_to);

-- quality_control
CREATE TABLE quality_control (
    id                  BIGSERIAL PRIMARY KEY,
    production_order_id BIGINT REFERENCES production_orders(id),
    product_id          BIGINT REFERENCES products(id),
    inspection_date     DATE NOT NULL,
    batch_number        VARCHAR(50),
    total_inspected     NUMERIC(18,3) DEFAULT 0,
    passed              NUMERIC(18,3) DEFAULT 0,
    failed              NUMERIC(18,3) DEFAULT 0,
    result              VARCHAR(20) NOT NULL DEFAULT 'Pending'
                            CHECK (result IN ('Pending','Passed','Failed','Partial')),
    inspector_id        BIGINT REFERENCES employees(id),
    remarks             TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_qc_production ON quality_control(production_order_id);
CREATE INDEX idx_qc_result     ON quality_control(result);
CREATE INDEX idx_qc_date       ON quality_control(inspection_date);
