package cf.ac.uk.btrouter.dto;

public class OrderRequest {
    private String siteName;
    private String routerModel;
    private String ipAddress;
    private String configurationDetails;

    // Getters and Setters
    public String getSiteName() { return siteName; }
    public void setSiteName(String siteName) { this.siteName = siteName; }
    public String getRouterModel() { return routerModel; }
    public void setRouterModel(String routerModel) { this.routerModel = routerModel; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getConfigurationDetails() { return configurationDetails; }
    public void setConfigurationDetails(String configurationDetails) { this.configurationDetails = configurationDetails; }
}
