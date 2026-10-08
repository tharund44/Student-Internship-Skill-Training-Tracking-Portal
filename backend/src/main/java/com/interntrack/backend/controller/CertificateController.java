package com.interntrack.backend.controller;
import com.interntrack.backend.model.entity.Certificate;
import com.interntrack.backend.model.entity.User;
import com.interntrack.backend.model.enums.ReferenceType;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.response.CertificateDto;
import com.interntrack.backend.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {
    private final CertificateService certificateService;

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<CertificateDto>>> getMyCertificates(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(certificateService.getMyCertificates(user.getId()), "Fetched"));
    }

    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@AuthenticationPrincipal User user, @PathVariable Long id) {
        boolean isAdmin = user.getRole() == com.interntrack.backend.model.enums.Role.ADMIN;
        byte[] pdfBytes = certificateService.downloadPdf(id, user.getId(), isAdmin);
        Certificate c = certificateService.getRawCertificate(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"certificate_" + c.getVerificationCode() + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @PreAuthorize("hasRole('ORGANIZATION') or hasRole('ADMIN')")
    @PostMapping("/issue")
    public ResponseEntity<ApiResponse<CertificateDto>> issueCertificate(
            @RequestParam ReferenceType type,
            @RequestParam Long referenceId) {
        return ResponseEntity.ok(ApiResponse.success(certificateService.issueCertificate(type, referenceId), "Issued"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CertificateDto>>> getAllCertificates() {
        return ResponseEntity.ok(ApiResponse.success(certificateService.getAllCertificates(), "Fetched"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/revoke")
    public ResponseEntity<ApiResponse<CertificateDto>> revokeCertificate(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(certificateService.revokeCertificate(id, body.get("remarks")), "Revoked"));
    }
}
