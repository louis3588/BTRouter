package cf.ac.uk.btrouter.controllers;

import cf.ac.uk.btrouter.dto.DashboardResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for handling dashboard-related API requests.
 */
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}) // Allow frontend access from Next.js
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    /**
     * Returns static dashboard data for testing purposes.
     *
     * @return ResponseEntity containing dashboard data
     */
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboardData() {
        logger.info("Fetching dashboard data for frontend");

        // Simulating dashboard data (this would eventually come from your database)
        DashboardResponse response = new DashboardResponse(
                "John Doe",
                "In Transit",
                75 // Represents progress percentage
        );

        // Log for debugging purposes
        logger.debug("Dashboard Data: {}", response);

        return ResponseEntity.ok(response);
    }
}
