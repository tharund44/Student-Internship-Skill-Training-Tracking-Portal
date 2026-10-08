package com.interntrack.backend.controller;
import com.interntrack.backend.model.entity.User;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.request.StatusUpdateDto;
import com.interntrack.backend.payload.response.ApplicationResponseDto;
import com.interntrack.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/org/internships/{internshipId}/applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ORGANIZATION')")
public class OrgApplicationController {
    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApplicationResponseDto>>> getApplications(
            @AuthenticationPrincipal User user,
            @PathVariable Long internshipId) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getInternshipApplications(internshipId, user.getId(), false), "Fetched"));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> updateStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Long internshipId, // Path validation can be added
            @PathVariable Long applicationId,
            @RequestBody StatusUpdateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.updateStatus(applicationId, user.getId(), dto, false), "Updated"));
    }
}
