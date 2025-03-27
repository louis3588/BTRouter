package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.dto.OrderRequest;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RouterOrderService {

    @Autowired
    private OrderRepository orderRepository;

    public RouterOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order saveOrder(OrderRequest orderRequest) {
        Order order = new Order();

        order.setReferenceNumber(UUID.randomUUID().toString()); // Unique Reference Number
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

        // Ensure DHCP Configuration is always a Boolean
        order.setDhcpConfiguration(orderRequest.getDhcpConfiguration() != null && orderRequest.getDhcpConfiguration());

        // Ensure numRouters is never null (Must be at least 1)
        order.setNumRouters((orderRequest.getNumRouters() != null && orderRequest.getNumRouters() > 0) ? orderRequest.getNumRouters() : 1);

        order.setSiteName(orderRequest.getSiteName());
        order.setSiteAddress(orderRequest.getSiteAddress());
        order.setSitePostcode(orderRequest.getSitePostcode());
        order.setSitePrimaryEmail(orderRequest.getSitePrimaryEmail());
        order.setSiteSecondaryEmail(orderRequest.getSiteSecondaryEmail());
        order.setSitePhone(orderRequest.getSitePhone());
        order.setSiteContactName(orderRequest.getSiteContactName());
        order.setPriorityLevel(orderRequest.getPriorityLevel());
        order.setStatus("Pending"); // Default status
        order.setOrderDate(LocalDateTime.now()); // Set request submission date

        // Ensure addAnotherRouter is always Boolean
        order.setAddAnotherRouter(orderRequest.getAddAnotherRouter() != null && orderRequest.getAddAnotherRouter());

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findOrdersByEmail(email);
    }

    public Optional<Order> getOrderById(Long orderId, String userEmail) {
        return Optional.ofNullable(orderRepository.findOrderByIdAndEmail(orderId, userEmail));
    }

    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    public List<Order> getPendingRequests() {
        return orderRepository.findByStatus("Pending");
    }

    public List<Order> getAllRequests() {
        return orderRepository.findAll();
    }

    public Order reorderRouter(Long orderId, String userEmail) {
        Optional<Order> existingOrder = orderRepository.findById(orderId);
        if (existingOrder.isPresent()) {
            Order oldOrder = existingOrder.get();
            if (!oldOrder.getEmail().equals(userEmail)) {
                throw new IllegalArgumentException("Unauthorized to reorder this order.");
            }

            Order newOrder = new Order();
            newOrder.setReferenceNumber(UUID.randomUUID().toString());
            newOrder.setSiteName(oldOrder.getSiteName());
            newOrder.setRouterType(oldOrder.getRouterType());
            newOrder.setIpAddress(oldOrder.getIpAddress());
            newOrder.setConfigurationDetails(oldOrder.getConfigurationDetails());
            newOrder.setCustomerType(oldOrder.getCustomerType());
            newOrder.setNumRouters(oldOrder.getNumberOfRouters());
            newOrder.setSiteAddress(oldOrder.getAddress());
            newOrder.setSitePostcode(oldOrder.getPostcode());
            newOrder.setSitePrimaryEmail(userEmail);
            newOrder.setSitePhone(oldOrder.getPhoneNumber());
            newOrder.setPrimaryOutsideConnection(oldOrder.getPrimaryOutsideConnection());
            newOrder.setPrimaryOutsidePorts(oldOrder.getPrimaryOutsidePorts());
            newOrder.setSecondaryOutsideConnection(oldOrder.getSecondaryOutsideConnection());
            newOrder.setSecondaryOutsidePorts(oldOrder.getSecondaryOutsidePorts());
            newOrder.setPrimaryInsideConnection(oldOrder.getPrimaryInsideConnection());
            newOrder.setPrimaryInsidePorts(oldOrder.getPrimaryInsidePorts());
            newOrder.setVlanConfiguration(oldOrder.getVlanConfiguration());
            newOrder.setVlanAssignments(oldOrder.getVlanAssignments());
            newOrder.setDhcpConfiguration(oldOrder.getDhcpConfiguration());
            newOrder.setSiteContactName(oldOrder.getSiteContactName());
            newOrder.setPriorityLevel(oldOrder.getPriorityLevel());
            newOrder.setAddAnotherRouter(oldOrder.getAddAnotherRouter());
            newOrder.setOrderDate(LocalDateTime.now());
            return orderRepository.save(newOrder);
        }
        throw new IllegalArgumentException("Order with ID " + orderId + " not found.");
    }
}