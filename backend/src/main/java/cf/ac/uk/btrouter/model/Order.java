package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "orders")
public class Order implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String siteName;
    private String routerModel;
    private String ipAddress;
    private String configurationDetails;
    private String routerType;
    private int numberOfRouters;
    private String address;
    private String city;
    private String postcode;
    private String email;
    private String phoneNumber;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSiteName() { return siteName; }
    public void setSiteName(String siteName) { this.siteName = siteName; }
    public String getRouterModel() { return routerModel; }
    public void setRouterModel(String routerModel) { this.routerModel = routerModel; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getConfigurationDetails() { return configurationDetails; }
    public void setConfigurationDetails(String configurationDetails) { this.configurationDetails = configurationDetails; }
    public String getRouterType() { return routerType; }
    public void setRouterType(String routerType) { this.routerType = routerType; }
    public int getNumberOfRouters() { return numberOfRouters; }
    public void setNumberOfRouters(int numberOfRouters) { this.numberOfRouters = numberOfRouters; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getPostcode() { return postcode; }
    public void setPostcode(String postcode) { this.postcode = postcode; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
