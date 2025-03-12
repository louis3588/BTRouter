package cf.ac.uk.btrouter.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
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

    // Handle password reset request
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            // Validate email presence
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }

            // Process password reset request
            userService.createPasswordResetTokenForUser(email);
            return ResponseEntity.ok().body("Password reset email sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Validate password reset token
    @GetMapping("/reset-password/validate")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        String result = userService.validatePasswordResetToken(token);
        if (result.equals("valid")) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().body(result);
    }

    // Handle password reset with token
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            // Validate request parameters
            String token = request.get("token");
            String newPassword = request.get("newPassword");

            if (token == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Token and new password are required");
            }

            // Process password reset
            userService.resetPassword(token, newPassword);
            return ResponseEntity.ok().body("Password has been reset successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}