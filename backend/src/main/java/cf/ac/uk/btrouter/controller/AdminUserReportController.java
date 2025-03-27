package cf.ac.uk.btrouter.controller;

import cf.ac.uk.btrouter.model.UserReport;
import cf.ac.uk.btrouter.repository.UserReportRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/user-reports")
@CrossOrigin
public class AdminUserReportController {

    private final UserReportRepository userReportRepository;

    public AdminUserReportController(UserReportRepository userReportRepository) {
        this.userReportRepository = userReportRepository;
    }

    // Get all reports
    @GetMapping
    public ResponseEntity<List<UserReport>> getAllReports() {
        return ResponseEntity.ok(userReportRepository.findAll());
    }

    @GetMapping("/{reportReference}")
    public ResponseEntity<?> getReportByReference(@PathVariable String reportReference) {
        return userReportRepository.findByReportReference(reportReference)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Report not found")));
    }
    

    // Update status (approved, pending, declined)
    @PutMapping("/{reportReference}/status")
    public ResponseEntity<?> updateReportStatus(
            @PathVariable String reportReference,
            @RequestBody Map<String, String> body) {

        String newStatus = body.get("status");

        Optional<UserReport> optionalReport = userReportRepository.findByReportReference(reportReference);
        if (optionalReport.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Report not found"));
        }

        UserReport report = optionalReport.get();
        report.setStatus(newStatus);
        userReportRepository.save(report);

        return ResponseEntity.ok(Map.of("message", "Status updated to " + newStatus));
    }
}
