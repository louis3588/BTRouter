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
('user@bt.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/B.rq4yK/AHLC4bLVW9B5r0xE7W', 'Standard', 'User', 'USER');

('admin1@bt.com', '$2a$10$GmuMnewUD8usYVAnEtfjC.tIM.9kBoLtcfpg4RqB/ocfV2qdEtOVK', 'Admin', 'User', 'ADMIN')
('user1@bt.com', '$2a$10$GmuMnewUD8usYVAnEtfjC.tIM.9kBoLtcfpg4RqB/ocfV2qdEtOVK', 'Standard', 'User', 'USER');

