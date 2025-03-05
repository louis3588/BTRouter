package cf.ac.uk.btrouter.dto;

public class OrderRequest {
    private String siteName;
    private String routerModel;
    private String ipAddress;
    private String configurationDetails;
    private String routerType;
    private Integer numRouters; 
    private String siteAddress;
    private String city;
    private String postcode;
    private String email;
    private String phone;

    // Getters and Setters
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
    public Integer getNumRouters() { return numRouters; } 
    public void setNumRouters(Integer numRouters) { this.numRouters = numRouters; } 
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
}
