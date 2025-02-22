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
