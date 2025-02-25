package cf.ac.uk.btrouter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cf.ac.uk.btrouter.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
