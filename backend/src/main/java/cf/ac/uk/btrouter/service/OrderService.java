package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.dto.OrderResponseDTO;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.model.OrderItem;
import cf.ac.uk.btrouter.repository.OrderRepository;
import cf.ac.uk.btrouter.repository.OrderItemRepository;
import cf.ac.uk.btrouter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;

    public List<OrderResponseDTO> getUserOrders(String email) {
        return orderRepository.findByUserEmail(email).stream()
                .map(order -> {
                    Optional<OrderItem> item = orderItemRepository.findFirstByOrderOrderID(order.getId().intValue());
                    return new OrderResponseDTO(
                            Math.toIntExact(order.getId()),
                            item.map(OrderItem::getRouterName).orElse("Unknown Router"),
                            order.getOrderDate(),
                            order.getStatus()
                    );
                })
                .collect(Collectors.toList());
    }
}
