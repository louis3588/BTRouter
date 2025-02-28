package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.Order;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    Order createOrder(Order order);
    List<Order> getAllOrders();
    Optional<Order> getOrderById(Long id);
}
