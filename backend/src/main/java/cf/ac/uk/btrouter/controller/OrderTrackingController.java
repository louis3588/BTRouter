package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.OrderTracking;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.dto.OrderTrackingDTO;
import cf.ac.uk.btrouter.service.OrderTrackingService;
import cf.ac.uk.btrouter.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/order-tracking")
@CrossOrigin(origins = "*") // Allows frontend to connect
public class OrderTrackingController {

    @Autowired
    private OrderTrackingService orderTrackingService;

    @Autowired
    private OrderRepository orderRepository;

    // Create new tracking for an order
    @PostMapping("/create")
    public ResponseEntity<?> createOrderTracking(@RequestBody Map<String, Long> request) {
        try {
            Long orderId = request.get("orderId");
            if (orderId == null) {
                return ResponseEntity.badRequest().body("Order ID is required");
            }

            OrderTracking tracking = orderTrackingService.createOrderTracking(orderId);
            return ResponseEntity.ok(tracking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Get order status by reference number
    @GetMapping("/{referenceNumber}")
    public ResponseEntity<?> getOrderStatus(@PathVariable String referenceNumber) {
        try {
            OrderTracking tracking = orderTrackingService.getOrderTracking(referenceNumber);
            Order order = orderRepository.findById(tracking.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            OrderTrackingDTO response = OrderTrackingDTO.builder()
                    .referenceNumber(tracking.getReferenceNumber())
                    .status(tracking.getStatus())
                    .canModify(tracking.isCanModify())
                    .canCancel(tracking.isCanCancel())
                    .createdAt(tracking.getCreatedAt())
                    .updatedAt(tracking.getUpdatedAt())
                    .routerType(order.getRouterType())
                    .numRouters(order.getNumRouters())
                    .siteName(order.getSiteName())
                    .siteAddress(order.getSiteAddress())
                    .sitePostcode(order.getSitePostcode())
                    .sitePrimaryEmail(order.getSitePrimaryEmail())
                    .sitePhone(order.getSitePhone())
                    .siteContactName(order.getSiteContactName())
                    .customerType(order.getCustomerType())
                    .priorityLevel(order.getPriorityLevel())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Cancel order by reference number
    @PostMapping("/{referenceNumber}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String referenceNumber) {
        try {
            orderTrackingService.cancelOrder(referenceNumber);

            OrderTracking tracking = orderTrackingService.getOrderTracking(referenceNumber);
            Order order = orderRepository.findById(tracking.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            OrderTrackingDTO response = OrderTrackingDTO.builder()
                    .referenceNumber(tracking.getReferenceNumber())
                    .status(tracking.getStatus())
                    .canModify(tracking.isCanModify())
                    .canCancel(tracking.isCanCancel())
                    .routerType(order.getRouterType())
                    .numRouters(order.getNumRouters())
                    .siteName(order.getSiteName())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Modify order details
    @PutMapping("/{referenceNumber}/modify")
    public ResponseEntity<?> modifyOrder(
            @PathVariable String referenceNumber,
            @RequestBody Order modifiedOrder) {
        try {
            orderTrackingService.modifyOrder(referenceNumber, modifiedOrder);

            OrderTracking tracking = orderTrackingService.getOrderTracking(referenceNumber);
            Order order = orderRepository.findById(tracking.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            OrderTrackingDTO response = OrderTrackingDTO.builder()
                    .referenceNumber(tracking.getReferenceNumber())
                    .status(tracking.getStatus())
                    .canModify(tracking.isCanModify())
                    .canCancel(tracking.isCanCancel())
                    .routerType(order.getRouterType())
                    .numRouters(order.getNumRouters())
                    .siteName(order.getSiteName())
                    .siteAddress(order.getSiteAddress())
                    .sitePostcode(order.getSitePostcode())
                    .sitePrimaryEmail(order.getSitePrimaryEmail())
                    .sitePhone(order.getSitePhone())
                    .siteContactName(order.getSiteContactName())
                    .customerType(order.getCustomerType())
                    .priorityLevel(order.getPriorityLevel())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}