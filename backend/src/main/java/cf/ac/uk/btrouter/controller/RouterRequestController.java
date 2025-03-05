package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.RouterRequest;
import cf.ac.uk.btrouter.service.RouterRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routerrequests")
public class RouterRequestController {

    @Autowired
    private RouterRequestService routerRequestService;

    @PostMapping
    public RouterRequest createRouterRequest(@RequestBody RouterRequest routerRequest) {
        return routerRequestService.createRouterRequest(routerRequest);
    }
}
