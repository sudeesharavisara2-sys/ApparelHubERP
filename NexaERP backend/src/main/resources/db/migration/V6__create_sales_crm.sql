-- ============================================================
-- V6: Sales & CRM
-- ============================================================

-- customers
CREATE TABLE customers (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(20) UNIQUE,
    email           VARCHAR(150),
    phone           VARCHAR(30),
    address         TEXT,
    city            VARCHAR(100),
    country         VARCHAR(100) DEFAULT 'Indonesia',
    tax_id          VARCHAR(50),
    credit_limit    NUMERIC(18,2) DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_customers_name   ON customers(name);
CREATE INDEX idx_customers_active ON customers(is_active);

-- sales_quotations
CREATE TABLE sales_quotations (
    id              BIGSERIAL PRIMARY KEY,
    quotation_number VARCHAR(30) NOT NULL UNIQUE,
    customer_id     BIGINT NOT NULL REFERENCES customers(id),
    date            DATE NOT NULL,
    valid_until     DATE,
    subtotal        NUMERIC(18,2) DEFAULT 0,
    tax_amount      NUMERIC(18,2) DEFAULT 0,
    discount        NUMERIC(18,2) DEFAULT 0,
    total           NUMERIC(18,2) DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'Draft'
                        CHECK (status IN ('Draft','Sent','Accepted','Rejected','Expired')),
    notes           TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_sq_customer ON sales_quotations(customer_id);
CREATE INDEX idx_sq_status   ON sales_quotations(status);
CREATE INDEX idx_sq_date     ON sales_quotations(date);

-- sales_quotation_items
CREATE TABLE sales_quotation_items (
    id              BIGSERIAL PRIMARY KEY,
    quotation_id    BIGINT NOT NULL REFERENCES sales_quotations(id) ON DELETE CASCADE,
    product_id      BIGINT REFERENCES products(id),
    product_name    VARCHAR(150),
    quantity        NUMERIC(18,3) NOT NULL DEFAULT 1,
    unit_price      NUMERIC(18,2) NOT NULL DEFAULT 0,
    discount_pct    NUMERIC(5,2) DEFAULT 0,
    subtotal        NUMERIC(18,2) DEFAULT 0
);
CREATE INDEX idx_sqi_quotation ON sales_quotation_items(quotation_id);

-- sales_orders
CREATE TABLE sales_orders (
    id              BIGSERIAL PRIMARY KEY,
    order_number    VARCHAR(30) NOT NULL UNIQUE,
    customer_id     BIGINT NOT NULL REFERENCES customers(id),
    quotation_id    BIGINT REFERENCES sales_quotations(id),
    date            DATE NOT NULL,
    delivery_date   DATE,
    subtotal        NUMERIC(18,2) DEFAULT 0,
    tax_amount      NUMERIC(18,2) DEFAULT 0,
    discount        NUMERIC(18,2) DEFAULT 0,
    total           NUMERIC(18,2) DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'Draft'
                        CHECK (status IN ('Draft','Confirmed','Processing','Shipped','Delivered','Cancelled')),
    shipping_address TEXT,
    notes           TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_so_customer ON sales_orders(customer_id);
CREATE INDEX idx_so_status   ON sales_orders(status);
CREATE INDEX idx_so_date     ON sales_orders(date);

-- sales_order_items
CREATE TABLE sales_order_items (
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
    product_id      BIGINT REFERENCES products(id),
    product_name    VARCHAR(150),
    quantity        NUMERIC(18,3) NOT NULL DEFAULT 1,
    unit_price      NUMERIC(18,2) NOT NULL DEFAULT 0,
    discount_pct    NUMERIC(5,2) DEFAULT 0,
    subtotal        NUMERIC(18,2) DEFAULT 0
);
CREATE INDEX idx_soi_order ON sales_order_items(order_id);

-- sales_invoices
CREATE TABLE sales_invoices (
    id              BIGSERIAL PRIMARY KEY,
    invoice_number  VARCHAR(30) NOT NULL UNIQUE,
    customer_id     BIGINT NOT NULL REFERENCES customers(id),
    order_id        BIGINT REFERENCES sales_orders(id),
    date            DATE NOT NULL,
    due_date        DATE,
    subtotal        NUMERIC(18,2) DEFAULT 0,
    tax_amount      NUMERIC(18,2) DEFAULT 0,
    total           NUMERIC(18,2) DEFAULT 0,
    paid_amount     NUMERIC(18,2) DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'Draft'
                        CHECK (status IN ('Draft','Sent','Partial','Paid','Overdue','Cancelled')),
    notes           TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_si_customer ON sales_invoices(customer_id);
CREATE INDEX idx_si_status   ON sales_invoices(status);
CREATE INDEX idx_si_due      ON sales_invoices(due_date);

-- Add FK accounts_receivable → customers, sales_orders
ALTER TABLE accounts_receivable
    ADD CONSTRAINT fk_ar_customer    FOREIGN KEY (customer_id)   REFERENCES customers(id),
    ADD CONSTRAINT fk_ar_sales_order FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id);

-- CRM: leads
CREATE TABLE leads (
    id              BIGSERIAL PRIMARY KEY,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    company         VARCHAR(150),
    email           VARCHAR(150),
    phone           VARCHAR(30),
    source          VARCHAR(50)
                        CHECK (source IN ('Website','Referral','Cold Call','Email','Event','Social Media','Other')),
    status          VARCHAR(20) NOT NULL DEFAULT 'New'
                        CHECK (status IN ('New','Contacted','Qualified','Unqualified','Converted')),
    assigned_to     BIGINT REFERENCES employees(id),
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_leads_status      ON leads(status);
CREATE INDEX idx_leads_assigned    ON leads(assigned_to);

-- opportunities
CREATE TABLE opportunities (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    customer_id     BIGINT REFERENCES customers(id),
    lead_id         BIGINT REFERENCES leads(id),
    value           NUMERIC(18,2) DEFAULT 0,
    currency        VARCHAR(10) DEFAULT 'IDR',
    stage           VARCHAR(50) NOT NULL DEFAULT 'Prospecting'
                        CHECK (stage IN ('Prospecting','Qualification','Proposal','Negotiation','Closed Won','Closed Lost')),
    probability     INT DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
    expected_close  DATE,
    owner_id        BIGINT REFERENCES employees(id),
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_opp_stage    ON opportunities(stage);
CREATE INDEX idx_opp_owner    ON opportunities(owner_id);
CREATE INDEX idx_opp_customer ON opportunities(customer_id);

-- activities (CRM)
CREATE TABLE activities (
    id              BIGSERIAL PRIMARY KEY,
    type            VARCHAR(30) NOT NULL
                        CHECK (type IN ('Call','Email','Meeting','Task','Note')),
    subject         VARCHAR(255) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'Planned'
                        CHECK (status IN ('Planned','Completed','Cancelled')),
    due_date        TIMESTAMP,
    lead_id         BIGINT REFERENCES leads(id),
    opportunity_id  BIGINT REFERENCES opportunities(id),
    customer_id     BIGINT REFERENCES customers(id),
    assigned_to     BIGINT REFERENCES employees(id),
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_activities_status   ON activities(status);
CREATE INDEX idx_activities_assigned ON activities(assigned_to);
CREATE INDEX idx_activities_type     ON activities(type);

-- campaigns
CREATE TABLE campaigns (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    type            VARCHAR(50)
                        CHECK (type IN ('Email','Social Media','Event','Print','Online Ad','Other')),
    status          VARCHAR(20) NOT NULL DEFAULT 'Planned'
                        CHECK (status IN ('Planned','Active','Completed','Cancelled')),
    start_date      DATE,
    end_date        DATE,
    budget          NUMERIC(18,2) DEFAULT 0,
    actual_cost     NUMERIC(18,2) DEFAULT 0,
    target_audience TEXT,
    description     TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates  ON campaigns(start_date, end_date);
