-- Use the BT Router database
DROP DATABASE IF EXISTS bt_router_db;
CREATE DATABASE IF NOT EXISTS bt_router_db;
USE bt_router_db;

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS requested_routers;
DROP TABLE IF EXISTS router_requests;
DROP TABLE IF EXISTS router_presets;
DROP TABLE IF EXISTS routers;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS order_tracking;

SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'SUPPORT_AGENT', 'USER') NOT NULL,
    reset_token VARCHAR(100),
    reset_token_expiry TIMESTAMP,

    phone_number VARCHAR(20),
    business_type VARCHAR(255),
    vat_number VARCHAR(50),
    billing_address VARCHAR(255),
    two_factor_auth BOOLEAN DEFAULT FALSE,
    order_updates BOOLEAN DEFAULT FALSE,
    billing_notifications BOOLEAN DEFAULT FALSE,
    marketing_emails BOOLEAN DEFAULT FALSE,

    two_factor_code VARCHAR(10),
    two_factor_expiry TIMESTAMP
);

CREATE TABLE customers (
    customer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL
);

CREATE TABLE routers (
    router_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    router_name VARCHAR(255) NOT NULL,
    outside_connection_types TEXT NOT NULL,
    inside_connection_types TEXT NOT NULL,
    ethernet_max_ports SMALLINT CHECK (ethernet_max_ports >= 0),
    serial_max_ports SMALLINT CHECK (serial_max_ports >= 0)
);

CREATE TABLE router_presets (
    router_preset_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    router_id BIGINT NOT NULL,
    router_preset_name VARCHAR(255) NOT NULL,
    primary_outside_connections VARCHAR(255) NOT NULL,
    secondary_outside_connections VARCHAR(255),
    inside_connections VARCHAR(255) NOT NULL,
    number_of_ports SMALLINT CHECK (number_of_ports >= 0),
    vlans ENUM('Unspecified', 'Specified', 'Open Trunk') NOT NULL,
    dhcp BOOLEAN DEFAULT NULL,

    FOREIGN KEY (router_id) REFERENCES routers(router_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE router_requests (
    request_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    site_name VARCHAR(255) NOT NULL,
    address_number_name VARCHAR(255),
    street_name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    primary_email VARCHAR(255) NOT NULL,
    secondary_email VARCHAR(255),
    phone_number VARCHAR(50) NOT NULL,
    name_of_correspondence VARCHAR(255) NOT NULL,
    priority_level ENUM('Critical', 'Urgent', 'High', 'Medium', 'Low') NOT NULL,
    additional_information TEXT,

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_priority_level (priority_level)
);

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    site_name VARCHAR(255) NOT NULL,
    router_model VARCHAR(255) NOT NULL,
    ip_address VARCHAR(255),
    configuration_details TEXT,
    router_type VARCHAR(255) NOT NULL,
    number_of_routers INT NOT NULL DEFAULT 1,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    user_id BIGINT NULL,
    FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE requested_routers (
    request_router_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NOT NULL,
    router_preset_id BIGINT DEFAULT NULL,
    router_name VARCHAR(255) NOT NULL,
    primary_outside_connections VARCHAR(255) NOT NULL,
    secondary_outside_connections VARCHAR(255) NOT NULL,
    inside_connections TEXT NOT NULL,
    number_of_ethernet_ports SMALLINT CHECK (number_of_ethernet_ports >= 0),
    number_of_serial_ports SMALLINT CHECK (number_of_serial_ports >= 0),
    vlans ENUM('Unspecified', 'Specified', 'Open Trunk') NOT NULL,
    dhcp BOOLEAN DEFAULT NULL,
    number_of_routers SMALLINT NOT NULL CHECK (number_of_routers > 0),

    FOREIGN KEY (request_id) REFERENCES router_requests(request_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (router_preset_id) REFERENCES router_presets(router_preset_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE router_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_type VARCHAR(50) NOT NULL,
    router_type VARCHAR(50) NOT NULL,
    primary_outside_connection VARCHAR(50) NOT NULL,
    primary_outside_ports INT NOT NULL CHECK (primary_outside_ports >= 1),
    secondary_outside_connection VARCHAR(50),
    secondary_outside_ports INT CHECK (secondary_outside_ports >= 0),
    primary_inside_connection VARCHAR(50) NOT NULL,
    primary_inside_ports INT NOT NULL CHECK (primary_inside_ports >= 1),
    vlan_configuration VARCHAR(50) NOT NULL,
    vlan_assignments VARCHAR(255),
    dhcp_configuration BOOLEAN NOT NULL,
    num_routers INT NOT NULL DEFAULT 1 CHECK (num_routers > 0),
    site_name VARCHAR(100) NOT NULL,
    site_address VARCHAR(255) NOT NULL,
    site_postcode VARCHAR(20) NOT NULL,
    site_primary_email VARCHAR(100) NOT NULL,
    site_secondary_email VARCHAR(100),
    site_phone VARCHAR(20) NOT NULL,
    site_contact_name VARCHAR(100) NOT NULL,
    priority_level VARCHAR(20) NOT NULL,
    ip_address VARCHAR(255) DEFAULT NULL,
    configuration_details VARCHAR(255) DEFAULT NULL,
    add_another_router BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE order_tracking (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                order_id BIGINT NOT NULL,
                                reference_number VARCHAR(20) UNIQUE NOT NULL,
                                status ENUM('PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'READY_FOR_SHIPPING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
                                can_modify BOOLEAN DEFAULT TRUE,
                                can_cancel BOOLEAN DEFAULT TRUE,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                FOREIGN KEY (order_id) REFERENCES router_orders(id) ON DELETE CASCADE,
                                INDEX idx_reference_number (reference_number),
                                INDEX idx_order_status (status)
);