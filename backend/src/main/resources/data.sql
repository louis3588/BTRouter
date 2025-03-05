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

INSERT INTO Customers (CustomerName) VALUES ('BT Corporate Client');

INSERT INTO Orders (UserID, OrderDate, EstimatedDelivery, DeliveryMethod, Status, ShippingAddress)
VALUES ((SELECT id FROM users WHERE email = 'user1@bt.com'), NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'Standard Delivery', 'Processing', '123 Test Address, Test City, 12345');

INSERT INTO OrderItems (OrderID, RouterPresetID, RouterName, PrimaryOutsideConnections, SecondaryOutsideConnections, InsideConnections, NumberOfEthernetPorts, NumberOfSerialPorts, VLANs, DHCP, Quantity)
VALUES ((SELECT OrderID FROM Orders WHERE UserID = (SELECT id FROM users WHERE email = 'user1@bt.com') LIMIT 1), 1, 'Router A', 'Mobile Radio', 'Fiber Optic', 'Ethernet', 2, 1, 'Specified', TRUE, 1);
