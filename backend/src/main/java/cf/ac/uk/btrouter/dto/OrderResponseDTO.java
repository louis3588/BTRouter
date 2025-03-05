package cf.ac.uk.btrouter.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {
    private int id;
    private String routerType;
    private LocalDateTime orderDate;
    private String status;

    public OrderResponseDTO(int id, String routerType, LocalDateTime orderDate, String status) {
        this.id = id;
        this.routerType = routerType;
        this.orderDate = orderDate;
        this.status = status;
    }

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getRouterType() { return routerType; }
    public void setRouterType(String routerType) { this.routerType = routerType; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
