package cf.ac.uk.btrouter.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import cf.ac.uk.btrouter.repository.OrderRepository;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.dto.OrderRequest;

import java.util.List;

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
}

