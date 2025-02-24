package cf.ac.uk.btrouter.dto;

/**
 * Data Transfer Object (DTO) for dashboard response.
 */
public class DashboardResponse {
    private String username;
    private String orderStatus;
    private int progress;

    // Constructor
    public DashboardResponse(String username, String orderStatus, int progress) {
        this.username = username;
        this.orderStatus = orderStatus;
        this.progress = progress;
    }

    // Getters
    public String getUsername() {
        return username;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public int getProgress() {
        return progress;
    }

    // For better logging readability
    @Override
    public String toString() {
        return "DashboardResponse{" +
                "username='" + username + '\'' +
                ", orderStatus='" + orderStatus + '\'' +
                ", progress=" + progress +
                '}';
    }
}
