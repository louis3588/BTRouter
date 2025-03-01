package cf.ac.uk.btrouter.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import cf.ac.uk.btrouter.repository.OrderRepository;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.dto.OrderRequest;

@Service
public class RouterOrderService {

    @Autowired
    private OrderRepository orderRepository;

    public void saveOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setSiteName(orderRequest.getSiteName());
        order.setRouterModel(orderRequest.getRouterModel());
        order.setIpAddress(orderRequest.getIpAddress());
        order.setConfigurationDetails(orderRequest.getConfigurationDetails());
        orderRepository.save(order);
    }
}
