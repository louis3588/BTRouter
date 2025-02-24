package cf.ac.uk.btrouter.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import cf.ac.uk.btrouter.model.RouterRequest;
import cf.ac.uk.btrouter.repository.RouterRequestRepository;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/router-request")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class RouterRequestController {

    @Autowired
    private RouterRequestRepository repository;

    @PostMapping
    public ResponseEntity<?> createRouterRequest(@Valid @RequestBody RouterRequest request) {
        try {
            repository.save(request);
            return ResponseEntity.ok().body("{\"message\": \"Router request submitted successfully!\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Error saving request. Please try again.\"}");
        }
    }
}
