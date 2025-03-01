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
}
