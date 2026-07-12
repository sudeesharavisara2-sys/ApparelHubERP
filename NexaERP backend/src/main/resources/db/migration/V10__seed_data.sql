-- ============================================================
-- V10: Seed Data — Roles, Permissions, Users, Departments,
--                  Employees, Products, Customers, Vendors
-- ============================================================

-- ─── ROLES ────────────────────────────────────────────────
INSERT INTO roles (name, description, is_system) VALUES
('SUPER_ADMIN', 'Full system access', TRUE),
('FINANCE_MANAGER', 'Finance module management', FALSE),
('HR_MANAGER', 'HR module management', FALSE),
('SALES_MANAGER', 'Sales & CRM management', FALSE),
('PURCHASING_MANAGER', 'Purchasing management', FALSE),
('INVENTORY_MANAGER', 'Inventory management', FALSE),
('MANUFACTURING_MANAGER', 'Manufacturing management', FALSE),
('PROJECT_MANAGER', 'Project management', FALSE),
('EMPLOYEE', 'Basic employee access', FALSE),
('VIEWER', 'Read-only access', FALSE);

-- ─── PERMISSIONS ──────────────────────────────────────────
INSERT INTO permissions (module, sub_module, action) VALUES
('FINANCE','CHART_OF_ACCOUNTS','READ'),
('FINANCE','CHART_OF_ACCOUNTS','CREATE'),
('FINANCE','CHART_OF_ACCOUNTS','UPDATE'),
('FINANCE','CHART_OF_ACCOUNTS','DELETE'),
('FINANCE','JOURNAL_ENTRIES','READ'),
('FINANCE','JOURNAL_ENTRIES','CREATE'),
('FINANCE','JOURNAL_ENTRIES','APPROVE'),
('FINANCE','ACCOUNTS_PAYABLE','READ'),
('FINANCE','ACCOUNTS_PAYABLE','CREATE'),
('FINANCE','ACCOUNTS_PAYABLE','APPROVE'),
('FINANCE','ACCOUNTS_RECEIVABLE','READ'),
('FINANCE','ACCOUNTS_RECEIVABLE','CREATE'),
('FINANCE','ACCOUNTS_RECEIVABLE','APPROVE'),
('FINANCE','BUDGETS','READ'),
('FINANCE','BUDGETS','CREATE'),
('HR','EMPLOYEES','READ'),
('HR','EMPLOYEES','CREATE'),
('HR','EMPLOYEES','UPDATE'),
('HR','EMPLOYEES','DELETE'),
('HR','DEPARTMENTS','READ'),
('HR','DEPARTMENTS','CREATE'),
('HR','DEPARTMENTS','UPDATE'),
('HR','ATTENDANCE','READ'),
('HR','ATTENDANCE','CREATE'),
('HR','LEAVE','READ'),
('HR','LEAVE','CREATE'),
('HR','LEAVE','APPROVE'),
('HR','PAYROLL','READ'),
('HR','PAYROLL','CREATE'),
('HR','PAYROLL','APPROVE'),
('SALES','CUSTOMERS','READ'),
('SALES','CUSTOMERS','CREATE'),
('SALES','ORDERS','READ'),
('SALES','ORDERS','CREATE'),
('SALES','INVOICES','READ'),
('SALES','INVOICES','CREATE'),
('PURCHASING','VENDORS','READ'),
('PURCHASING','VENDORS','CREATE'),
('PURCHASING','ORDERS','READ'),
('PURCHASING','ORDERS','CREATE'),
('PURCHASING','ORDERS','APPROVE'),
('INVENTORY','PRODUCTS','READ'),
('INVENTORY','PRODUCTS','CREATE'),
('INVENTORY','PRODUCTS','UPDATE'),
('INVENTORY','STOCK_LEVELS','READ'),
('INVENTORY','STOCK_MOVEMENTS','READ'),
('INVENTORY','STOCK_MOVEMENTS','CREATE'),
('MANUFACTURING','BOM','READ'),
('MANUFACTURING','BOM','CREATE'),
('MANUFACTURING','PRODUCTION','READ'),
('MANUFACTURING','PRODUCTION','CREATE'),
('PROJECTS','PROJECTS','READ'),
('PROJECTS','PROJECTS','CREATE'),
('PROJECTS','TASKS','READ'),
('PROJECTS','TASKS','CREATE');

-- SUPER_ADMIN gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'SUPER_ADMIN';

-- ─── DEPARTMENTS ──────────────────────────────────────────
INSERT INTO departments (name, code, description) VALUES
('Executive',        'EXEC',  'Executive leadership'),
('Finance',          'FIN',   'Finance & accounting'),
('Human Resources',  'HR',    'People management'),
('Sales',            'SALES', 'Sales & revenue'),
('Purchasing',       'PURCH', 'Procurement'),
('Inventory',        'INV',   'Warehouse & stock'),
('Manufacturing',    'MFG',   'Production'),
('Projects',         'PROJ',  'Project delivery'),
('IT',               'IT',    'Technology & systems');

-- ─── EMPLOYEES ────────────────────────────────────────────
INSERT INTO employees (employee_id, full_name, email, phone, department_id, position, hire_date, status, salary) VALUES
('EMP001', 'Budi Santoso',       'budi.santoso@erp.id',      '081234560001', (SELECT id FROM departments WHERE code='EXEC'),  'CEO',                   '2020-01-15', 'Active', 25000000),
('EMP002', 'Sinta Dewi',         'sinta.dewi@erp.id',        '081234560002', (SELECT id FROM departments WHERE code='FIN'),   'Finance Manager',       '2020-03-01', 'Active', 15000000),
('EMP003', 'Ahmad Fauzi',        'ahmad.fauzi@erp.id',       '081234560003', (SELECT id FROM departments WHERE code='HR'),    'HR Manager',            '2020-03-01', 'Active', 14000000),
('EMP004', 'Rina Marlina',       'rina.marlina@erp.id',      '081234560004', (SELECT id FROM departments WHERE code='SALES'), 'Sales Manager',         '2020-04-01', 'Active', 14000000),
('EMP005', 'Dimas Pratama',      'dimas.pratama@erp.id',     '081234560005', (SELECT id FROM departments WHERE code='PURCH'), 'Purchasing Manager',    '2020-04-01', 'Active', 13000000),
('EMP006', 'Lestari Wahyuni',    'lestari.wahyuni@erp.id',   '081234560006', (SELECT id FROM departments WHERE code='INV'),   'Inventory Manager',     '2020-05-01', 'Active', 13000000),
('EMP007', 'Rizky Firmansyah',   'rizky.firmansyah@erp.id',  '081234560007', (SELECT id FROM departments WHERE code='MFG'),   'Manufacturing Manager', '2020-05-01', 'Active', 13000000),
('EMP008', 'Maya Kusuma',        'maya.kusuma@erp.id',       '081234560008', (SELECT id FROM departments WHERE code='PROJ'),  'Project Manager',       '2020-06-01', 'Active', 13000000),
('EMP009', 'Hendra Gunawan',     'hendra.gunawan@erp.id',    '081234560009', (SELECT id FROM departments WHERE code='FIN'),   'Accountant',            '2021-01-10', 'Active',  9000000),
('EMP010', 'Putri Handayani',    'putri.handayani@erp.id',   '081234560010', (SELECT id FROM departments WHERE code='HR'),    'HR Staff',              '2021-02-01', 'Active',  8000000),
('EMP011', 'Agus Setiawan',      'agus.setiawan@erp.id',     '081234560011', (SELECT id FROM departments WHERE code='SALES'), 'Sales Representative',  '2021-03-15', 'Active',  8500000),
('EMP012', 'Dewi Anggraini',     'dewi.anggraini@erp.id',    '081234560012', (SELECT id FROM departments WHERE code='INV'),   'Warehouse Staff',       '2021-04-01', 'Active',  7500000),
('EMP013', 'Feri Kurniawan',     'feri.kurniawan@erp.id',    '081234560013', (SELECT id FROM departments WHERE code='MFG'),   'Production Worker',     '2021-05-01', 'Active',  7000000),
('EMP014', 'Novia Rahmawati',    'novia.rahmawati@erp.id',   '081234560014', (SELECT id FROM departments WHERE code='IT'),    'IT Staff',              '2021-06-01', 'Active',  9500000),
('EMP015', 'Surya Nugroho',      'surya.nugroho@erp.id',     '081234560015', (SELECT id FROM departments WHERE code='SALES'), 'Sales Representative',  '2022-01-05', 'Active',  8500000);

-- Update department managers
UPDATE departments SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP001') WHERE code = 'EXEC';
UPDATE departments SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP002') WHERE code = 'FIN';
UPDATE departments SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP003') WHERE code = 'HR';
UPDATE departments SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP004') WHERE code = 'SALES';
UPDATE departments SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP005') WHERE code = 'PURCH';
UPDATE departments SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP006') WHERE code = 'INV';
UPDATE departments SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP007') WHERE code = 'MFG';
UPDATE departments SET manager_id = (SELECT id FROM employees WHERE employee_id = 'EMP008') WHERE code = 'PROJ';

-- ─── USERS ─────────────────────────────────────────────────
-- Passwords are bcrypt hashes of 'Admin1234!' for admin, 'ERP1234!' for others
INSERT INTO users (username, email, password_hash, employee_id, is_active) VALUES
('admin',     'admin@erp.id',              '{noop}Admin@123', (SELECT id FROM employees WHERE employee_id='EMP001'), TRUE),
('sinta',     'sinta.dewi@erp.id',         '{noop}ERP@123',   (SELECT id FROM employees WHERE employee_id='EMP002'), TRUE),
('ahmad',     'ahmad.fauzi@erp.id',        '{noop}ERP@123',   (SELECT id FROM employees WHERE employee_id='EMP003'), TRUE),
('rina',      'rina.marlina@erp.id',       '{noop}ERP@123',   (SELECT id FROM employees WHERE employee_id='EMP004'), TRUE),
('dimas',     'dimas.pratama@erp.id',      '{noop}ERP@123',   (SELECT id FROM employees WHERE employee_id='EMP005'), TRUE),
('lestari',   'lestari.wahyuni@erp.id',    '{noop}ERP@123',   (SELECT id FROM employees WHERE employee_id='EMP006'), TRUE),
('rizky',     'rizky.firmansyah@erp.id',   '{noop}ERP@123',   (SELECT id FROM employees WHERE employee_id='EMP007'), TRUE),
('maya',      'maya.kusuma@erp.id',        '{noop}ERP@123',   (SELECT id FROM employees WHERE employee_id='EMP008'), TRUE);

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username='admin'   AND r.name='SUPER_ADMIN';
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username='sinta'   AND r.name='FINANCE_MANAGER';
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username='ahmad'   AND r.name='HR_MANAGER';
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username='rina'    AND r.name='SALES_MANAGER';
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username='dimas'   AND r.name='PURCHASING_MANAGER';
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username='lestari' AND r.name='INVENTORY_MANAGER';
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username='rizky'   AND r.name='MANUFACTURING_MANAGER';
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username='maya'    AND r.name='PROJECT_MANAGER';

-- ─── PRODUCTS ─────────────────────────────────────────────
INSERT INTO products (sku, name, category, unit, unit_price, cost_price, reorder_level, is_active) VALUES
('PRD001', 'Laptop Asus VivoBook 14',     'Electronics',  'unit', 9500000,  7500000,  5,  TRUE),
('PRD002', 'Monitor Samsung 24"',          'Electronics',  'unit', 2500000,  1800000,  10, TRUE),
('PRD003', 'Keyboard Mechanical Logitech', 'Electronics',  'unit',  750000,   500000,  20, TRUE),
('PRD004', 'Mouse Wireless Logitech',      'Electronics',  'unit',  350000,   220000,  30, TRUE),
('PRD005', 'Meja Kerja Kantor',            'Furniture',    'unit', 1800000,  1200000,  5,  TRUE),
('PRD006', 'Kursi Ergonomis',              'Furniture',    'unit', 2200000,  1500000,  5,  TRUE),
('PRD007', 'Printer HP LaserJet',          'Electronics',  'unit', 3500000,  2500000,  3,  TRUE),
('PRD008', 'Kertas A4 Sinar Dunia 500lbr', 'Stationery',   'rim',   65000,    40000,  50, TRUE),
('PRD009', 'Tinta Printer Canon',          'Stationery',   'pcs',   85000,    55000,  40, TRUE),
('PRD010', 'Headset Sony Office',          'Electronics',  'unit',  450000,   300000,  15, TRUE),
('PRD011', 'Baja Plat 2mm 1m x 2m',       'Raw Material', 'lbr',  350000,   280000,  100,TRUE),
('PRD012', 'Baut M10 x 30mm',             'Raw Material', 'box',   45000,    30000,  200,TRUE),
('PRD013', 'Cat Epoxy Primer 4L',          'Raw Material', 'kaleng',220000,  160000,  50, TRUE),
('PRD014', 'Produk Jadi Rak Besi 2m',      'Finished Goods','unit',800000,   550000,  10, TRUE),
('PRD015', 'Produk Jadi Lemari Kantor',    'Finished Goods','unit',2500000,  1700000, 5,  TRUE);

-- ─── WAREHOUSES ───────────────────────────────────────────
INSERT INTO warehouses (name, code, address, city, manager_id, is_active) VALUES
('Gudang Utama Jakarta',   'WH-JKT', 'Jl. Industri No.1, Kawasan Industri Pulogadung', 'Jakarta',  (SELECT id FROM employees WHERE employee_id='EMP006'), TRUE),
('Gudang Cabang Surabaya', 'WH-SBY', 'Jl. Rungkut Industri No.5',                      'Surabaya', NULL, TRUE),
('Gudang Bahan Baku',      'WH-RAW', 'Jl. Industri No.1 Blok B',                       'Jakarta',  NULL, TRUE);

-- ─── INITIAL STOCK LEVELS ─────────────────────────────────
INSERT INTO stock_levels (product_id, warehouse_id, quantity, reserved_qty)
SELECT p.id, w.id, 
    CASE p.sku
        WHEN 'PRD001' THEN 25  WHEN 'PRD002' THEN 40  WHEN 'PRD003' THEN 80
        WHEN 'PRD004' THEN 120 WHEN 'PRD005' THEN 15  WHEN 'PRD006' THEN 18
        WHEN 'PRD007' THEN 10  WHEN 'PRD008' THEN 200 WHEN 'PRD009' THEN 150
        WHEN 'PRD010' THEN 35  WHEN 'PRD011' THEN 300 WHEN 'PRD012' THEN 500
        WHEN 'PRD013' THEN 100 WHEN 'PRD014' THEN 50  WHEN 'PRD015' THEN 20
        ELSE 0 END,
    0
FROM products p, warehouses w WHERE w.code = 'WH-JKT';

-- ─── CUSTOMERS ────────────────────────────────────────────
INSERT INTO customers (name, code, email, phone, address, city, credit_limit, is_active) VALUES
('PT Maju Bersama',        'CUST001', 'purchasing@majubersama.id',  '02145670001', 'Jl. Sudirman No.10',       'Jakarta',   500000000, TRUE),
('CV Karya Mandiri',       'CUST002', 'order@karyamandiri.id',      '02245670002', 'Jl. Gatot Subroto No.25',  'Bandung',   200000000, TRUE),
('PT Sinar Harapan',       'CUST003', 'admin@sinarharapan.id',      '03145670003', 'Jl. A Yani No.50',         'Surabaya',  300000000, TRUE),
('Toko Sumber Rejeki',     'CUST004', 'toko.sumberrejeki@gmail.com','02745670004', 'Jl. Malioboro No.3',       'Yogyakarta',100000000, TRUE),
('PT Teknologi Digital',   'CUST005', 'procurement@teknodigital.id','02145670005', 'Jl. HR Rasuna Said No.15', 'Jakarta',   750000000, TRUE),
('CV Jaya Abadi',          'CUST006', 'jayaabadi@gmail.com',        '02445670006', 'Jl. Pahlawan No.8',        'Semarang',  150000000, TRUE),
('PT Mitra Usaha',         'CUST007', 'mitra.usaha@email.id',       '02145670007', 'Jl. Kebon Jeruk No.20',    'Jakarta',   250000000, TRUE),
('PT Global Nusantara',    'CUST008', 'global.nusantara@email.id',  '02145670008', 'Jl. Thamrin No.5',         'Jakarta',   600000000, TRUE);

-- ─── VENDORS ──────────────────────────────────────────────
INSERT INTO vendors (name, code, email, phone, address, city, payment_terms, is_active) VALUES
('PT Sumber Elektronik',   'VND001', 'sales@sumberelektronik.id', '02144440001', 'Jl. Mangga Dua No.15',     'Jakarta',  30, TRUE),
('CV Furnitur Jaya',       'VND002', 'order@furniturjaya.id',     '02244440002', 'Jl. Pajajaran No.10',      'Bandung',  45, TRUE),
('PT Baja Nasional',       'VND003', 'penjualan@bajanasional.id', '02144440003', 'Jl. Industri Baja No.1',   'Jakarta',  30, TRUE),
('CV Alat Tulis Mandiri',  'VND004', 'atm@alatulis.id',           '02144440004', 'Jl. Glodok No.5',          'Jakarta',  15, TRUE),
('PT Komponen Teknik',     'VND005', 'sales@komponenteknik.id',   '02144440005', 'Jl. Raya Bekasi No.99',    'Bekasi',   30, TRUE),
('CV Asian Supply',        'VND006', 'asian.supply@email.id',     '02144440006', 'Jl. Pluit No.12',          'Jakarta',  45, TRUE);

-- ─── CHART OF ACCOUNTS (Sample) ───────────────────────────
INSERT INTO chart_of_accounts (account_code, account_name, account_type, balance_type) VALUES
('1000', 'AKTIVA',                   'Asset',     'Debit'),
('1100', 'Aktiva Lancar',            'Asset',     'Debit'),
('1101', 'Kas',                      'Asset',     'Debit'),
('1102', 'Bank BCA',                 'Asset',     'Debit'),
('1103', 'Bank Mandiri',             'Asset',     'Debit'),
('1200', 'Piutang Usaha',            'Asset',     'Debit'),
('1300', 'Persediaan',               'Asset',     'Debit'),
('1400', 'Aktiva Tetap',             'Asset',     'Debit'),
('2000', 'KEWAJIBAN',                'Liability', 'Credit'),
('2100', 'Hutang Usaha',             'Liability', 'Credit'),
('2200', 'Hutang Bank',              'Liability', 'Credit'),
('3000', 'EKUITAS',                  'Equity',    'Credit'),
('3100', 'Modal Saham',              'Equity',    'Credit'),
('3200', 'Laba Ditahan',             'Equity',    'Credit'),
('4000', 'PENDAPATAN',               'Revenue',   'Credit'),
('4100', 'Pendapatan Penjualan',     'Revenue',   'Credit'),
('4200', 'Pendapatan Jasa',          'Revenue',   'Credit'),
('5000', 'BEBAN',                    'Expense',   'Debit'),
('5100', 'Beban Gaji',               'Expense',   'Debit'),
('5200', 'Beban Operasional',        'Expense',   'Debit'),
('5300', 'Beban Marketing',          'Expense',   'Debit'),
('5400', 'Harga Pokok Penjualan',    'Expense',   'Debit');

-- Set parent accounts
UPDATE chart_of_accounts SET parent_account_id = (SELECT id FROM chart_of_accounts WHERE account_code='1000') WHERE account_code IN ('1100','1200','1300','1400');
UPDATE chart_of_accounts SET parent_account_id = (SELECT id FROM chart_of_accounts WHERE account_code='1100') WHERE account_code IN ('1101','1102','1103');
UPDATE chart_of_accounts SET parent_account_id = (SELECT id FROM chart_of_accounts WHERE account_code='2000') WHERE account_code IN ('2100','2200');
UPDATE chart_of_accounts SET parent_account_id = (SELECT id FROM chart_of_accounts WHERE account_code='3000') WHERE account_code IN ('3100','3200');
UPDATE chart_of_accounts SET parent_account_id = (SELECT id FROM chart_of_accounts WHERE account_code='4000') WHERE account_code IN ('4100','4200');
UPDATE chart_of_accounts SET parent_account_id = (SELECT id FROM chart_of_accounts WHERE account_code='5000') WHERE account_code IN ('5100','5200','5300','5400');

-- ─── SETTINGS ─────────────────────────────────────────────
INSERT INTO settings (key, value, description, type) VALUES
('company.name',          'PT ERP Nusantara',      'Company name',              'string'),
('company.address',       'Jl. Sudirman No.1, Jakarta', 'Company address',       'string'),
('company.phone',         '021-12345678',          'Company phone',             'string'),
('company.email',         'info@erp-nusantara.id', 'Company email',             'string'),
('company.tax_id',        '01.234.567.8-000.000',  'Tax ID',                    'string'),
('currency.default',      'IDR',                   'Default currency',          'string'),
('currency.symbol',       'Rp',                    'Currency symbol',           'string'),
('attendance.work_start', '08:00',                 'Work start time',           'string'),
('attendance.work_end',   '17:00',                 'Work end time',             'string'),
('payroll.tax_rate',      '5',                     'Default tax rate %',        'number'),
('invoice.prefix',        'INV',                   'Invoice number prefix',     'string'),
('po.prefix',             'PO',                    'Purchase order prefix',     'string'),
('so.prefix',             'SO',                    'Sales order prefix',        'string');
