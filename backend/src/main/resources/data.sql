-- Insert data for customers
INSERT INTO Customers (CustomerName) VALUES
                                         ('Random Customer'),
                                         ('Test Customer');

-- Insert data for routers
INSERT INTO Routers (
    RouterName,
    OutsideConnectionTypes,
    InsideConnectionTypes,
    EthernetMaxPorts,
    SerialMaxPorts)
VALUES
    ('Router A', 'Mobile Radio', 'Ethernet', 4, NULL),
    ('Router B', 'DSL', 'Ethernet', 4, NULL);

-- Insert data for router presets
INSERT INTO RouterPresets (
    RouterID,
    RouterPresetName,
    PrimaryOutsideConnections,
    SecondaryOutsideConnections,
    InsideConnections,
    NumberOfPorts,
    VLANs,
    DHCP)
VALUES
    (1, 'Random Preset', 'Mobile Radio', NULL, 'Ethernet', 4, 'Unspecified', FALSE),
    (2, 'Test Preset', 'DSL', NULL, 'Ethernet', 4, 'Unspecified', TRUE);

-- Insert data for users
INSERT INTO users (email, password, first_name, last_name, role) VALUES
                                                                     ('admin@bt.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/B.rq4yK/AHLC4bLVW9B5r0xE7W', 'Admin', 'User', 'ADMIN'),
                                                                     ('support@bt.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/B.rq4yK/AHLC4bLVW9B5r0xE7W', 'Support', 'Agent', 'SUPPORT_AGENT'),
                                                                     ('user@bt.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/B.rq4yK/AHLC4bLVW9B5r0xE7W', 'Standard', 'User', 'USER'),
                                                                     ('admin1@bt.com', '$2a$10$GmuMnewUD8usYVAnEtfjC.tIM.9kBoLtcfpg4RqB/ocfV2qdEtOVK', 'Admin', 'User', 'ADMIN'),
                                                                     ('user1@bt.com', '$2a$10$GmuMnewUD8usYVAnEtfjC.tIM.9kBoLtcfpg4RqB/ocfV2qdEtOVK', 'Standard', 'User', 'USER');

-- Insert data for RouterRequest for user1@bt.com
INSERT INTO RouterRequests (
    CustomerID,
    SiteName,
    AddressNumberName,
    StreetName,
    City,
    Postcode,
    PrimaryEmail,
    SecondaryEmail,
    PhoneNumber,
    NameOfCorrespondence,
    PriorityLevel,
    AdditionalInformation,
    order_date)
VALUES
    (1, 'Test Site', 'Test Address', 'Test Street', 'Test City', '12345', 'user1@bt.com', 'user2@bt.com', '123456789', 'John Doe', 'High', 'Test Order', NOW());

INSERT INTO RequestedRouters (RequestID, RouterPresetID, RouterName, PrimaryOutsideConnections, SecondaryOutsideConnections, InsideConnections, NumberOfEthernetPorts, NumberOfSerialPorts, VLANs, DHCP, NumberOfRouters)
VALUES
    ((SELECT RequestID FROM RouterRequests WHERE PrimaryEmail = 'user1@bt.com' LIMIT 1), 1, 'Router A', 'Mobile Radio', 'Fiber Optic', 'Ethernet', 2, 1, 'Specified', TRUE, 1),
    ((SELECT RequestID FROM RouterRequests WHERE PrimaryEmail = 'user1@bt.com' LIMIT 1), 2, 'Router B', 'DSL', 'DefaultSecondaryConnection', 'Ethernet', 4, 0, 'Open Trunk', FALSE, 2);


-- Insert data for Orders for user1@bt.com
INSERT INTO Orders (
    UserID,
    OrderDate,
    EstimatedDelivery,
    DeliveryMethod,
    Status,
    ShippingAddress
)
VALUES
    ((SELECT id FROM users WHERE email = 'user1@bt.com' LIMIT 1), NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Standard Delivery', 'Processing', '123 Test Address, Test City, 12345');

-- Insert data for OrderItems related to the order
INSERT INTO OrderItems (
    OrderID,
    RouterPresetID,
    RouterName,
    PrimaryOutsideConnections,
    SecondaryOutsideConnections,
    InsideConnections,
    NumberOfEthernetPorts,
    NumberOfSerialPorts,
    VLANs,
    DHCP,
    Quantity
)
VALUES
    ((SELECT OrderID FROM Orders WHERE UserID = (SELECT id FROM users WHERE email = 'user1@bt.com' LIMIT 1) LIMIT 1), 1, 'Router A', 'Mobile Radio', 'Fiber Optic', 'Ethernet', 2, 1, 'Specified', TRUE, 1),
    ((SELECT OrderID FROM Orders WHERE UserID = (SELECT id FROM users WHERE email = 'user1@bt.com' LIMIT 1) LIMIT 1), 2, 'Router B', 'DSL', 'DefaultSecondaryConnection', 'Ethernet', 4, 0, 'Open Trunk', FALSE, 2);
