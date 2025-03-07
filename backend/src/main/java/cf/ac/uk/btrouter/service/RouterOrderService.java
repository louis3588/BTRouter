package cf.ac.uk.btrouter.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import cf.ac.uk.btrouter.repository.OrderRepository;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.dto.OrderRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RouterOrderService {

    @Autowired
    private OrderRepository orderRepository;

    public void saveOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setSiteName(orderRequest.getSiteName());

        // ✅ Ensure these values are properly set
        order.setRouterModel(orderRequest.getRouterModel() != null ? orderRequest.getRouterModel() : "Unknown Model");
        order.setIpAddress(orderRequest.getIpAddress() != null ? orderRequest.getIpAddress() : "Not Assigned");
        order.setConfigurationDetails(orderRequest.getConfigurationDetails() != null ? orderRequest.getConfigurationDetails() : "Default Configuration");

        order.setRouterType(orderRequest.getRouterType());
        order.setNumberOfRouters(orderRequest.getNumRouters() != null ? orderRequest.getNumRouters() : 1);  // ✅ Fix Mapping
        order.setAddress(orderRequest.getSiteAddress());
        order.setCity(orderRequest.getCity());
        order.setPostcode(orderRequest.getPostcode());
        order.setEmail(orderRequest.getEmail());
        order.setPhoneNumber(orderRequest.getPhone());
        orderRepository.save(order);
    }

    public RouterOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Fetch orders by user email
    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findOrdersByEmail(email);
    }

    // New method to reorder a router
    public Order reorderRouter(Long orderId, String userEmail) {
        Optional<Order> existingOrder = orderRepository.findById(orderId);

        if (existingOrder.isPresent()) {
            Order oldOrder = existingOrder.get();

            // Ensure only the correct user can reorder their own order
            if (!oldOrder.getEmail().equals(userEmail)) {
                throw new IllegalArgumentException("Unauthorized to reorder this order.");
            }

            Order newOrder = new Order();
            newOrder.setSiteName(oldOrder.getSiteName());
            newOrder.setRouterModel(oldOrder.getRouterModel());
            newOrder.setIpAddress(oldOrder.getIpAddress());
            newOrder.setConfigurationDetails(oldOrder.getConfigurationDetails());
            newOrder.setRouterType(oldOrder.getRouterType());
            newOrder.setNumberOfRouters(oldOrder.getNumberOfRouters());
            newOrder.setAddress(oldOrder.getAddress());
            newOrder.setCity(oldOrder.getCity());
            newOrder.setPostcode(oldOrder.getPostcode());
            newOrder.setEmail(userEmail); // Ensure correct user is linked
            newOrder.setPhoneNumber(oldOrder.getPhoneNumber());

            // Set a new order date for reorders
            newOrder.setOrderDate(LocalDateTime.now());

            // Save the new order
            return orderRepository.save(newOrder);
        }

        throw new IllegalArgumentException("Order with ID " + orderId + " not found.");
    }
}

