package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.service.RouterOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")  // Adjust if needed for security
public class OrderHistoryController {

    private final RouterOrderService routerOrderService;

    public OrderHistoryController(RouterOrderService routerOrderService) {
        this.routerOrderService = routerOrderService;
    }

    // Get users order history
    @GetMapping("/history")
    public ResponseEntity<List<Order>> getOrderHistory(Authentication authentication) {
        String userEmail = authentication.getName(); // Get the logged-in user's email
        List<Order> orders = routerOrderService.getOrdersByEmail(userEmail);
        return ResponseEntity.ok(orders);
    }

    // Reorder an existing router
    @PostMapping("/reorder/{orderId}")
    public ResponseEntity<?> reorderRouter(@PathVariable Long orderId, Authentication authentication) {
        if (authentication == null) {
            System.out.println("🔴 Authentication object is NULL! User is not authenticated.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized access");
        }

        String userEmail = authentication.getName();
        System.out.println("🔵 Authenticated user: " + userEmail);

        try {
            Order newOrder = routerOrderService.reorderRouter(orderId, userEmail);
            return ResponseEntity.ok(newOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reordering router: " + e.getMessage());
        }
    }

    // Fetch full order details by ID - View Details feature.
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderDetails(@PathVariable Long orderId, Authentication authentication) {
        String userEmail = authentication.getName();
        Order order = routerOrderService.getOrderById(orderId, userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access"));

        return ResponseEntity.ok(order);
    }

}
