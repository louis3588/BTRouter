package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {


    public final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Admin-only user management endpoint
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> listUsers() {
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


    @DeleteMapping("admin/users/{email}")
    public ResponseEntity deleteUser(@PathVariable String email) {
        User selectedUser = userService.findByEmail(email);
        userService.delete(selectedUser);
        return ResponseEntity.ok().build();
    }

}
