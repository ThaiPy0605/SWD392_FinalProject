-- Seed Initial Data Migration for SWD392 Final Project
-- File: V2__seed_initial_data.sql

-- 1. Seed Categories
INSERT INTO categories (id, name) VALUES
(1, 'Robotics'),
(2, 'Electronics'),
(3, 'STEM Kits'),
(4, 'Software'),
(5, 'Skincare');

-- 2. Seed Brands
INSERT INTO brands (id, name) VALUES
(1, 'OhStem'),
(2, 'Arduino'),
(3, 'Raspberry Pi'),
(4, 'LEGO'),
(5, 'Glow Lab');

-- 3. Seed Users
INSERT INTO users (id, full_name, email, password_hash, role) VALUES
(1, 'System Administrator', 'admin@example.com', 'password1', 'ADMIN'),
(2, 'Demo Member User', 'member@example.com', 'password2', 'MEMBER'),
(3, 'Linh Tran', 'linh@example.com', 'password3', 'MEMBER'),
(4, 'Bao Nguyen', 'bao@example.com', 'password4', 'STAFF');

-- 4. Seed Products
INSERT INTO products (id, name, description, price, stock_qty, image_url, category_id, brand_id) VALUES
(1, 'Smart Home IoT Kit', 'Complete IoT starter package with Wi-Fi sensors and cloud automation modules.', 1250000.00, 45, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjJhfjq53WNjjS8ixyeQH_bgHSxh6NYf5pZRGYFoVA49E8rPDhrCtNs4lvgm633VAYfBi35FIZHAxZHptmIdrJJ7ygOyGNJULq4r6C8uARS_NuJnNkzmMxJDnN5qKRIgwFcQa7ythts_MjflzEQNqBEtWs9y14DFTvlLuRHhgPr0atfN3ejV9aVoxuNQk9mEMrySQKxk0EUBjKA6XPo2eWu5qaCcMy7NJ1tmhkEbWaks07ol1sB-RLNFiCgIF0KTgfazODXvU20i4', 2, 1),
(2, 'Robotics Arm Pro', 'Programmable 6-axis robotic arm kit designed for advanced STEM education.', 850000.00, 12, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkjGxTti0KrrZupAN0xyhiiSST8MHOv1fgYkWfZkIoj9_31l2tBxir9Rg0zV2Ts5k7QwKSdJaDgJ8glN6D1sx1ADFG5iKf0LyMGtZl-16cLjXopb2Xgrrib8nh22iat1McExYzhjwJ0Sx1fJyfmYImf4GFOX7eAGSUk1AzmGIoRhmjVr-tgg7q0yT3ZW0M8EeZfj8O9V4yhYKxgkE38JfngncVB_p3OoXHz2rsuji50njZsxfecKg9CRCkTXB1-v6vHDPpeWf1St4', 1, 1),
(3, 'Electronics Starter Pack', 'Essential electronic components set including breadboard, resistors, LEDs and jumper wires.', 450000.00, 98, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_XxH7LpSZELW-11NMJfENJVyRwrznRazpZ2ZdaLHyC1Ti4QftQjt38ZcGNhmajAos5e1cHVuVxYUlda5AgpYrs65Txjzebsi53CTK08pbaxDg8vuKvFkNGSSDA5iYII29nLfICKgvy4L8mZI9KpDaA6SdQgQ5_SMTbAsVi7cK-y3oj7I8mK1YLuQWc9LEkECxV6WPD9-_NPWG6FnRIWfChYdIsRoMwuYhEBFwIEsp93uE6tYoyI21rupoOVTm2-wfybMlVVEks', 2, 2),
(4, 'OhStem Yolo:Bit Educational Robotics Kit', 'Flagship micro-controller and robotics learning platform for school students.', 790000.00, 30, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYvjWiQnmEMwIUV1wItFp0mfVCgPEZoRgqaeHMbveAj0_fyD3KZVtR9FMGZQLEi3RFIVpfnltpnpuO-1Y_h1jc28U6LpDIc5KjPB6DgaS9MXZBQqNmgDBvM_mduk4doCkesie-KZjhojaW5477yOZjN3Mv_L8DV15NBxzmrxQ1JzuNeXNTL0klfOX35XpdMWChvLduhZgktYvYv76z_rley95ix4v7P8_0q9IHOc6G7j2UwlvTYuqZonIbhDbBwF2R3nhDU7cSpAU', 1, 1),
(5, 'Arduino Uno R3 Board', 'Original microcontroller board ideal for electronic projects and DIY prototypes.', 299000.00, 60, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_XxH7LpSZELW-11NMJfENJVyRwrznRazpZ2ZdaLHyC1Ti4QftQjt38ZcGNhmajAos5e1cHVuVxYUlda5AgpYrs65Txjzebsi53CTK08pbaxDg8vuKvFkNGSSDA5iYII29nLfICKgvy4L8mZI9KpDaA6SdQgQ5_SMTbAsVi7cK-y3oj7I8mK1YLuQWc9LEkECxV6WPD9-_NPWG6FnRIWfChYdIsRoMwuYhEBFwIEsp93uE6tYoyI21rupoOVTm2-wfybMlVVEks', 2, 2),
(6, 'Raspberry Pi 4 Model B (4GB)', 'High performance single board computer for programming and AI edge projects.', 1490000.00, 20, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjJhfjq53WNjjS8ixyeQH_bgHSxh6NYf5pZRGYFoVA49E8rPDhrCtNs4lvgm633VAYfBi35FIZHAxZHptmIdrJJ7ygOyGNJULq4r6C8uARS_NuJnNkzmMxJDnN5qKRIgwFcQa7ythts_MjflzEQNqBEtWs9y14DFTvlLuRHhgPr0atfN3ejV9aVoxuNQk9mEMrySQKxk0EUBjKA6XPo2eWu5qaCcMy7NJ1tmhkEbWaks07ol1sB-RLNFiCgIF0KTgfazODXvU20i4', 2, 3),
(7, 'Mindstorms EV3 Robot Kit', 'Advanced Lego robotics set with intelligent brick and customizable motors.', 2490000.00, 15, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkjGxTti0KrrZupAN0xyhiiSST8MHOv1fgYkWfZkIoj9_31l2tBxir9Rg0zV2Ts5k7QwKSdJaDgJ8glN6D1sx1ADFG5iKf0LyMGtZl-16cLjXopb2Xgrrib8nh22iat1McExYzhjwJ0Sx1fJyfmYImf4GFOX7eAGSUk1AzmGIoRhmjVr-tgg7q0yT3ZW0M8EeZfj8O9V4yhYKxgkE38JfngncVB_p3OoXHz2rsuji50njZsxfecKg9CRCkTXB1-v6vHDPpeWf1St4', 3, 4),
(8, 'Hydrating Facial Serum', 'Nourishing facial serum with hyaluronic acid for healthy skin glow.', 299000.00, 100, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_XxH7LpSZELW-11NMJfENJVyRwrznRazpZ2ZdaLHyC1Ti4QftQjt38ZcGNhmajAos5e1cHVuVxYUlda5AgpYrs65Txjzebsi53CTK08pbaxDg8vuKvFkNGSSDA5iYII29nLfICKgvy4L8mZI9KpDaA6SdQgQ5_SMTbAsVi7cK-y3oj7I8mK1YLuQWc9LEkECxV6WPD9-_NPWG6FnRIWfChYdIsRoMwuYhEBFwIEsp93uE6tYoyI21rupoOVTm2-wfybMlVVEks', 5, 5);

-- 5. Seed Courses
INSERT INTO courses (id, title, level, content, price) VALUES
(1, 'Basic Skin Care', 'Beginner', 'Fundamentals of daily skin routines and product selection.', 149000.00),
(2, 'Advanced Robotics with Yolo:Bit', 'Intermediate', 'Build autonomous robots using block coding and Python.', 199000.00),
(3, 'IoT & Home Automation Masterclass', 'Advanced', 'Comprehensive guide to building connected devices.', 249000.00);

-- 6. Seed Discounts
INSERT INTO discounts (id, code, percent, expiry, min_spend) VALUES
(1, 'WELCOME10', 10, '2026-12-31', 300000.00),
(2, 'SUMMER20', 20, '2026-12-31', 500000.00);

-- 7. Reset Primary Key Auto-Increment Sequences for PostgreSQL
SELECT setval(pg_get_serial_sequence('categories', 'id'), (SELECT MAX(id) FROM categories));
SELECT setval(pg_get_serial_sequence('brands', 'id'), (SELECT MAX(id) FROM brands));
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT MAX(id) FROM products));
SELECT setval(pg_get_serial_sequence('courses', 'id'), (SELECT MAX(id) FROM courses));
SELECT setval(pg_get_serial_sequence('discounts', 'id'), (SELECT MAX(id) FROM discounts));
