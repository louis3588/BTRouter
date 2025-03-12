package cf.ac.uk.btrouter.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {
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

    // ✅ Ensure this exists (Use Boolean, not String)
    private Boolean dhcpConfiguration;

    // ✅ Ensure this exists (Use Integer)
    private Integer numRouters;

    private String siteName;
    private String siteAddress;
    private String sitePostcode;
    private String sitePrimaryEmail;
    private String siteSecondaryEmail;
    private String sitePhone;
    private String siteContactName;
    private String priorityLevel;

    // ✅ Ensure this exists (Use Boolean)
    private Boolean addAnotherRouter;
}
