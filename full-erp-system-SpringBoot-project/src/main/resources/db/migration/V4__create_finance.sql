-- ============================================================
-- V4: Finance — Chart of Accounts, Journals, AP/AR, Budgets
-- ============================================================

-- chart_of_accounts
CREATE TABLE chart_of_accounts (
    id                  BIGSERIAL PRIMARY KEY,
    account_code        VARCHAR(20) NOT NULL UNIQUE,
    account_name        VARCHAR(150) NOT NULL,
    account_type        VARCHAR(50) NOT NULL
                            CHECK (account_type IN ('Asset','Liability','Equity','Revenue','Expense')),
    balance_type        VARCHAR(10) NOT NULL DEFAULT 'Debit'
                            CHECK (balance_type IN ('Debit','Credit')),
    parent_account_id   BIGINT REFERENCES chart_of_accounts(id),
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    description         TEXT,
    opening_balance     NUMERIC(18,2) DEFAULT 0,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_coa_type       ON chart_of_accounts(account_type);
CREATE INDEX idx_coa_parent     ON chart_of_accounts(parent_account_id);
CREATE INDEX idx_coa_code       ON chart_of_accounts(account_code);

-- journal_entries
CREATE TABLE journal_entries (
    id              BIGSERIAL PRIMARY KEY,
    entry_number    VARCHAR(30) NOT NULL UNIQUE,
    date            DATE NOT NULL,
    description     VARCHAR(255),
    reference       VARCHAR(100),
    status          VARCHAR(20) NOT NULL DEFAULT 'Draft'
                        CHECK (status IN ('Draft','Posted','Cancelled')),
    total_debit     NUMERIC(18,2) DEFAULT 0,
    total_credit    NUMERIC(18,2) DEFAULT 0,
    posted_by       BIGINT REFERENCES users(id),
    posted_at       TIMESTAMP,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_je_date     ON journal_entries(date);
CREATE INDEX idx_je_status   ON journal_entries(status);
CREATE INDEX idx_je_number   ON journal_entries(entry_number);

-- journal_entry_lines
CREATE TABLE journal_entry_lines (
    id              BIGSERIAL PRIMARY KEY,
    journal_id      BIGINT NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id      BIGINT NOT NULL REFERENCES chart_of_accounts(id),
    debit           NUMERIC(18,2) DEFAULT 0,
    credit          NUMERIC(18,2) DEFAULT 0,
    description     VARCHAR(255),
    line_order      INT DEFAULT 0
);
CREATE INDEX idx_jel_journal  ON journal_entry_lines(journal_id);
CREATE INDEX idx_jel_account  ON journal_entry_lines(account_id);

-- budgets
CREATE TABLE budgets (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    department_id   BIGINT REFERENCES departments(id),
    period_year     INT NOT NULL,
    period_month    INT CHECK (period_month BETWEEN 1 AND 12),
    account_id      BIGINT REFERENCES chart_of_accounts(id),
    budgeted_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
    actual_amount   NUMERIC(18,2) DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'Draft'
                        CHECK (status IN ('Draft','Approved','Closed')),
    notes           TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_budgets_dept    ON budgets(department_id);
CREATE INDEX idx_budgets_period  ON budgets(period_year, period_month);
CREATE INDEX idx_budgets_status  ON budgets(status);

-- accounts_payable (vendors linked after V5 Purchasing)
CREATE TABLE accounts_payable (
    id              BIGSERIAL PRIMARY KEY,
    vendor_id       BIGINT,               -- FK added later
    vendor_name     VARCHAR(150),
    invoice_number  VARCHAR(50),
    invoice_date    DATE,
    due_date        DATE,
    amount          NUMERIC(18,2) NOT NULL DEFAULT 0,
    paid_amount     NUMERIC(18,2) DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'Unpaid'
                        CHECK (status IN ('Unpaid','Partial','Paid','Overdue')),
    po_id           BIGINT,               -- FK added after purchase_orders
    notes           TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ap_status    ON accounts_payable(status);
CREATE INDEX idx_ap_due      ON accounts_payable(due_date);
CREATE INDEX idx_ap_vendor   ON accounts_payable(vendor_id);

-- accounts_receivable (customers linked after V6)
CREATE TABLE accounts_receivable (
    id              BIGSERIAL PRIMARY KEY,
    customer_id     BIGINT,               -- FK added later
    customer_name   VARCHAR(150),
    invoice_number  VARCHAR(50),
    invoice_date    DATE,
    due_date        DATE,
    amount          NUMERIC(18,2) NOT NULL DEFAULT 0,
    paid_amount     NUMERIC(18,2) DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'Unpaid'
                        CHECK (status IN ('Unpaid','Partial','Paid','Overdue')),
    sales_order_id  BIGINT,               -- FK added after sales_orders
    notes           TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ar_status    ON accounts_receivable(status);
CREATE INDEX idx_ar_due       ON accounts_receivable(due_date);
CREATE INDEX idx_ar_customer  ON accounts_receivable(customer_id);
