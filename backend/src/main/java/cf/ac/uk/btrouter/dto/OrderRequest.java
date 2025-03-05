package cf.ac.uk.btrouter.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderRequest {
    private String email;
    private LocalDateTime orderDate;
    private String status;
    private String shippingAddress;
    private List<OrderItemRequest> orderItems;

    @Data
    public static class OrderItemRequest {
        private String productName;
        private int quantity;
        private double price;
    }
}
