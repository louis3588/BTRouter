package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.dto.OrderRequest;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.service.RouterOrderService;
import cf.ac.uk.btrouter.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // Allows frontend to connect
public class RouterRequestController {

    @Autowired
    private RouterOrderService routerOrderService;

    @Autowired
    private NewsService newsService;

    // ✅ Create a new router request using the authenticated user's email
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        try {
            String email = authentication.getName(); // Extract user email from JWT
            orderRequest.setSitePrimaryEmail(email);  // Force correct email
            Order savedOrder = routerOrderService.saveOrder(orderRequest);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 🔵 Fetch all router requests (admin)
    @GetMapping
    public ResponseEntity<List<Order>> getAllRequests() {
        return ResponseEntity.ok(routerOrderService.getAllRequests());
    }

    // 🟡 Fetch only pending router requests (admin)
    @GetMapping("/pending")
    public ResponseEntity<List<Order>> getPendingRequests() {
        return ResponseEntity.ok(routerOrderService.getPendingRequests());
    }

    // 🔴 Update the status of a router request (admin)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        Order updatedOrder = routerOrderService.updateOrderStatus(id, newStatus);

        if (updatedOrder != null) {
            // ✅ Push a system-generated announcement
            String ref = updatedOrder.getReferenceNumber();
            newsService.createNews(
                "Router Request Status Updated",
                "Your router request (" + ref + ") has been updated to **" + newStatus + "**."
            );
        }

        return ResponseEntity.ok("Status updated successfully");
    }

    // ✅ Fetch all router requests submitted by the currently logged-in user
    @GetMapping("/user")
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        String email = authentication.getName(); // Extract user email from JWT
        List<Order> orders = routerOrderService.getOrdersByEmail(email);
        return ResponseEntity.ok(orders);
    }
}
