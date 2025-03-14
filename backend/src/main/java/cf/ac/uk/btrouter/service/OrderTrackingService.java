package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.OrderTracking;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.repository.OrderTrackingRepository;
import cf.ac.uk.btrouter.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.UUID;

@Service
public class OrderTrackingService {

    private static final Logger logger = LoggerFactory.getLogger(OrderTrackingService.class);

    private final OrderTrackingRepository orderTrackingRepository;
    private final OrderRepository orderRepository;
    private final EmailService emailService;

    @Autowired
    public OrderTrackingService(
            OrderTrackingRepository orderTrackingRepository,
            OrderRepository orderRepository,
            EmailService emailService) {
        this.orderTrackingRepository = orderTrackingRepository;
        this.orderRepository = orderRepository;
        this.emailService = emailService;
    }

    // Generate unique reference number for order tracking
    private String generateReferenceNumber() {
        return "BT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // Create new tracking entry for an order
    @Transactional
    public OrderTracking createOrderTracking(Long orderId) {
        logger.info("Creating tracking for order ID: {}", orderId);

        // Get the order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        // Create tracking entity
        OrderTracking tracking = new OrderTracking();
        tracking.setOrderId(orderId);
        tracking.setReferenceNumber(generateReferenceNumber());
        tracking.setStatus("PENDING");
        tracking.setCanModify(true);
        tracking.setCanCancel(true);

        // Save tracking information
        OrderTracking savedTracking = orderTrackingRepository.save(tracking);
        logger.info("Created tracking with reference number: {}", savedTracking.getReferenceNumber());

        // Send confirmation email
        try {
            emailService.sendOrderConfirmationEmail(
                    order.getSitePrimaryEmail(),
                    savedTracking.getReferenceNumber(),
                    order
            );
            logger.info("Sent confirmation email to: {}", order.getSitePrimaryEmail());
        } catch (Exception e) {
            logger.error("Failed to send confirmation email", e);
            // Don't throw the exception - we still want to return the tracking info
        }

        return savedTracking;
    }

    // Retrieve tracking information by reference number
    public OrderTracking getOrderTracking(String referenceNumber) {
        return orderTrackingRepository.findByReferenceNumber(referenceNumber)
                .orElseThrow(() -> new RuntimeException("Order not found with reference: " + referenceNumber));
    }

    // Update order status and permissions
    @Transactional
    public OrderTracking updateOrderStatus(String referenceNumber, String newStatus) {
        OrderTracking tracking = getOrderTracking(referenceNumber);

        // Update status
        tracking.setStatus(newStatus);

        // Update modification permissions based on new status
        updateModificationPermissions(tracking, newStatus);

        OrderTracking updatedTracking = orderTrackingRepository.save(tracking);

        // Get the associated order
        Order order = orderRepository.findById(tracking.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Send status update email
        try {
            emailService.sendOrderStatusUpdateEmail(
                    order.getSitePrimaryEmail(),
                    referenceNumber,
                    newStatus
            );
        } catch (Exception e) {
            logger.error("Failed to send status update email", e);
        }

        return updatedTracking;
    }

    // Handle order cancellation
    @Transactional
    public void cancelOrder(String referenceNumber) {
        OrderTracking tracking = getOrderTracking(referenceNumber);

        // Check if cancellation is allowed
        if (!tracking.isCanCancel()) {
            throw new RuntimeException("Order cannot be cancelled at this stage");
        }

        // Update order status and permissions
        tracking.setStatus("CANCELLED");
        tracking.setCanModify(false);
        tracking.setCanCancel(false);
        orderTrackingRepository.save(tracking);

        // Get the associated order
        Order order = orderRepository.findById(tracking.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Send cancellation confirmation
        try {
            emailService.sendOrderCancellationEmail(
                    order.getSitePrimaryEmail(),
                    referenceNumber
            );
        } catch (Exception e) {
            logger.error("Failed to send cancellation email", e);
        }
    }

    // Handle order modification
    @Transactional
    public void modifyOrder(String referenceNumber, Order modifiedOrder) {
        OrderTracking tracking = getOrderTracking(referenceNumber);

        // Check if modification is allowed
        if (!tracking.isCanModify()) {
            throw new RuntimeException("Order cannot be modified at this stage");
        }

        // Get the original order
        Order originalOrder = orderRepository.findById(tracking.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Update order details
        originalOrder.setNumRouters(modifiedOrder.getNumRouters());
        Order savedOrder = orderRepository.save(originalOrder);

        // Send modification confirmation
        try {
            emailService.sendOrderModificationEmail(
                    savedOrder.getSitePrimaryEmail(),
                    referenceNumber,
                    savedOrder
            );
        } catch (Exception e) {
            logger.error("Failed to send modification email", e);
        }
    }

    // Update modification permissions based on status
    private void updateModificationPermissions(OrderTracking tracking, String newStatus) {
        switch (newStatus) {
            case "PENDING":
                tracking.setCanModify(true);
                tracking.setCanCancel(true);
                break;

            case "CONFIRMED":
                // Can modify within 24 hours of creation
                Duration timeSinceCreation = Duration.between(tracking.getCreatedAt(), LocalDateTime.now());
                tracking.setCanModify(timeSinceCreation.toHours() < 24);
                tracking.setCanCancel(true);
                break;

            case "IN_PRODUCTION":
            case "QUALITY_CHECK":
            case "READY_FOR_SHIPPING":
            case "IN_TRANSIT":
            case "DELIVERED":
            case "CANCELLED":
                tracking.setCanModify(false);
                tracking.setCanCancel(false);
                break;
        }
    }
}