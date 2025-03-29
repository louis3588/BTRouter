package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.dto.OrderRequest;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.service.RouterOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // Allows frontend to connect
public class RouterRequestController {

    @Autowired
    private RouterOrderService routerOrderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            Order savedOrder = routerOrderService.saveOrder(orderRequest);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Fetch all router requests
    @GetMapping
    public ResponseEntity<List<Order>> getAllRequests() {
        return ResponseEntity.ok(routerOrderService.getAllRequests());
    }

    // Fetch only pending router requests
    @GetMapping("/pending")
    public ResponseEntity<List<Order>> getPendingRequests() {
        return ResponseEntity.ok(routerOrderService.getPendingRequests());
    }

    // Update the status of a router request
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        routerOrderService.updateOrderStatus(id, newStatus);
        return ResponseEntity.ok("Status updated successfully");
    }
}
