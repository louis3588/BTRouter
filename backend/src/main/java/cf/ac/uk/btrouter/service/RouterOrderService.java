package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.dto.OrderRequest;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RouterOrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order saveOrder(OrderRequest orderRequest) {
        Order order = new Order();
        
        order.setCustomerType(orderRequest.getCustomerType());
        order.setRouterType(orderRequest.getRouterType());
        order.setPrimaryOutsideConnection(orderRequest.getPrimaryOutsideConnection());
        order.setPrimaryOutsidePorts(orderRequest.getPrimaryOutsidePorts());
        order.setSecondaryOutsideConnection(orderRequest.getSecondaryOutsideConnection());
        order.setSecondaryOutsidePorts(orderRequest.getSecondaryOutsidePorts());
        order.setPrimaryInsideConnection(orderRequest.getPrimaryInsideConnection());
        order.setPrimaryInsidePorts(orderRequest.getPrimaryInsidePorts());
        order.setVlanConfiguration(orderRequest.getVlanConfiguration());
        order.setVlanAssignments(orderRequest.getVlanAssignments());

        // ✅ Fix: Ensure dhcpConfiguration is always Boolean
        order.setDhcpConfiguration(orderRequest.getDhcpConfiguration() != null && orderRequest.getDhcpConfiguration());

        // ✅ Fix: Ensure numRouters is never null (Must be at least 1)
        order.setNumRouters((orderRequest.getNumRouters() != null && orderRequest.getNumRouters() > 0) ? orderRequest.getNumRouters() : 1);

        order.setSiteName(orderRequest.getSiteName());
        order.setSiteAddress(orderRequest.getSiteAddress());
        order.setSitePostcode(orderRequest.getSitePostcode());
        order.setSitePrimaryEmail(orderRequest.getSitePrimaryEmail());
        order.setSiteSecondaryEmail(orderRequest.getSiteSecondaryEmail());
        order.setSitePhone(orderRequest.getSitePhone());
        order.setSiteContactName(orderRequest.getSiteContactName());
        order.setPriorityLevel(orderRequest.getPriorityLevel());

        // ✅ Fix: Ensure addAnotherRouter is always Boolean
        order.setAddAnotherRouter(orderRequest.getAddAnotherRouter() != null && orderRequest.getAddAnotherRouter());

        return orderRepository.save(order);
    }

    public RouterOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Fetch orders by user email
    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findOrdersByEmail(email);
    }

    // Fetch a specific order by ID but ensure it belongs to the user
    public Optional<Order> getOrderById(Long orderId, String userEmail) {
        return Optional.ofNullable(orderRepository.findOrderByIdAndEmail(orderId, userEmail));
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

