package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    // Set default value if not provided.
    @PrePersist
    public void setDefaultValues() {
        if (numRouters == null || numRouters <= 0) {
            numRouters = 1; // Default to 1
        }
    }
}
