-- Inserir dados na tabela "customers"
INSERT INTO "customers" ("id", "email", "cpf", "phone") VALUES
(gen_random_uuid(), 'customer1@example.com', '12345678901', '555-1234'),
(gen_random_uuid(), 'customer2@example.com', '98765432109', '555-5678'),
(gen_random_uuid(), 'customer3@example.com', '11121314151', '555-7890')
ON CONFLICT ("email") DO NOTHING;

-- Inserir dados na tabela "customer_addresses"
INSERT INTO "customer_addresses" ("id", "customer_id", "street_address", "street_address_line_2", "house_number", "district", "city", "state") VALUES
(gen_random_uuid(), (SELECT id FROM "customers" WHERE email = 'customer1@example.com'), 'Rua A', 'Apto 1', '10', 'Bairro A', 'Cidade A', 'Estado A'),
(gen_random_uuid(), (SELECT id FROM "customers" WHERE email = 'customer2@example.com'), 'Rua B', 'Casa 2', '20', 'Bairro B', 'Cidade B', 'Estado B'),
(gen_random_uuid(), (SELECT id FROM "customers" WHERE email = 'customer3@example.com'), 'Rua C', 'Apto 3', '30', 'Bairro C', 'Cidade C', 'Estado C')
ON CONFLICT DO NOTHING;

-- Inserir dados na tabela "products"
INSERT INTO "products" ("id", "sku", "name", "price", "is_express_exchange_available") VALUES
(gen_random_uuid(), '001', 'Produto 1', 100.00, true),
(gen_random_uuid(), '002', 'Produto 2', 200.00, false),
(gen_random_uuid(), '003', 'Produto 3', 150.00, true),
(gen_random_uuid(), '004', 'Produto 4', 175.00, true),
(gen_random_uuid(), '005', 'Produto 5', 125.00, false)
ON CONFLICT ("sku") DO NOTHING;

-- Inserir dados na tabela "invoices"
INSERT INTO "invoices" ("id", "number", "serie", "customer_id", "purchase_date") VALUES
(gen_random_uuid(), '001', '001', (SELECT id FROM "customers" WHERE email = 'customer1@example.com'), '2023-01-01'),
(gen_random_uuid(), '002', '002', (SELECT id FROM "customers" WHERE email = 'customer2@example.com'), '2023-02-01'),
(gen_random_uuid(), '003', '003', (SELECT id FROM "customers" WHERE email = 'customer3@example.com'), '2023-03-01'),
(gen_random_uuid(), '004', '004', (SELECT id FROM "customers" WHERE email = 'customer1@example.com'), '2023-04-01');

-- Inserir dados na tabela "invoice_products"
INSERT INTO "invoice_products" ("invoice_id", "product_id") VALUES
((SELECT id FROM "invoices" WHERE number = '001'), (SELECT id FROM "products" WHERE sku = '001')),
((SELECT id FROM "invoices" WHERE number = '001'), (SELECT id FROM "products" WHERE sku = '002')),
((SELECT id FROM "invoices" WHERE number = '002'), (SELECT id FROM "products" WHERE sku = '003')),
((SELECT id FROM "invoices" WHERE number = '002'), (SELECT id FROM "products" WHERE sku = '004')),
((SELECT id FROM "invoices" WHERE number = '003'), (SELECT id FROM "products" WHERE sku = '005')),
((SELECT id FROM "invoices" WHERE number = '003'), (SELECT id FROM "products" WHERE sku = '001')),
((SELECT id FROM "invoices" WHERE number = '004'), (SELECT id FROM "products" WHERE sku = '002')),
((SELECT id FROM "invoices" WHERE number = '004'), (SELECT id FROM "products" WHERE sku = '004'))
ON CONFLICT ON CONSTRAINT "invoice_products_invoice_id_product_id_pk" DO NOTHING;

-- Inserir dados na tabela "express_exchanges"
INSERT INTO "express_exchanges" ("id", "customer_id", "invoice_id", "product_id", "status", "street_address", "street_address_line_2", "house_number", "district", "city", "state") VALUES
(gen_random_uuid(), (SELECT id FROM "customers" WHERE email = 'customer1@example.com'), (SELECT id FROM "invoices" WHERE number = '001'), (SELECT id FROM "products" WHERE sku = '001'), 'processing', 'Rua D', 'Apto 4', '40', 'Bairro D', 'Cidade D', 'Estado D'),
(gen_random_uuid(), (SELECT id FROM "customers" WHERE email = 'customer2@example.com'), (SELECT id FROM "invoices" WHERE number = '002'), (SELECT id FROM "products" WHERE sku = '003'), 'sent', 'Rua E', 'Casa 5', '50', 'Bairro E', 'Cidade E', 'Estado E'),
(gen_random_uuid(), (SELECT id FROM "customers" WHERE email = 'customer3@example.com'), (SELECT id FROM "invoices" WHERE number = '003'), (SELECT id FROM "products" WHERE sku = '004'), 'done', 'Rua F', 'Apto 6', '60', 'Bairro F', 'Cidade F', 'Estado F')
ON CONFLICT ("invoice_id") DO NOTHING;
