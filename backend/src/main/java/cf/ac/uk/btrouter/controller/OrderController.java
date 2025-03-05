package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.dto.OrderResponseDTO;
import cf.ac.uk.btrouter.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getOrderHistory(Authentication authentication) {
        String userEmail = authentication.getName(); // Extract email from JWT auth
        List<OrderResponseDTO> orders = orderService.getUserOrders(userEmail);

        return ResponseEntity.ok(Map.of(
                "mostOrderedRouter", orders.isEmpty() ? "No Data" : orders.get(0).getRouterType(), // Example logic
                "orders", orders
        ));
    }
}
