INSERT INTO customers (customer_name) VALUES ('Random Customer');

INSERT INTO routers (router_name, outside_connection_types, inside_connection_types, ethernet_max_ports, serial_max_ports)
VALUES ('Router A', 'Mobile Radio - Roaming Sim', 'Ethernet', 4, NULL);
VALUES ('Router B', 'Mobile Radio - Roaming Sim, Mobile Radio - UK SIM, SOGEA - Private Broadband', 'Ethernet, Serial', 6, 2);

INSERT INTO router_presets (
    router_id,
    customer_id,
    is_global,
    router_preset_name,
    primary_outside_connections,
    secondary_outside_connections,
    inside_connections,
    number_of_ports,
    vlans,
    dhcp
) VALUES
(0, 0, FALSE, 'Preset 1 - Router A', 'Mobile Radio - Roaming Sim', NULL, 'Ethernet', 2, 'Specified', FALSE);

INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@bt.com', '$2a$10$ooitv27eorIEevquWn9SQOz3L/rRPGUjxGUm62QHGwRo/.iNGarta', 'Admin', 'User', 'ADMIN'),
('support@bt.com', '$2a$10$tR2UAICCTT2qhbSwxGXeVOLPB699bKAupr7W79ltooUxx64sJ/squ', 'Support', 'Agent', 'SUPPORT_AGENT'),
('user@bt.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/B.rq4yK/AHLC4bLVW9B5r0xE7W', 'Standard', 'User', 'USER'),
('user1@bt.com', '$2a$10$PcMFosYZpuof9buO6IkJVuD5yigjzsUniuL4c1Sr9kT3WxOwEdHp6', 'Standard', 'User', 'USER');

INSERT INTO orders (
    site_name,
    router_model,
    ip_address,
    configuration_details,
    router_type,
    number_of_routers,
    address,
    city,
    postcode,
    email,
    phone_number
) VALUES
('Norwich', 'Virtual Access - GW1400M', '192.168.1.250', 'Custom Config', 'Fiber', 20, '89 Virginia Road', 'Surrey', 'CR9 5EJ', 'user1@bt.com', '07951322284'),
('Manchester', 'Cisco ISR 4331', '192.168.2.150', 'Standard Setup', 'Fiber', 15, '123 King Street', 'Manchester', 'M1 1AB', 'user1@bt.com', '07789965432'),
('Liverpool', 'Juniper MX204', '10.0.0.5', 'Advanced Routing', 'DSL', 10, '45 Albert Dock', 'Liverpool', 'L3 4BB', 'user1@bt.com', '07512347856'),
('Birmingham', 'Virtual Access - GW1400M', '192.168.1.100', 'Default Config', 'Fiber', 25, '22 High Street', 'Birmingham', 'B5 6TH', 'user1@bt.com', '07896541236'),
('Leeds', 'Huawei AR169', '10.1.1.1', 'Custom VLAN Setup', 'Cable', 5, '78 Park Row', 'Leeds', 'LS1 5HN', 'user1@bt.com', '07456893211'),
('Glasgow', 'Cisco ISR 4461', '172.16.0.250', 'Enterprise Setup', 'Fiber', 30, '55 Buchanan Street', 'Glasgow', 'G1 2HL', 'user1@bt.com', '07324578965'),
('Edinburgh', 'MikroTik RB4011', '192.168.50.2', 'Wireless Optimization', 'DSL', 8, '33 Princes Street', 'Edinburgh', 'EH2 2BY', 'user1@bt.com', '07011223344'),
('Bristol', 'Ubiquiti EdgeRouter 12', '10.10.10.10', 'Remote VPN Config', 'Cable', 12, '99 Park Avenue', 'Bristol', 'BS1 4DJ', 'user1@bt.com', '07123456789');
