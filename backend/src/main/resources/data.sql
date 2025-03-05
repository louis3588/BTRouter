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
('user1@bt.com', '$2a$10$PcMFosYZpuof9buO6IkJVuD5yigjzsUniuL4c1Sr9kT3WxOwEdHp6', 'Standard', 'User', 'USER');


INSERT INTO orders (site_name, router_model, ip_address, configuration_details, router_type, number_of_routers, address, city, postcode, email, phone_number) 
VALUES ('Norwich', 'Virtual Access - GW1400M', '192.168.1.250', 'Custom Config', 'Fiber', 20, '89 Virginia Road', 'Surrey', 'CR9 5EJ', 'Jamie@gmail.com', '07951322284');

INSERT INTO orders (site_name, router_model, ip_address, configuration_details, router_type, number_of_routers, address, city, postcode, email, phone_number)
VALUES ('Norwich', 'Virtual Access - GW1400M', '192.168.1.250', 'Custom Config', 'Fiber', 20, '89 Virginia Road', 'Surrey', 'CR9 5EJ', 'user@bt.com', '07951322284');

INSERT INTO customers (customer_name) VALUES ('Random Customer');

INSERT INTO routers (router_name, outside_connection_types, inside_connection_types, ethernet_max_ports, serial_max_ports)
VALUES ('Router A', 'Mobile Radio', 'Ethernet', 4, NULL);

INSERT INTO router_presets (router_id, router_preset_name, primary_outside_connections, secondary_outside_connections, inside_connections, number_of_ports, VLANs, DHCP)
VALUES (1, 'Random Preset', 'Mobile Radio', NULL, 'Ethernet', 4, 'Unspecified', FALSE);