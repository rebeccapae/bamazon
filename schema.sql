DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    id INT(30) NOT NULL AUTO_INCREMENT,
    item_id INT(30) NULL,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(4, 2) NULL,
    stock_quantity INT(100) NULL,
    PRIMARY KEY(id)
);