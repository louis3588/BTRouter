package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "router_orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String referenceNumber;
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

    @Column(name = "num_routers", nullable = false)
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
    private String status;

    private String ipAddress;
    private String configurationDetails;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime orderDate;

    @PrePersist
    public void setDefaultValues() {
        if (numRouters == null || numRouters <= 0) {
            numRouters = 1;
        }
        if (referenceNumber == null || referenceNumber.isEmpty()) {
            referenceNumber = UUID.randomUUID().toString();
        }
        if (orderDate == null) {
            orderDate = LocalDateTime.now();
        }
        if (status == null || status.isEmpty()) {
            status = "Pending";
        }
    }

    public String getEmail() {
        return sitePrimaryEmail;
    }
    public void setEmail(String email) {
        this.sitePrimaryEmail = email;
    }

    public String getRouterModel() {
        return routerType;
    }

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

    public int getNumberOfRouters() {
        return numRouters;
    }
    public void setNumberOfRouters(int numberOfRouters) {
        this.numRouters = numberOfRouters;
    }

    public String getAddress() {
        return siteAddress;
    }
    public void setAddress(String address) {
        this.siteAddress = address;
    }

    public String getPostcode() {
        return sitePostcode;
    }
    public void setPostcode(String postcode) {
        this.sitePostcode = postcode;
    }

    public String getPhoneNumber() {
        return sitePhone;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.sitePhone = phoneNumber;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }
    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }
}
