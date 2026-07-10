-- ============================================================
-- V7: Purchasing — Vendors, Requisitions, Orders, Invoices
-- ============================================================

-- vendors
CREATE TABLE vendors (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(20) UNIQUE,
    email           VARCHAR(150),
    phone           VARCHAR(30),
    address         TEXT,
    city            VARCHAR(100),
    country         VARCHAR(100) DEFAULT 'Indonesia',
    tax_id          VARCHAR(50),
    payment_terms   INT DEFAULT 30,         -- days
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_vendors_name   ON vendors(name);
CREATE INDEX idx_vendors_active ON vendors(is_active);

-- purchase_requisitions
CREATE TABLE purchase_requisitions (
    id              BIGSERIAL PRIMARY KEY,
    pr_number       VARCHAR(30) NOT NULL UNIQUE,
    requested_by    BIGINT REFERENCES employees(id),
    department_id   BIGINT REFERENCES departments(id),
    date            DATE NOT NULL,
    needed_by       DATE,
    status          VARCHAR(20) NOT NULL DEFAULT 'Draft'
                        CHECK (status IN ('Draft','Pending','Approved','Rejected','Fulfilled')),
    approved_by     BIGINT REFERENCES users(id),
    approved_at     TIMESTAMP,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_pr_status     ON purchase_requisitions(status);
CREATE INDEX idx_pr_department ON purchase_requisitions(department_id);

-- purchase_requisition_items
CREATE TABLE purchase_requisition_items (
    id              BIGSERIAL PRIMARY KEY,
    pr_id           BIGINT NOT NULL REFERENCES purchase_requisitions(id) ON DELETE CASCADE,
    product_id      BIGINT REFERENCES products(id),
    product_name    VARCHAR(150),
    quantity        NUMERIC(18,3) NOT NULL DEFAULT 1,
    unit            VARCHAR(20),
    estimated_price NUMERIC(18,2) DEFAULT 0,
    notes           TEXT
);
CREATE INDEX idx_pri_pr ON purchase_requisition_items(pr_id);

-- purchase_orders
CREATE TABLE purchase_orders (
    id              BIGSERIAL PRIMARY KEY,
    po_number       VARCHAR(30) NOT NULL UNIQUE,
    vendor_id       BIGINT NOT NULL REFERENCES vendors(id),
    pr_id           BIGINT REFERENCES purchase_requisitions(id),
    date            DATE NOT NULL,
    expected_date   DATE,
    subtotal        NUMERIC(18,2) DEFAULT 0,
    tax_amount      NUMERIC(18,2) DEFAULT 0,
    total           NUMERIC(18,2) DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'Draft'
                        CHECK (status IN ('Draft','Sent','Confirmed','Receiving','Received','Cancelled')),
    notes           TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_date   ON purchase_orders(date);

-- purchase_order_items
CREATE TABLE purchase_order_items (
    id              BIGSERIAL PRIMARY KEY,
    po_id           BIGINT NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id      BIGINT REFERENCES products(id),
    product_name    VARCHAR(150),
    quantity        NUMERIC(18,3) NOT NULL DEFAULT 1,
    unit_price      NUMERIC(18,2) NOT NULL DEFAULT 0,
    received_qty    NUMERIC(18,3) DEFAULT 0,
    subtotal        NUMERIC(18,2) DEFAULT 0
);
CREATE INDEX idx_poi_po ON purchase_order_items(po_id);

-- purchase_invoices
CREATE TABLE purchase_invoices (
    id              BIGSERIAL PRIMARY KEY,
    invoice_number  VARCHAR(50) NOT NULL,
    vendor_id       BIGINT NOT NULL REFERENCES vendors(id),
    po_id           BIGINT REFERENCES purchase_orders(id),
    date            DATE NOT NULL,
    due_date        DATE,
    subtotal        NUMERIC(18,2) DEFAULT 0,
    tax_amount      NUMERIC(18,2) DEFAULT 0,
    total           NUMERIC(18,2) DEFAULT 0,
    paid_amount     NUMERIC(18,2) DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'Draft'
                        CHECK (status IN ('Draft','Approved','Partial','Paid','Overdue','Cancelled')),
    notes           TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_pinv_vendor ON purchase_invoices(vendor_id);
CREATE INDEX idx_pinv_status ON purchase_invoices(status);
CREATE INDEX idx_pinv_due    ON purchase_invoices(due_date);

-- Add FK: accounts_payable → vendors, purchase_orders
ALTER TABLE accounts_payable
    ADD CONSTRAINT fk_ap_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    ADD CONSTRAINT fk_ap_po     FOREIGN KEY (po_id)     REFERENCES purchase_orders(id);
