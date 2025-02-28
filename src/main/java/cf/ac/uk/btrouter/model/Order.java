package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;

@Entity
@Table(name = "orders") 
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String routerType;
    private int numRouters;
    private String siteName;
    private String siteAddress;
    private String city;
    private String postcode;
    private String email;
    private String phone;
    private String priority;
    private String additionalInfo;

    // Default constructor (required by JPA)
    public Order() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRouterType() { return routerType; }
    public void setRouterType(String routerType) { this.routerType = routerType; }

    public int getNumRouters() { return numRouters; }
    public void setNumRouters(int numRouters) { this.numRouters = numRouters; }

    public String getSiteName() { return siteName; }
    public void setSiteName(String siteName) { this.siteName = siteName; }

    public String getSiteAddress() { return siteAddress; }
    public void setSiteAddress(String siteAddress) { this.siteAddress = siteAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPostcode() { return postcode; }
    public void setPostcode(String postcode) { this.postcode = postcode; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getAdditionalInfo() { return additionalInfo; }
    public void setAdditionalInfo(String additionalInfo) { this.additionalInfo = additionalInfo; }
}
