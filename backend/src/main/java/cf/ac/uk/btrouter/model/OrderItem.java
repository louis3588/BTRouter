package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private String routerName;
    private String primaryOutsideConnections;
    private String secondaryOutsideConnections;
    private String insideConnections;
    private int numberOfEthernetPorts;
    private int numberOfSerialPorts;
    private String vlans;
    private Boolean dhcp;
    private int quantity;
}
