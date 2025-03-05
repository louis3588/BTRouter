-- Use the BT Router database
CREATE DATABASE IF NOT EXISTS bt_router_db;
USE bt_router_db;

-- Drop tables if they exist (ensures a clean start when setting up a new database)
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS routers;
DROP TABLE IF EXISTS router_presets;
DROP TABLE IF EXISTS router_requests;
DROP TABLE IF EXISTS requested_routers;
DROP TABLE IF EXISTS customers;

-- Create Users Table
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       first_name VARCHAR(255) NOT NULL,
                       last_name VARCHAR(255) NOT NULL,
                       role ENUM('ADMIN', 'SUPPORT_AGENT', 'USER') NOT NULL
);

-- Create Customers Table
CREATE TABLE customers (
                           customer_id INT AUTO_INCREMENT PRIMARY KEY,
                           customer_name VARCHAR(255) NOT NULL
);

-- Create Routers Table
CREATE TABLE routers (
                         router_id INT AUTO_INCREMENT PRIMARY KEY,
                         router_name VARCHAR(255) NOT NULL,
                         outside_connection_types TEXT NOT NULL,
                         inside_connection_types TEXT NOT NULL,
                         ethernet_max_ports SMALLINT CHECK (ethernet_max_ports >= 0),
                         serial_max_ports SMALLINT CHECK (serial_max_ports >= 0)
);

-- Create Router Presets Table
CREATE TABLE router_presets (
                                router_preset_id INT AUTO_INCREMENT PRIMARY KEY,
                                router_id INT NOT NULL,
                                router_preset_name VARCHAR(255) NOT NULL,
                                primary_outside_connections VARCHAR(255) NOT NULL,
                                secondary_outside_connections VARCHAR(255),
                                inside_connections VARCHAR(255) NOT NULL,
                                number_of_ports SMALLINT CHECK (number_of_ports >= 0),
                                VLANs ENUM('Unspecified', 'Specified', 'Open Trunk') NOT NULL,
                                DHCP BOOLEAN DEFAULT NULL,

                                FOREIGN KEY (router_id) REFERENCES routers(router_id)
                                    ON DELETE CASCADE
                                    ON UPDATE CASCADE
);

-- Create Router Requests Table
CREATE TABLE router_requests (
                                 request_id INT AUTO_INCREMENT PRIMARY KEY,
                                 customer_id INT NOT NULL,

                                 site_name VARCHAR(255) NOT NULL,
                                 address VARCHAR(255) NOT NULL,
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

    -- Indexing priority level for fast filtering
                                 INDEX idx_priority_level (priority_level)
);

-- Create Orders Table
CREATE TABLE orders (
                        id INT AUTO_INCREMENT PRIMARY KEY,
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
                        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Optional: Associate orders with users
                        user_id INT,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Requested Routers Table
CREATE TABLE requested_routers (
                                   request_router_id INT AUTO_INCREMENT PRIMARY KEY,
                                   request_id INT NOT NULL,
                                   router_preset_id INT DEFAULT NULL,

                                   router_name VARCHAR(255) NOT NULL,
                                   primary_outside_connections VARCHAR(255) NOT NULL,
                                   secondary_outside_connections VARCHAR(255) NOT NULL,
                                   inside_connections TEXT NOT NULL,
                                   number_of_ethernet_ports SMALLINT CHECK (number_of_ethernet_ports >= 0),
                                   number_of_serial_ports SMALLINT CHECK (number_of_serial_ports >= 0),
                                   VLANs ENUM('Unspecified', 'Specified', 'Open Trunk') NOT NULL,
                                   DHCP BOOLEAN DEFAULT NULL,
                                   number_of_routers SMALLINT NOT NULL CHECK (number_of_routers > 0),

                                   FOREIGN KEY (request_id) REFERENCES router_requests(request_id)
                                       ON DELETE CASCADE
                                       ON UPDATE CASCADE,

                                   FOREIGN KEY (router_preset_id) REFERENCES router_presets(router_preset_id)
                                       ON DELETE RESTRICT
                                       ON UPDATE CASCADE
);
