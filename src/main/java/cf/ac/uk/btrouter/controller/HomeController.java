package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class HomeController {

    public final UserService userService;

    public HomeController(UserService userService) {
        this.userService = userService;
    }

    // Admin-only dashboard access
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminDashboard() {
        return ResponseEntity.ok(Map.of(
                "message", "Admin Dashboard",
                "access", "full"
        ));
    }

    // Support dashboard for admins and support agents
    @GetMapping("/support/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPPORT_AGENT')")
    public ResponseEntity<?> supportDashboard() {
        return ResponseEntity.ok(Map.of(
                "message", "Support Dashboard",
                "access", "limited"
        ));
    }

    // Basic dashboard accessible by all authenticated users
    @GetMapping("/user/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPPORT_AGENT', 'USER')")
    public ResponseEntity<?> userDashboard() {
        return ResponseEntity.ok(Map.of(
                "message", "User Dashboard",
                "access", "basic"
        ));
    }

    // Admin-only user management endpoint
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> manageUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok().body(users);
    }

    // Admin-only router management endpoint
    @GetMapping("/admin/routers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> manageRouters() {
        return ResponseEntity.ok(Map.of("message", "Router Management"));
    }

    // Router request endpoint for all authenticated users
    @GetMapping("/user/router-request")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPPORT_AGENT', 'USER')")
    public ResponseEntity<?> routerRequest() {
        return ResponseEntity.ok(Map.of("message", "Router Request Form"));
    }
}