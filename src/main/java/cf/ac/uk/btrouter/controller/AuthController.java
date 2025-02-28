package cf.ac.uk.btrouter.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.service.UserService;
import cf.ac.uk.btrouter.config.SecurityConfig;
import cf.ac.uk.btrouter.dto.LoginDTO;
import java.util.HashMap;
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

    // Handle user login and return JWT token with user details
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

            // Generate JWT and prepare response with user details
            User user = userService.findByEmail(loginRequest.getEmail());
            String jwt = securityConfig.generateToken(user.getEmail(), user.getRole().name());

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("role", user.getRole().name());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }
    }

    // Handle new user registration and return JWT token
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Save new user and generate their JWT token
            User savedUser = userService.registerUser(user);
            String jwt = securityConfig.generateToken(savedUser.getEmail(), savedUser.getRole().name());

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("role", savedUser.getRole().name());
            response.put("message", "Registration successful");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}