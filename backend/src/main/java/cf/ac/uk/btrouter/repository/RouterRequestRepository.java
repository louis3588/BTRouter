package cf.ac.uk.btrouter.repository; 

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.RouterRequest;

public interface RouterRequestRepository extends JpaRepository<RouterRequest, Long> {
}
