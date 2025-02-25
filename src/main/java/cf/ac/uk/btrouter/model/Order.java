package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
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
}
