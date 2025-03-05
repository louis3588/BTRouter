package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import cf.ac.uk.btrouter.model.RouterPreset;

@Data
@Entity
@Table(name = "OrderItems")
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "router_preset_id", nullable = true)
    private RouterPreset routerPreset;

    @Column(name = "router_name", nullable = false)
    private String routerName;

    @Column(name = "primary_outside_connections", nullable = false)
    private String primaryOutsideConnections;

    @Column(name = "secondary_outside_connections")
    private String secondaryOutsideConnections;

    @Column(name = "inside_connections", nullable = false)
    private String insideConnections;

    @Column(name = "number_of_ethernet_ports", nullable = false)
    private int numberOfEthernetPorts;

    @Column(name = "number_of_serial_ports", nullable = false)
    private int numberOfSerialPorts;

    @Enumerated(EnumType.STRING)
    @Column(name = "vlans", nullable = false)
    private VlanType vlan;

    @Column(name = "dhcp")
    private Boolean dhcp;

    @Column(name = "quantity", nullable = false)
    private int quantity;
}

