package com.interntrack.backend.controller;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.response.VerificationResultDto;
import com.interntrack.backend.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/certificates")
@RequiredArgsConstructor
public class PublicCertificateController {
    private final CertificateService certificateService;

    @GetMapping("/verify/{code}")
    public ResponseEntity<ApiResponse<VerificationResultDto>> verifyCertificate(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.success(certificateService.verifyCertificate(code), "Verified"));
    }
}
