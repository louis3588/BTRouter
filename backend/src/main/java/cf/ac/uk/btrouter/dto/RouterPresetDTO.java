package cf.ac.uk.btrouter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RouterPresetDTO {
    private Long routerPresetID;
    private String routerPresetName;
    private String routerName;
    private String customerName;
    private String primaryOutsideConnections;
    private String secondaryOutsideConnections;
    private String insideConnections;
    private Short numberOfEthernetPorts;
    private Short numberOfSerialPorts;
    private String vlans;
    private Boolean dhcp;
}
