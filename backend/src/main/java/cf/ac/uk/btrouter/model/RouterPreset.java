package cf.ac.uk.btrouter.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "RouterPresets")
public class RouterPreset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    // Define other fields for RouterPreset as necessary.
}
