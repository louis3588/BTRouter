package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "RouterRequests")
public class RouterRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RequestID")
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "CustomerID", nullable = false)
    private Customer customer;

    @Column(name = "PrimaryEmail", nullable = false)
    private String primaryEmail;

    @Column(name = "SiteName", nullable = false)
    private String siteName;

    @Column(name = "StreetName", nullable = false)
    private String streetName;

    @Column(name = "City", nullable = false)
    private String city;

    @Column(name = "Postcode", nullable = false)
    private String postcode;

    @Column(name = "PhoneNumber", nullable = false)
    private String phoneNumber;

    @Column(name = "NameOfCorrespondence", nullable = false)
    private String nameOfCorrespondence;

    @Enumerated(EnumType.STRING)
    @Column(name = "PriorityLevel", nullable = false)
    private PriorityLevel priorityLevel;

    @Column(name = "RouterType", nullable = false)
    private String routerType;

    @Column(name = "order_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate;

    public enum PriorityLevel {
        Critical, Urgent, High, Medium, Low
    }
}
