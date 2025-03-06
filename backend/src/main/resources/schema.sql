-- Use the BT Router database
CREATE DATABASE IF NOT EXISTS bt_router_db;
USE bt_router_db;

-- Drop tables in correct order (child tables first)
DROP TABLE IF EXISTS RequestedRouters;
DROP TABLE IF EXISTS RouterRequests;
DROP TABLE IF EXISTS RouterPresets;
DROP TABLE IF EXISTS Routers;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS Roles;

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
                        SiteName VARCHAR(255) NOT NULL,
                        RouterModel VARCHAR(255) NOT NULL,
                        IPAddress VARCHAR(255),
                        ConfigurationDetails TEXT,
                        RouterType VARCHAR(255) NOT NULL,
                        NumberOfRouters INT NOT NULL DEFAULT 1,
                        Address VARCHAR(255) NOT NULL,
                        City VARCHAR(255) NOT NULL,
                        Postcode VARCHAR(20) NOT NULL,
                        Email VARCHAR(255) NOT NULL,
                        PhoneNumber VARCHAR(50) NOT NULL,
                        OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

                        UserID INT NOT NULL,
                        FOREIGN KEY (UserID) REFERENCES users(id) ON DELETE CASCADE
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
