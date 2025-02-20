package cf.ac.uk.btrouter.controllers;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    // Test Values
    @GetMapping
    public Map<String, Object> getDashboardData() {
        Map<String, Object> response = new HashMap<>();
        response.put("username", "John Doe");
        response.put("orderStatus", "In Transit");
        response.put("progress", 33);

        return response;
    }
}
