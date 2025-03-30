package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.dto.OrderRequest;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.model.OrderTracking;
import cf.ac.uk.btrouter.repository.OrderTrackingRepository;
import cf.ac.uk.btrouter.service.RouterOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // Allows frontend to connect
public class RouterRequestController {

    @Autowired
    private RouterOrderService routerOrderService;

    @Autowired
    private OrderTrackingRepository orderTrackingRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            Order savedOrder = routerOrderService.saveOrder(orderRequest);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllRequests() {
        List<Order> orders = routerOrderService.getAllRequests();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Order order : orders) {
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("id", order.getId());
            orderMap.put("sitePrimaryEmail", order.getSitePrimaryEmail());
            orderMap.put("orderDate", order.getOrderDate());
            orderMap.put("priorityLevel", order.getPriorityLevel());
            orderMap.put("status", order.getStatus());
            OrderTracking tracking = orderTrackingRepository.findByOrderId(order.getId()).orElse(null);
            if (tracking != null) {
                orderMap.put("trackingReference", tracking.getReferenceNumber());
            } else {
                orderMap.put("trackingReference", "N/A");
            }
            result.add(orderMap);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests() {
        List<Order> orders = routerOrderService.getPendingRequests();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Order order : orders) {
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("id", order.getId());
            orderMap.put("sitePrimaryEmail", order.getSitePrimaryEmail());
            orderMap.put("orderDate", order.getOrderDate());
            orderMap.put("priorityLevel", order.getPriorityLevel());
            orderMap.put("status", order.getStatus());
            OrderTracking tracking = orderTrackingRepository.findByOrderId(order.getId()).orElse(null);
            if (tracking != null) {
                orderMap.put("trackingReference", tracking.getReferenceNumber());
            } else {
                orderMap.put("trackingReference", "N/A");
            }
            result.add(orderMap);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        routerOrderService.updateOrderStatus(id, newStatus);
        return ResponseEntity.ok("Status updated successfully");
    }
}
