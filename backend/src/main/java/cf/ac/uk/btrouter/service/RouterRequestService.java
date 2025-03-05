package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.RouterRequest;
import cf.ac.uk.btrouter.repository.RouterRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouterRequestService {

    @Autowired
    private RouterRequestRepository routerRequestRepository;

    public RouterRequest createRouterRequest(RouterRequest routerRequest) {
        return routerRequestRepository.save(routerRequest);
    }
}
