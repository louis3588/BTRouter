package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user/settings")
public class UserSettingsController {

    private final UserService userService;

    public UserSettingsController(UserService userService) {
        this.userService = userService;
    }

    // Get User Settings
    @GetMapping
    public ResponseEntity<User> getUserSettings(Principal principal) {
        User user = userService.findByEmail(principal.getName());
        return ResponseEntity.ok(user);
    }

    // Update User Settings
    @PutMapping
    public ResponseEntity<User> updateUserSettings(@RequestBody User updatedUser, Principal principal) {
        User user = userService.updateUserSettings(principal.getName(), updatedUser);
        return ResponseEntity.ok(user);
    }

    // Delete Account
    @DeleteMapping
    public ResponseEntity<String> deleteUser(Principal principal) {
        userService.deleteUser(principal.getName());
        return ResponseEntity.ok("User account deleted successfully.");
    }
}
