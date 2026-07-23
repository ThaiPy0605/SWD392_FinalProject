CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(20)
);

CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    level VARCHAR(50),
    content TEXT,
    price NUMERIC(12,2)
);

CREATE TABLE discounts (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    percent INT,
    expiry DATE,
    min_spend NUMERIC(12,2)
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price NUMERIC(12,2),
    stock_qty INT,
    image_url VARCHAR(500),
    category_id BIGINT NOT NULL,
    brand_id BIGINT NOT NULL,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands(id)
);

CREATE TABLE carts (
    id BIGSERIAL PRIMARY KEY,
    updated_at TIMESTAMP,
    user_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_date TIMESTAMP,
    status VARCHAR(20),
    shipping_address VARCHAR(255),
    total_amount NUMERIC(12,2),
    user_id BIGINT NOT NULL,
    discount_id BIGINT,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_orders_discount FOREIGN KEY (discount_id) REFERENCES discounts(id)
);

CREATE TABLE enrollments (
    id BIGSERIAL PRIMARY KEY,
    enrolled_at TIMESTAMP,
    progress INT,
    status VARCHAR(50),
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    CONSTRAINT fk_enrollments_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    quantity INT,
    unit_price NUMERIC(12,2),
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    quantity INT,
    unit_price NUMERIC(12,2),
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    method VARCHAR(30),
    amount NUMERIC(12,2),
    status VARCHAR(50),
    transaction_ref VARCHAR(255),
    order_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    rating INT,
    comment TEXT,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE support_tickets (
    id BIGSERIAL PRIMARY KEY,
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50),
    reply TEXT,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_support_tickets_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_discount_id ON orders(discount_id);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
