package cf.ac.uk.btrouter.repository;

import cf.ac.uk.btrouter.model.RouterRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RouterRequestRepository extends JpaRepository<RouterRequest, Long> {
    List<RouterRequest> findByPrimaryEmail(String primaryEmail);
}
