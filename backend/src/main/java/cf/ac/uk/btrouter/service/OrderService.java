//package cf.ac.uk.btrouter.service;
//
//import cf.ac.uk.btrouter.model.Order;
//import cf.ac.uk.btrouter.repository.OrderRepository;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class OrderService {
//    private final OrderRepository orderRepository;
//
//    public OrderService(OrderRepository orderRepository) {
//        this.orderRepository = orderRepository;
//    }
//
//    public List<Order> getUserOrders(Long userId) {
//        return orderRepository.findByUserId(userId);
//    }
//
//    public Order getOrderDetails(Long orderId) {
//        return orderRepository.findById(orderId).orElse(null);
//    }
//}


//================

package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getOrdersForUser(String email) {
        return orderRepository.findByUserEmail(email);
    }
}

