package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.service.RouterOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")  // Adjust if needed for security
public class OrderHistoryController {

    private final RouterOrderService routerOrderService;

    public OrderHistoryController(RouterOrderService routerOrderService) {
        this.routerOrderService = routerOrderService;
    }

    @GetMapping("/history")
    public ResponseEntity<List<Order>> getOrderHistory(Authentication authentication) {
        String userEmail = authentication.getName(); // Get the logged-in user's email
        List<Order> orders = routerOrderService.getOrdersByEmail(userEmail);
        return ResponseEntity.ok(orders);
    }
}
