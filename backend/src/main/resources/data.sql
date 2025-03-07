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
('admin@bt.com', '$2a$10$dYJ.JJf/YyJDw3PGkpzPaOGz9.H0VSWg3HolW0s7IQYHj71JkP6gi', 'Admin', 'User', 'ADMIN'),
('support@bt.com', '$2a$10$lR.oHqEZVxvFZ3OZKpaYVe6lrYMNKX.P9dOY9HgJSIvV1KHKHhJSC', 'Support', 'Agent', 'SUPPORT_AGENT'),
('user@bt.com', '$2a$10$BBQZFHxI0d0OmHPHi0IkqO0T1HWJUz5OYJmqt7.qERrXs3O0tKsAS', 'Standard', 'User', 'USER');
