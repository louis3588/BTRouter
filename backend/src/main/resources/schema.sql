-- Use the BT Router database
DROP DATABASE IF EXISTS bt_router_db;
CREATE DATABASE IF NOT EXISTS bt_router_db;
USE bt_router_db;

SET FOREIGN_KEY_CHECKS=0;

-- Drop tables in correct order (child tables first)
DROP TABLE IF EXISTS RequestedRouters;
DROP TABLE IF EXISTS RouterRequests;
DROP TABLE IF EXISTS RouterPresets;
DROP TABLE IF EXISTS Routers;
DROP TABLE IF EXISTS orders;  -- Orders table must be dropped before users
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS users;  -- Now users can be safely dropped
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS order_tracking; -- New table for order tracking

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;

-- Create Users Table
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       first_name VARCHAR(255) NOT NULL,
                       last_name VARCHAR(255) NOT NULL,
                       role ENUM('ADMIN', 'SUPPORT_AGENT', 'USER') NOT NULL,
                       reset_token VARCHAR(100),
                       reset_token_expiry TIMESTAMP
);

-- Create Customers Table
CREATE TABLE Customers (
                           CustomerID INT AUTO_INCREMENT PRIMARY KEY,
                           CustomerName VARCHAR(255) NOT NULL
);

-- Create Routers Table
CREATE TABLE Routers (
                         RouterID INT AUTO_INCREMENT PRIMARY KEY,
                         RouterName VARCHAR(255) NOT NULL,
                         OutsideConnectionTypes TEXT NOT NULL,
                         InsideConnectionTypes TEXT NOT NULL,
                         EthernetMaxPorts SMALLINT CHECK (EthernetMaxPorts >= 0),
                         SerialMaxPorts SMALLINT CHECK (SerialMaxPorts >= 0)
);

-- Create Router Presets Table
CREATE TABLE RouterPresets (
                               RouterPresetID INT AUTO_INCREMENT PRIMARY KEY,
                               RouterID INT NOT NULL,
                               RouterPresetName VARCHAR(255) NOT NULL,
                               PrimaryOutsideConnections VARCHAR(255) NOT NULL,
                               SecondaryOutsideConnections VARCHAR(255),
                               InsideConnections VARCHAR(255) NOT NULL,
                               NumberOfPorts SMALLINT CHECK (NumberOfPorts >= 0),
                               VLANs ENUM('Unspecified', 'Specified', 'Open Trunk') NOT NULL,
                               DHCP BOOLEAN DEFAULT NULL,

                               FOREIGN KEY (RouterID) REFERENCES Routers(RouterID)
                                   ON DELETE CASCADE
                                   ON UPDATE CASCADE
);

-- Create Router Requests Table
CREATE TABLE RouterRequests (
                                RequestID INT AUTO_INCREMENT PRIMARY KEY,
                                CustomerID INT NOT NULL,

                                SiteName VARCHAR(255) NOT NULL,
                                AddressNumberName VARCHAR(255),
                                StreetName VARCHAR(255) NOT NULL,
                                City VARCHAR(255) NOT NULL,
                                Postcode VARCHAR(20) NOT NULL,
                                PrimaryEmail VARCHAR(255) NOT NULL,
                                SecondaryEmail VARCHAR(255),
                                PhoneNumber VARCHAR(50) NOT NULL,
                                NameOfCorrespondence VARCHAR(255) NOT NULL,

                                PriorityLevel ENUM('Critical', 'Urgent', 'High', 'Medium', 'Low') NOT NULL,
                                AdditionalInformation TEXT,

                                FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
                                    ON DELETE CASCADE
                                    ON UPDATE CASCADE,

                                INDEX idx_priority_level (PriorityLevel) -- Faster querying through priority level
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
                        email VARCHAR(255) NOT NULL, -- Keeping email so David's insert works
                        phone_number VARCHAR(50) NOT NULL,
                        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Adds date/time automatically

                        user_id INT NULL,
                        FOREIGN KEY  (email) REFERENCES  users(email) ON DELETE CASCADE,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create Requested Routers Table
CREATE TABLE RequestedRouters (
                                  RequestRouterID INT AUTO_INCREMENT PRIMARY KEY,
                                  RequestID INT NOT NULL,
                                  RouterPresetID INT DEFAULT NULL,

                                  RouterName VARCHAR(255) NOT NULL,
                                  PrimaryOutsideConnections VARCHAR(255) NOT NULL,
                                  SecondaryOutsideConnections VARCHAR(255) NOT NULL,
                                  InsideConnections TEXT NOT NULL,
                                  NumberOfEthernetPorts SMALLINT CHECK (NumberOfEthernetPorts >= 0),
                                  NumberOfSerialPorts SMALLINT CHECK (NumberOfSerialPorts >= 0),
                                  VLANs ENUM('Unspecified', 'Specified', 'Open Trunk') NOT NULL,
                                  DHCP BOOLEAN DEFAULT NULL,
                                  NumberOfRouters SMALLINT NOT NULL CHECK (NumberOfRouters > 0),

                                  FOREIGN KEY (RequestID) REFERENCES RouterRequests(RequestID)
                                      ON DELETE CASCADE
                                      ON UPDATE CASCADE,

                                  FOREIGN KEY (RouterPresetID) REFERENCES RouterPresets(RouterPresetID)
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
                               num_routers INT NOT NULL DEFAULT 1 CHECK (num_routers > 0), -- ✅ Fix: Default Value
                               site_name VARCHAR(100) NOT NULL,
                               site_address VARCHAR(255) NOT NULL,
                               site_postcode VARCHAR(20) NOT NULL,
                               site_primary_email VARCHAR(100) NOT NULL,
                               site_secondary_email VARCHAR(100),
                               site_phone VARCHAR(20) NOT NULL,
                               site_contact_name VARCHAR(100) NOT NULL,
                               priority_level VARCHAR(20) NOT NULL,
                               add_another_router BOOLEAN DEFAULT FALSE,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Order Tracking Table for new tracking functionality
CREATE TABLE order_tracking (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                order_id INT NOT NULL,
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