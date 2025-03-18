package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.User;
import cf.ac.uk.btrouter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // Find a user by email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }

    public User findById(int id){
        return userRepository.findById((long) id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Register a new user with encrypted password
    public User registerUser(User user) {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Set default role and encode password
        user.setRole(User.Role.USER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Create password reset token for a user
    public void createPasswordResetTokenForUser(String email) {
        // Find user and generate token
        User user = findByEmail(email);
        String token = UUID.randomUUID().toString();

        // Set token and expiry
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        // Send reset email
        emailService.sendPasswordResetEmail(email, token);
    }

    // Validate password reset token
    public String validatePasswordResetToken(String token) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        // Check if token has expired
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            return "expired";
        }

        return "valid";
    }

    // Reset password using token
    public void resetPassword(String token, String newPassword) {
        // Find user by token
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        // Check token expiration
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        // Update password and clear token
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}