package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.dto.OrderRequest;
import cf.ac.uk.btrouter.model.Order;
import cf.ac.uk.btrouter.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
