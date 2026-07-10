-- ============================================================
-- V5: Inventory — Warehouses, Products, Stock Levels, Movements
-- ============================================================

-- warehouses
CREATE TABLE warehouses (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    code        VARCHAR(20) UNIQUE,
    address     TEXT,
    city        VARCHAR(100),
    country     VARCHAR(100) DEFAULT 'Indonesia',
    manager_id  BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_warehouses_active   ON warehouses(is_active);
CREATE INDEX idx_warehouses_manager  ON warehouses(manager_id);

-- products
CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,
    sku             VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    category        VARCHAR(100),
    unit            VARCHAR(20) DEFAULT 'pcs',
    unit_price      NUMERIC(18,2) DEFAULT 0,
    cost_price      NUMERIC(18,2) DEFAULT 0,
    reorder_level   INT DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    image_url       VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_products_sku        ON products(sku);
CREATE INDEX idx_products_category   ON products(category);
CREATE INDEX idx_products_active     ON products(is_active);

-- stock_levels (per warehouse per product)
CREATE TABLE stock_levels (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT NOT NULL REFERENCES products(id),
    warehouse_id    BIGINT NOT NULL REFERENCES warehouses(id),
    quantity        NUMERIC(18,3) NOT NULL DEFAULT 0,
    reserved_qty    NUMERIC(18,3) DEFAULT 0,
    last_updated    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, warehouse_id)
);
CREATE INDEX idx_stock_product    ON stock_levels(product_id);
CREATE INDEX idx_stock_warehouse  ON stock_levels(warehouse_id);
CREATE INDEX idx_stock_qty        ON stock_levels(quantity);

-- stock_movements
CREATE TABLE stock_movements (
    id              BIGSERIAL PRIMARY KEY,
    product_id      BIGINT NOT NULL REFERENCES products(id),
    warehouse_id    BIGINT NOT NULL REFERENCES warehouses(id),
    movement_type   VARCHAR(30) NOT NULL
                        CHECK (movement_type IN ('IN','OUT','TRANSFER','ADJUSTMENT','RETURN')),
    quantity        NUMERIC(18,3) NOT NULL,
    unit_cost       NUMERIC(18,2) DEFAULT 0,
    reference_type  VARCHAR(50),    -- e.g. 'PURCHASE_ORDER', 'SALES_ORDER'
    reference_id    BIGINT,
    notes           TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_movements_product   ON stock_movements(product_id);
CREATE INDEX idx_movements_warehouse ON stock_movements(warehouse_id);
CREATE INDEX idx_movements_type      ON stock_movements(movement_type);
CREATE INDEX idx_movements_date      ON stock_movements(created_at);
CREATE INDEX idx_movements_reference ON stock_movements(reference_type, reference_id);
