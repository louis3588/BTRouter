USE bt_router_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS OrderItems;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS RequestedRouters;
DROP TABLE IF EXISTS RouterRequests;
DROP TABLE IF EXISTS RouterPresets;
DROP TABLE IF EXISTS Routers;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS Roles;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       first_name VARCHAR(255) NOT NULL,
                       last_name VARCHAR(255) NOT NULL,
                       role ENUM('ADMIN', 'SUPPORT_AGENT', 'USER') NOT NULL
)ENGINE=InnoDB;

-- Create the roles table
CREATE TABLE IF NOT EXISTS Roles (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     name VARCHAR(255) NOT NULL UNIQUE
    )ENGINE=InnoDB;

-- Create the customers table
CREATE TABLE IF NOT EXISTS Customers (
                           CustomerID INT AUTO_INCREMENT PRIMARY KEY,
                           CustomerName VARCHAR(255) NOT NULL
)ENGINE=InnoDB;

-- Create the routers table
CREATE TABLE IF NOT EXISTS Routers (
                         RouterID INT AUTO_INCREMENT PRIMARY KEY,
                         RouterName VARCHAR(255) NOT NULL,
                         OutsideConnectionTypes TEXT NOT NULL,
                         InsideConnectionTypes TEXT NOT NULL,
                         EthernetMaxPorts SMALLINT CHECK (EthernetMaxPorts >= 0),
                         SerialMaxPorts SMALLINT CHECK (SerialMaxPorts >= 0)
)ENGINE=InnoDB;

-- Create the router presets table
CREATE TABLE IF NOT EXISTS RouterPresets (
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
)ENGINE=InnoDB;

-- Create the router requests table
CREATE TABLE IF NOT EXISTS RouterRequests (
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
                                order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
                                    ON DELETE CASCADE
                                    ON UPDATE CASCADE,
                                INDEX idx_priority_level (PriorityLevel)
)ENGINE=InnoDB;

-- Create the requested routers table
CREATE TABLE IF NOT EXISTS RequestedRouters (
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
)ENGINE=InnoDB;

-- Create the orders table
CREATE TABLE IF NOT EXISTS Orders (
                        OrderID INT AUTO_INCREMENT PRIMARY KEY,
                        UserID INT NOT NULL,
                        OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        EstimatedDelivery TIMESTAMP DEFAULT NULL,
                        DeliveryMethod VARCHAR(255) NOT NULL DEFAULT 'Standard Delivery',
                        Status ENUM('Processing', 'Confirmed', 'In Production', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Processing',
                        ShippingAddress TEXT NOT NULL,
                        FOREIGN KEY (UserID) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS OrderItems (
                                          OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
                                          OrderID INT NOT NULL,
                                          RouterPresetID INT DEFAULT NULL,
                                          RouterName VARCHAR(255) NOT NULL,
    PrimaryOutsideConnections VARCHAR(255) NOT NULL,
    SecondaryOutsideConnections VARCHAR(255),
    InsideConnections TEXT NOT NULL,
    NumberOfEthernetPorts SMALLINT CHECK (NumberOfEthernetPorts >= 0),
    NumberOfSerialPorts SMALLINT CHECK (NumberOfSerialPorts >= 0),
    VLANs ENUM('Unspecified', 'Specified', 'Open Trunk') NOT NULL,
    DHCP BOOLEAN DEFAULT NULL,
    Quantity SMALLINT NOT NULL CHECK (Quantity > 0),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE ON UPDATE CASCADE, -- Ensure 'OrderID' matches in Orders table
    FOREIGN KEY (RouterPresetID) REFERENCES RouterPresets(RouterPresetID) ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB;


CREATE INDEX idx_order_id ON OrderItems(OrderID);
CREATE INDEX idx_routerpreset_id ON OrderItems(RouterPresetID);
ALTER TABLE RequestedRouters MODIFY COLUMN SecondaryOutsideConnections VARCHAR(255) NULL;

