package cf.ac.uk.btrouter.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.service.UserService;
import cf.ac.uk.btrouter.config.SecurityConfig;
import cf.ac.uk.btrouter.dto.LoginDTO;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")  // Allows requests from any origin
public class AuthController {
    // Required dependencies for authentication
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final SecurityConfig securityConfig;

    // Constructor injection of required services
    public AuthController(AuthenticationManager authenticationManager,
                          UserService userService,
                          SecurityConfig securityConfig) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.securityConfig = securityConfig;
    }

    // Handle user login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginRequest) {
        try {
            // Authenticate user credentials
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Generate JWT token for authenticated user
            User user = userService.findByEmail(loginRequest.getEmail());
            final String jwt = securityConfig.generateToken(user.getEmail());

            return ResponseEntity.ok(Map.of("token", jwt));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
        }
    }

    // Handle new user registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Save new user and generate their JWT token
            User savedUser = userService.registerUser(user);
            final String jwt = securityConfig.generateToken(savedUser.getEmail());

            return ResponseEntity.ok(Map.of("token", jwt));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}