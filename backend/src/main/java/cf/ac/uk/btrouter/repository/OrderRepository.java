package cf.ac.uk.btrouter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cf.ac.uk.btrouter.model.Order;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Fetch orders only for the logged-in user, sorted by order date
    @Query("SELECT o FROM Order o WHERE o.email = :email ORDER BY o.orderDate DESC")
    List<Order> findOrdersByEmail(@Param("email") String email);


    @Query("SELECT o FROM Order o WHERE o.id = :orderId AND o.email = :email")
    Order findOrderByIdAndEmail(@Param("orderId") Long orderId, @Param("email") String email);

}
