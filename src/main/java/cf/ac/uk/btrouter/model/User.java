package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Getter
    @Setter
    private Long id;

    public @Email(message = "Please provide a valid email address") @NotBlank(message = "Email is required") @Size(max = 255, message = "Email must be less than 255 characters") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "Please provide a valid email address") @NotBlank(message = "Email is required") @Size(max = 255, message = "Email must be less than 255 characters") String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank(message = "Password is required") @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
            message = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character") String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "Password is required") @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
            message = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character") String password) {
        this.password = password;
    }

    public @NotBlank(message = "Last name is required") @Size(min = 2, max = 255, message = "Last name must be between 2 and 255 characters") @Pattern(regexp = "^[a-zA-Z\\s-']+$", message = "Last name can only contain letters, spaces, hyphens, and apostrophes") String getLastName() {
        return lastName;
    }

    public void setLastName(@NotBlank(message = "Last name is required") @Size(min = 2, max = 255, message = "Last name must be between 2 and 255 characters") @Pattern(regexp = "^[a-zA-Z\\s-']+$", message = "Last name can only contain letters, spaces, hyphens, and apostrophes") String lastName) {
        this.lastName = lastName;
    }

    public @NotBlank(message = "First name is required") @Size(min = 2, max = 255, message = "First name must be between 2 and 255 characters") @Pattern(regexp = "^[a-zA-Z\\s-']+$", message = "First name can only contain letters, spaces, hyphens, and apostrophes") String getFirstName() {
        return firstName;
    }

    public void setFirstName(@NotBlank(message = "First name is required") @Size(min = 2, max = 255, message = "First name must be between 2 and 255 characters") @Pattern(regexp = "^[a-zA-Z\\s-']+$", message = "First name can only contain letters, spaces, hyphens, and apostrophes") String firstName) {
        this.firstName = firstName;
    }

    public @NotNull(message = "Role is required") Role getRole() {
        return role;
    }

    public void setRole(@NotNull(message = "Role is required") Role role) {
        this.role = role;
    }

    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Email is required")
    @Size(max = 255, message = "Email must be less than 255 characters")
    @Column(name = "email", nullable = false, unique = true)
    @Getter
    @Setter
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
            message = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    @Column(name = "password", nullable = false)
    @Getter
    @Setter
    private String password;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 255, message = "First name must be between 2 and 255 characters")
    @Pattern(regexp = "^[a-zA-Z\\s-']+$", message = "First name can only contain letters, spaces, hyphens, and apostrophes")
    @Column(name = "first_name", nullable = false)
    @Getter
    @Setter
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 255, message = "Last name must be between 2 and 255 characters")
    @Pattern(regexp = "^[a-zA-Z\\s-']+$", message = "Last name can only contain letters, spaces, hyphens, and apostrophes")
    @Column(name = "last_name", nullable = false)
    @Getter
    @Setter
    private String lastName;

    @NotNull(message = "Role is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @Getter
    @Setter
    private Role role;

    public enum Role {
        ADMIN, SUPPORT_AGENT, USER
    }
}