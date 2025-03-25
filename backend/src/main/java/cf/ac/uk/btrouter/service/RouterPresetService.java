package cf.ac.uk.btrouter.service;

import cf.ac.uk.btrouter.model.RouterPreset;
import cf.ac.uk.btrouter.repository.RouterPresetRepository;
import cf.ac.uk.btrouter.dto.RouterPresetDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RouterPresetService {
    private final RouterPresetRepository routerPresetRepository;

    /* CRUD Operations. */
    public RouterPresetService(RouterPresetRepository routerPresetRepository) { this.routerPresetRepository = routerPresetRepository; }
    public List<RouterPreset> getAllRouterPresets() { return routerPresetRepository.findAll(); }
    public Optional<RouterPreset> getRouterPresetById(Long routerPresetID) { return routerPresetRepository.findById(routerPresetID); }
    public RouterPreset saveRouterPreset(RouterPreset routerPreset) { return routerPresetRepository.save(routerPreset); }
    public void deleteRouterPreset(Long routerPresetID) { routerPresetRepository.deleteById(routerPresetID); }

    /* Custom Operations. */
    public List<RouterPresetDTO> getRouterPresetsByCustomerId(Long customerId) {
        List<RouterPreset> presets = routerPresetRepository.findByCustomer_CustomerID(customerId);

        return presets.stream()
            .map(p -> new RouterPresetDTO(
                p.getRouterPresetID(),
                p.getRouterPresetName(),
                p.getRouter().getRouterName(),
                p.getCustomer() != null ? p.getCustomer().getCustomerName() : "Unknown",
                p.getPrimaryOutsideConnections(),
                p.getSecondaryOutsideConnections(),
                p.getInsideConnections().toString(),
                p.getNumberOfEthernetPorts(),
                p.getNumberOfSerialPorts(),
                p.getVlans().toString(),
                p.getDhcp()
            ))
            .toList();
    }
}
