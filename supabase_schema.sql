-- Supabase Database Schema for Stella O Afro Shop
-- Postgres tables for Products, Variants, Orders, and Webhook Reconciliations

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Enum / Table
CREATE TABLE categories (
    id VARCHAR PRIMARY KEY,
    label VARCHAR NOT NULL
);

INSERT INTO categories (id, label) VALUES
('flours', 'Flours & Swallows'),
('rice', 'Rice & Grains'),
('beans', 'Beans & Legumes'),
('oils', 'Oils & Fats'),
('spices', 'Spices & Seasonings'),
('soup', 'Soup Ingredients'),
('fish', 'Fish & Seafood'),
('meat', 'Meat & Poultry'),
('breakfast', 'Breakfast & Pantry'),
('noodles', 'Noodles & Pasta'),
('canned', 'Canned Foods'),
('snacks', 'Snacks & Bites'),
('beverages', 'Beverages & Teas'),
('fresh', 'Fresh Produce'),
('frozen', 'Frozen Products'),
('others', 'Others');

-- 3. Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    category VARCHAR REFERENCES categories(id),
    storage VARCHAR NOT NULL DEFAULT 'ambient', -- ambient, chilled, frozen
    badge VARCHAR,
    tags TEXT[],
    origin VARCHAR,
    description TEXT,
    freshness_note TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Product Variants Table
CREATE TABLE product_variants (
    sku VARCHAR PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    label VARCHAR NOT NULL, -- 1kg, 2kg, 5L, etc.
    price DECIMAL(12, 2) NOT NULL, -- Stored in NGN (Base Settlement)
    stock INT NOT NULL DEFAULT 0
);

-- 5. Orders Table
CREATE TABLE orders (
    id VARCHAR PRIMARY KEY, -- e.g., STA-89210
    customer_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    address TEXT NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    discount DECIMAL(12, 2) DEFAULT 0,
    delivery_fee DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    delivery_zone_id VARCHAR NOT NULL,
    delivery_slot_id VARCHAR NOT NULL,
    is_gift BOOLEAN DEFAULT FALSE,
    gift_note TEXT,
    status VARCHAR DEFAULT 'Placed' NOT NULL, -- Placed, Packing, Dispatched, Delivered
    payment_status VARCHAR DEFAULT 'Pending' NOT NULL, -- Pending, Paid, Failed
    payment_reference VARCHAR, -- Paystack/Flutterwave reference
    payment_gateway VARCHAR, -- paystack, flutterwave, bank_transfer
    placed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    variant_sku VARCHAR REFERENCES product_variants(sku),
    quantity INT NOT NULL CHECK (quantity > 0)
);

-- 7. Bulk Wholesale Requests Table
CREATE TABLE bulk_inquiries (
    id SERIAL PRIMARY KEY,
    organization_name VARCHAR NOT NULL,
    contact_person VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    est_quantity INT NOT NULL,
    delivery_date DATE NOT NULL,
    notes TEXT,
    status VARCHAR DEFAULT 'Reviewing' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
