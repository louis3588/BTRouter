INSERT INTO Customers (CustomerName) VALUES ('Random Customer');

INSERT INTO Routers (
    RouterName,
    OutsideConnectionTypes,
    InsideConnectionTypes,
    EthernetMaxPorts,
    SerialMaxPorts)
VALUES (
           'Router A',
           'Mobile Radio',
           'Ethernet',
           4,
           null);

INSERT INTO RouterPresets (
    RouterID,
    RouterPresetName,
    PrimaryOutsideConnections,
    SecondaryOutsideConnections,
    InsideConnections,
    NumberOfPorts,
    VLANs,
    DHCP)
VALUES (
           1,
           'Random Preset',
           'Mobile Radio',
           null,
           'Ethernet',
           4,
           'Unspecified',
           false);

INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@bt.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/B.rq4yK/AHLC4bLVW9B5r0xE7W', 'Admin', 'User', 'ADMIN'),
('support@bt.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/B.rq4yK/AHLC4bLVW9B5r0xE7W', 'Support', 'Agent', 'SUPPORT_AGENT'),
('user@bt.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/B.rq4yK/AHLC4bLVW9B5r0xE7W', 'Standard', 'User', 'USER'),
('admin1@bt.com', '$2a$10$GmuMnewUD8usYVAnEtfjC.tIM.9kBoLtcfpg4RqB/ocfV2qdEtOVK', 'Admin', 'User', 'ADMIN'),
('user1@bt.com', '$2a$10$GmuMnewUD8usYVAnEtfjC.tIM.9kBoLtcfpg4RqB/ocfV2qdEtOVK', 'Standard', 'User', 'USER');

-- Create Order Requests for user1@bt.com
INSERT INTO RouterRequests (CustomerID, SiteName, AddressNumberName, StreetName, City, Postcode, PrimaryEmail, SecondaryEmail, PhoneNumber, NameOfCorrespondence, PriorityLevel, AdditionalInformation)
VALUES
    (1, 'Site Alpha', '123', 'Main Street', 'Cardiff', 'CF10 1AA', 'user1@bt.com', 'user1-alt@bt.com', '02912345678', 'John Doe', 'High', 'Urgent delivery required'),
    (1, 'Site Beta', '456', 'Queen Street', 'Cardiff', 'CF10 2BB', 'user1@bt.com', NULL, '02987654321', 'Jane Doe', 'Medium', 'Routine replacement');

-- Link Requested Routers to the Orders
INSERT INTO RequestedRouters (RequestID, RouterPresetID, RouterName, PrimaryOutsideConnections, SecondaryOutsideConnections, InsideConnections, NumberOfEthernetPorts, NumberOfSerialPorts, VLANs, DHCP, NumberOfRouters)
VALUES
    (1, 1, 'Router A', 'Mobile Radio', 'Fiber Optic', 'Ethernet', 2, 1, 'Specified', TRUE, 1),
    (2, 1, 'Router A', 'DSL', NULL, 'Ethernet', 4, 0, 'Open Trunk', FALSE, 2);
