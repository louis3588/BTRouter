package cf.ac.uk.btrouter.dto;

import lombok.Data;

@Data
public class RegisterDTO {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    // Role is set by default to USER in the service layer
}