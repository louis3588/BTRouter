package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.RouterRequest;
import cf.ac.uk.btrouter.repository.RouterRequestRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final RouterRequestRepository routerRequestRepository;

    public OrderController(RouterRequestRepository routerRequestRepository) {
        this.routerRequestRepository = routerRequestRepository;
    }

    @GetMapping
    public Map<String, Object> getOrders(@AuthenticationPrincipal User user) {
        List<RouterRequest> orders = routerRequestRepository.findByPrimaryEmail(user.getUsername());

        // Count most frequently ordered routers
        Map<String, Long> routerCount = orders.stream()
                .collect(Collectors.groupingBy(RouterRequest::getRouterType, Collectors.counting()));

        // Get the most ordered router
        String mostOrderedRouter = routerCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("orders", orders);
        response.put("mostOrderedRouter", mostOrderedRouter);

        return response;
    }
}
