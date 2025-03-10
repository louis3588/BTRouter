USE bt_router_db;

DROP TABLE IF EXISTS RequestedRouters;
DROP TABLE IF EXISTS RouterRequests;
DROP TABLE IF EXISTS RouterPresets;
DROP TABLE IF EXISTS Routers;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS Roles;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'SUPPORT_AGENT', 'USER') NOT NULL
);

CREATE TABLE Customers (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerName VARCHAR(255) NOT NULL
);

CREATE TABLE Routers (
    RouterID INT AUTO_INCREMENT PRIMARY KEY,
    RouterName VARCHAR(255) NOT NULL,
    OutsideConnectionTypes TEXT NOT NULL,
    InsideConnectionTypes TEXT NOT NULL,
    EthernetMaxPorts SMALLINT CHECK (EthernetMaxPorts >= 0),
    SerialMaxPorts SMALLINT CHECK (SerialMaxPorts >= 0)
);

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

CREATE TABLE IF NOT EXISTS RouterRequests (
    RequestID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerType VARCHAR(255) NOT NULL,
    RouterType VARCHAR(255) NOT NULL,
    PrimaryOutsideConnection VARCHAR(255) NOT NULL,
    PrimaryOutsidePorts INT CHECK (PrimaryOutsidePorts >= 1),
    SecondaryOutsideConnection VARCHAR(255),
    SecondaryOutsidePorts INT CHECK (SecondaryOutsidePorts >= 0),
    PrimaryInsideConnection VARCHAR(255) NOT NULL,
    PrimaryInsidePorts INT CHECK (PrimaryInsidePorts >= 1),
    VLANConfiguration ENUM('Specified per port', 'Open Trunk') NOT NULL,
    DHCPConfiguration BOOLEAN DEFAULT FALSE,
    NumberOfRouters INT CHECK (NumberOfRouters > 0) NOT NULL,
    SiteName VARCHAR(255) NOT NULL,
    SiteAddress VARCHAR(255) NOT NULL,
    SitePostcode VARCHAR(20) NOT NULL,
    SiteEmailPrimary VARCHAR(255) NOT NULL,
    SiteEmailSecondary VARCHAR(255),
    SitePhone VARCHAR(50) NOT NULL,
    SiteContactName VARCHAR(255) NOT NULL,
    PriorityLevel ENUM('Critical', 'Urgent', 'High', 'Medium', 'Low') NOT NULL
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
