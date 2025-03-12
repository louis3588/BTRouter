package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "router_orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerType;
    private String routerType;
    private String primaryOutsideConnection;
    private Integer primaryOutsidePorts;
    private String secondaryOutsideConnection;
    private Integer secondaryOutsidePorts;
    private String primaryInsideConnection;
    private Integer primaryInsidePorts;
    private String vlanConfiguration;
    private String vlanAssignments;
    private Boolean dhcpConfiguration;

    // Explicitly map to the column name Hibernate is expecting.
    @Column(name = "number_of_routers", nullable = false)
    private Integer numRouters;

    private String siteName;
    private String siteAddress;
    private String sitePostcode;
    private String sitePrimaryEmail;
    private String siteSecondaryEmail;
    private String sitePhone;
    private String siteContactName;
    private String priorityLevel;
    private Boolean addAnotherRouter;

    // Additional fields needed by the service layer:
    private String ipAddress;
    private String configurationDetails;
    
    // Added field for city (if required)
    private String siteCity;
    
    // Field for order date
    private LocalDateTime orderDate;

    // Set default value if not provided.
    @PrePersist
    public void setDefaultValues() {
        if (numRouters == null || numRouters <= 0) {
            numRouters = 1; // Default to 1
        }
    }

    // Custom getters/setters to provide the method names expected by RouterOrderService

    // Map getEmail() to sitePrimaryEmail.
    public String getEmail() {
        return sitePrimaryEmail;
    }
    public void setEmail(String email) {
        this.sitePrimaryEmail = email;
    }

    // Map getRouterModel() to routerType.
    public String getRouterModel() {
        return routerType;
    }

    // For ipAddress, Lombok already generates getIpAddress() and setIpAddress()
    
    // If configurationDetails is not explicitly set, combine vlanConfiguration and vlanAssignments.
    public String getConfigurationDetails() {
        if (configurationDetails != null && !configurationDetails.isEmpty()) {
            return configurationDetails;
        } else {
            return "VLAN Config: " + vlanConfiguration + ", VLAN Assignments: " + vlanAssignments;
        }
    }
    public void setConfigurationDetails(String configurationDetails) {
        this.configurationDetails = configurationDetails;
    }

    // Map getNumberOfRouters() to numRouters.
    public int getNumberOfRouters() {
        return numRouters;
    }
    public void setNumberOfRouters(int numberOfRouters) {
        this.numRouters = numberOfRouters;
    }

    // Map getAddress() to siteAddress.
    public String getAddress() {
        return siteAddress;
    }
    public void setAddress(String address) {
        this.siteAddress = address;
    }

    // Map getCity() to siteCity.
    public String getCity() {
        return siteCity;
    }
    public void setCity(String city) {
        this.siteCity = city;
    }

    // Map getPostcode() to sitePostcode.
    public String getPostcode() {
        return sitePostcode;
    }
    public void setPostcode(String postcode) {
        this.sitePostcode = postcode;
    }

    // Map getPhoneNumber() to sitePhone.
    public String getPhoneNumber() {
        return sitePhone;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.sitePhone = phoneNumber;
    }

    // Order date getter/setter (even though Lombok generates these, they’re explicitly defined for clarity)
    public LocalDateTime getOrderDate() {
        return orderDate;
    }
    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }
}
