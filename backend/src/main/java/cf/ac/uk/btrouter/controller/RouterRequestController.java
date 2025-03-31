package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.dto.OrderRequest;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.model.OrderTracking;
import cf.ac.uk.btrouter.repository.OrderTrackingRepository;
import cf.ac.uk.btrouter.service.RouterOrderService;
import cf.ac.uk.btrouter.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class RouterRequestController {

    @Autowired
    private RouterOrderService routerOrderService;

    @Autowired
    private NewsService newsService;

    @Autowired
    private OrderTrackingRepository orderTrackingRepository;

    // ✅ Create a new router request using the authenticated user's email
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        try {
            String email = authentication.getName();
            orderRequest.setSitePrimaryEmail(email);
            Order savedOrder = routerOrderService.saveOrder(orderRequest);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 🔵 Get all orders with tracking info (admin)
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllRequests() {
        List<Order> orders = routerOrderService.getAllRequests();
        return ResponseEntity.ok(mapOrdersWithTracking(orders));
    }

    // 🟡 Get only pending requests (admin)
    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests() {
        List<Order> orders = routerOrderService.getPendingRequests();
        return ResponseEntity.ok(mapOrdersWithTracking(orders));
    }

    // 🔴 Update order status and push news announcement (admin)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        Order updatedOrder = routerOrderService.updateOrderStatus(id, newStatus);

        if (updatedOrder != null) {
            String ref = updatedOrder.getReferenceNumber();
            newsService.createPost( // ✅ make sure NewsService has createPost method with 3 params
                "Router Request Status Updated",
                "Your router request (" + ref + ") has been updated to **" + newStatus + "**.",
                "System Notification"
            );
        }

        return ResponseEntity.ok("Status updated successfully");
    }

    // 🔹 Get user’s own router requests
    @GetMapping("/user")
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        String email = authentication.getName();
        List<Order> orders = routerOrderService.getOrdersByEmail(email);
        return ResponseEntity.ok(orders);
    }

    // 🔸 Helper to map tracking info
    private List<Map<String, Object>> mapOrdersWithTracking(List<Order> orders) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Order order : orders) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getId());
            map.put("referenceNumber", order.getReferenceNumber());
            map.put("sitePrimaryEmail", order.getSitePrimaryEmail());
            map.put("orderDate", order.getOrderDate());
            map.put("priorityLevel", order.getPriorityLevel());
            map.put("status", order.getStatus());

            OrderTracking tracking = orderTrackingRepository.findByOrderId(order.getId()).orElse(null);
            map.put("trackingReference", tracking != null ? tracking.getReferenceNumber() : "N/A");

            result.add(map);
        }
        return result;
    }
}
