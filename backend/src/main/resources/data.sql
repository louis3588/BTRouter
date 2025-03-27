INSERT INTO customers (customer_name) VALUES ('Random Customer');

INSERT INTO routers (router_name, outside_connection_types, inside_connection_types, ethernet_max_ports, serial_max_ports)
VALUES ('Router A', 'Mobile Radio - Roaming Sim', 'Ethernet', 4, NULL);

INSERT INTO router_presets (
    router_id,
    router_preset_name,
    primary_outside_connections,
    secondary_outside_connections,
    inside_connections,
    number_of_ports,
    vlans,
    dhcp
) VALUES (
    1,
    'Random Preset',
    'Mobile Radio',
    NULL,
    'Ethernet',
    4,
    'Unspecified',
    FALSE
);

INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@bt.com', '$2a$10$ooitv27eorIEevquWn9SQOz3L/rRPGUjxGUm62QHGwRo/.iNGarta', 'Admin', 'User', 'ADMIN'),
('support@bt.com', '$2a$10$tR2UAICCTT2qhbSwxGXeVOLPB699bKAupr7W79ltooUxx64sJ/squ', 'Support', 'Agent', 'SUPPORT_AGENT'),
('user@bt.com', '$2a$10$xn3LI/AjqicFYZFruSwve.ODd6/B.rq4yK/AHLC4bLVW9B5r0xE7W', 'Standard', 'User', 'USER'),
('user1@bt.com', '$2a$10$PcMFosYZpuof9buO6IkJVuD5yigjzsUniuL4c1Sr9kT3WxOwEdHp6', 'Standard', 'User', 'USER');

INSERT INTO router_orders (
    customer_type, router_type, primary_outside_connection, primary_outside_ports,
    secondary_outside_connection, secondary_outside_ports, primary_inside_connection,
    primary_inside_ports, vlan_configuration, vlan_assignments, dhcp_configuration,
    num_routers, site_name, site_address, site_postcode, site_primary_email,
    site_secondary_email, site_phone, site_contact_name, priority_level,
    ip_address, configuration_details, add_another_router
) VALUES
-- Entries with network@companyA.com (4 entries)
('Business', 'Cisco Catalyst 9200', 'Fibre', 4, 'Copper', 2, 'Ethernet', 24,
 'Static', 'VLAN10-20', 1, 2, 'London HQ', '1 Main Street, London', 'SW1A 1AA',
 'network@companyA.com', 'backup@companyA.com', '+441234567890', 'John Smith', 'High',
 '192.168.1.1', 'Core network configuration', 1),

('Business', 'Juniper MX240', 'Fibre', 8, NULL, NULL, 'SFP+', 48,
 'Dynamic', 'VLAN30-40', 1, 3, 'Manchester Branch', '5 Deansgate, Manchester', 'M3 4EN',
 'network@companyA.com', 'support@companyA.com', '+441234567891', 'Sarah Johnson', 'Medium',
 '10.0.0.1', 'Edge router setup', 0),

('Business', 'HPE Aruba 8400', 'Wireless', 2, 'Fibre', 4, 'Ethernet', 24,
 'Hybrid', 'VLAN50-60', 0, 1, 'Birmingham Office', '10 Broad Street, Birmingham', 'B1 2HG',
 'network@companyA.com', NULL, '+441234567892', 'Michael Brown', 'Low',
 '172.16.0.1', 'Wireless mesh network', 1),

('Business', 'Cisco ISR 1100', 'Copper', 1, NULL, NULL, 'Ethernet', 8,
 'Static', 'VLAN70', 1, 2, 'Leeds Warehouse', '25 Dock Street, Leeds', 'LS10 1ND',
 'network@companyA.com', 'warehouse@companyA.com', '+441234567893', 'Emma Wilson', 'High',
 '192.168.2.1', 'Warehouse connectivity', 0),

-- Entries with it@universityB.ac.uk (3 entries)
('Education', 'MikroTik CCR2004', 'Fibre', 8, 'Wireless', 2, 'SFP+', 16,
 'Dynamic', 'VLAN100-150', 1, 4, 'Main Campus', 'University Road, Bristol', 'BS8 1TH',
 'it@universityB.ac.uk', 'helpdesk@universityB.ac.uk', '+441234567894', 'IT Department', 'Medium',
 '10.10.0.1', 'Campus backbone', 1),

('Education', 'Ubiquiti EdgeRouter', 'Wireless', 4, NULL, NULL, 'Ethernet', 8,
 'Static', 'VLAN200', 0, 2, 'Science Building', 'Science Park, Bristol', 'BS8 2TH',
 'it@universityB.ac.uk', NULL, '+441234567895', 'Dr. Alan Turing', 'High',
 '192.168.10.1', 'Research network', 0),

('Education', 'Fortinet FortiGate 100F', 'Fibre', 4, 'Fibre', 4, 'SFP+', 24,
 'Hybrid', 'VLAN300-310', 1, 1, 'Library', 'Library Road, Bristol', 'BS8 3TH',
 'it@universityB.ac.uk', 'library@universityB.ac.uk', '+441234567896', 'Mary Collins', 'Low',
 '172.20.0.1', 'Public access network', 1),

-- Entries with telecom@providerC.net (3 entries)
('ISP', 'Nokia 7750 SR', 'Fibre', 16, 'Fibre', 16, 'QSFP28', 64,
 'Dynamic', 'VLAN500-600', 1, 5, 'Data Center East', '50 Tech Park, Reading', 'RG1 8FX',
 'telecom@providerC.net', 'noc@providerC.net', '+441234567897', 'Network Operations', 'High',
 '10.100.0.1', 'Core backbone router', 1),

('ISP', 'Juniper PTX10008', 'Fibre', 32, NULL, NULL, 'QSFP28', 128,
 'Static', 'VLAN700-720', 1, 2, 'Data Center West', '60 Tech Valley, Reading', 'RG1 9FX',
 'telecom@providerC.net', 'support@providerC.net', '+441234567898', 'Sarah Thompson', 'Medium',
 '192.168.100.1', 'Peering router', 0),

('ISP', 'Cisco NCS 5500', 'Fibre', 24, 'Fibre', 24, 'QSFP28', 96,
 'Hybrid', 'VLAN800-850', 1, 3, 'POP London', '1 Telehouse Way, London', 'E16 1XL',
 'telecom@providerC.net', 'engineering@providerC.net', '+441234567899', 'James Wilson', 'High',
 '172.30.0.1', 'Internet exchange point', 1),

-- Entries with unique emails (10 entries)
('Retail', 'TP-Link ER605', 'Copper', 1, NULL, NULL, 'Ethernet', 4,
 'Static', 'VLAN10', 1, 1, 'Store 101', 'High Street, Oxford', 'OX1 1AA',
 'store101@retailchain.com', NULL, '+441234567800', 'Shop Manager', 'Low',
 '192.168.101.1', 'POS system network', 0),

('Healthcare', 'Cisco Meraki MX68', 'Wireless', 2, NULL, NULL, 'Ethernet', 8,
 'Dynamic', 'VLAN20-30', 1, 2, 'City Hospital', 'Hospital Road, Cambridge', 'CB2 0QQ',
 'it@cityhospital.nhs.uk', 'support@cityhospital.nhs.uk', '+441234567801', 'IT Department', 'High',
 '10.20.0.1', 'Patient records network', 1),

('Government', 'Palo Alto PA-3220', 'Fibre', 4, 'Copper', 2, 'SFP+', 16,
 'Hybrid', 'VLAN40-50', 0, 1, 'Ministry Building', 'Whitehall, London', 'SW1A 2AA',
 'security@gov.uk', 'it@gov.uk', '+441234567802', 'Security Team', 'High',
 '172.16.10.1', 'Secure government network', 0),

('Hospitality', 'Ubiquiti UniFi Dream Machine', 'Wireless', 1, NULL, NULL, 'Ethernet', 8,
 'Static', 'VLAN60', 1, 3, 'Grand Hotel', 'The Promenade, Brighton', 'BN1 2WA',
 'it@grandhotel.com', 'reception@grandhotel.com', '+441234567803', 'Hotel Manager', 'Medium',
 '192.168.200.1', 'Guest WiFi network', 1),

('Manufacturing', 'Fortinet FortiGate 60F', 'Fibre', 2, NULL, NULL, 'Ethernet', 16,
 'Dynamic', 'VLAN70-80', 1, 2, 'Factory Plant', 'Industrial Estate, Birmingham', 'B6 7AB',
 'engineering@factory.com', 'maintenance@factory.com', '+441234567804', 'Plant Manager', 'Low',
 '10.30.0.1', 'Industrial control network', 0),

('Finance', 'Cisco ASA 5500-X', 'Fibre', 4, 'Fibre', 4, 'SFP+', 24,
 'Hybrid', 'VLAN90-100', 0, 1, 'Bank Headquarters', '1 Threadneedle St, London', 'EC2R 8AH',
 'network@bigbank.com', 'security@bigbank.com', '+441234567805', 'CIO', 'High',
 '172.25.0.1', 'Financial transactions network', 1),

('Transport', 'MikroTik RB4011', 'Wireless', 2, NULL, NULL, 'Ethernet', 10,
 'Static', 'VLAN110', 1, 4, 'Bus Depot', 'Transport Way, Leeds', 'LS9 8DA',
 'it@bustransport.com', 'operations@bustransport.com', '+441234567806', 'Transport Manager', 'Medium',
 '192.168.150.1', 'Fleet management network', 0),

('Non-Profit', 'Netgear GS748T', 'Copper', 1, NULL, NULL, 'Ethernet', 48,
 'Dynamic', 'VLAN120-130', 1, 1, 'Charity Office', 'Hope Street, Liverpool', 'L1 9BX',
 'info@charity.org', 'support@charity.org', '+441234567807', 'Operations Manager', 'Low',
 '10.40.0.1', 'Office network', 1),

('Construction', 'DrayTek Vigor 3910', 'Fibre', 2, NULL, NULL, 'Ethernet', 8,
 'Hybrid', 'VLAN140', 0, 2, 'Site Office', 'Building Site, Manchester', 'M15 4ST',
 'site@construction.co.uk', NULL, '+441234567808', 'Site Manager', 'Medium',
 '192.168.250.1', 'Temporary site network', 0),

('Entertainment', 'Sophos XG 230', 'Wireless', 4, 'Copper', 2, 'SFP+', 16,
 'Static', 'VLAN150-160', 1, 1, 'Media Studio', 'Production Road, London', 'W12 7TP',
 'tech@media.com', 'production@media.com', '+441234567809', 'Tech Supervisor', 'High',
 '172.18.0.1', 'Media production network', 1);

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
