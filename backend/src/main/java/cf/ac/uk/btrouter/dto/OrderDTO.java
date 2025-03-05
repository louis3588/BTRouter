package cf.ac.uk.btrouter.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {

    private Long id;
    private LocalDateTime orderDate;
    private String status;
    private String shippingAddress;
    private List<OrderItemDTO> orderItems;

    @Data
    public static class OrderItemDTO {
        private String routerName;
        private String primaryOutsideConnections;
        private String secondaryOutsideConnections;
        private String insideConnections;
        private int numberOfEthernetPorts;
        private int numberOfSerialPorts;
        private String vlan;
        private Boolean dhcp;
        private int quantity;
    }
}
