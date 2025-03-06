package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.service.UserService;
import org.springframework.http.HttpStatus;
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
    public List<User> manageUsers() {
        return userService.findAll();
    }

    @PutMapping("admin/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable int id, @RequestBody User userUpdate) {

        User currentUser = userService.findById(id);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        currentUser.setFirstName(userUpdate.getFirstName());
        currentUser.setLastName(userUpdate.getLastName());
        currentUser.setEmail(userUpdate.getEmail());
        currentUser.setRole(userUpdate.getRole());

        // Update password only if a new one is provided
        if (userUpdate.getPassword() != null && !userUpdate.getPassword().isEmpty()) {
            currentUser.setPassword(userUpdate.getPassword());
        }
        userService.saveUser(currentUser);

        return ResponseEntity.ok(currentUser);
    }


    @DeleteMapping("/{email}")
    public ResponseEntity deleteUser(@PathVariable String email) {
        User selectedUser = userService.findByEmail(email);
        userService.delete(selectedUser);
        return ResponseEntity.ok().build();
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