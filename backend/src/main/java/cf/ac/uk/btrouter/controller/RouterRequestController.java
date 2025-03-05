package cf.ac.uk.btrouter.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import cf.ac.uk.btrouter.service.RouterOrderService;
import cf.ac.uk.btrouter.dto.OrderRequest;

@RestController
@RequestMapping("/api/orders")
public class RouterRequestController {

    @Autowired
    private RouterOrderService routerOrderService;

    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody OrderRequest orderRequest) {
        routerOrderService.saveOrder(orderRequest);
        return ResponseEntity.ok("Order submitted successfully with all details!");
    }
}
