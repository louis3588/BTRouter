package cf.ac.uk.btrouter.repository;

import cf.ac.uk.btrouter.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    Optional<OrderItem> findFirstByOrderOrderID(int orderId);
}
