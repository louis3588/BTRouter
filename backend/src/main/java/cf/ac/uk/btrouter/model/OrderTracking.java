package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "order_tracking")
public class OrderTracking {

    // Primary key for order tracking
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Reference to the original order
    @Column(name = "order_id", nullable = false)
    private Long orderId;

    // Unique reference number for customer tracking
    @Column(name = "reference_number", unique = true, nullable = false)
    private String referenceNumber;

    // Current status of the order
    @Column(nullable = false)
    private String status;

    // Flags for order modification permissions
    @Column(name = "can_modify")
    private boolean canModify;

    @Column(name = "can_cancel")
    private boolean canCancel;

    // Timestamps for tracking history
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationship with the Order entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Order order;

    // Lifecycle hooks for timestamp management
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}