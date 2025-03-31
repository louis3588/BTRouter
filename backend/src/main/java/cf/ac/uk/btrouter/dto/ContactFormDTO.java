package cf.ac.uk.btrouter.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactFormDTO {
    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String orderReference;

    @NotBlank(message = "Enquiry type is required")
    private String enquiryType;

    @NotBlank(message = "Message is required")
    private String message;
}