package cf.ac.uk.btrouter.dto;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderTrackingDTO {
    private String referenceNumber;
    private String status;
    private boolean canModify;
    private boolean canCancel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String routerType;
    private Integer numRouters;
    private String siteName;
    private String siteAddress;
    private String sitePostcode;
    private String sitePrimaryEmail;
    private String sitePhone;
    private String siteContactName;
    private String customerType;
    private String priorityLevel;
}