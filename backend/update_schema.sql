-- Update the transactions table to allow NULL for category_id
-- Run this SQL in your MySQL database (MySQL Workbench or command line)
-- This is required because Hibernate won't automatically change NOT NULL to nullable

USE tracker; -- Replace 'tracker' with your database name if different

ALTER TABLE transactions MODIFY COLUMN category_id BIGINT NULL;
