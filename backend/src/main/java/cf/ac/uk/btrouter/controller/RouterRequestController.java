package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.dto.OrderRequest;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.service.RouterOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
