package com.interntrack.backend.controller;
import com.interntrack.backend.model.entity.User;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.request.ApplicationCreateDto;
import com.interntrack.backend.payload.response.ApplicationResponseDto;
import com.interntrack.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/student/applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudentApplicationController {
    private final ApplicationService applicationService;

    @PostMapping("/{internshipId}")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> apply(
            @AuthenticationPrincipal User user,
            @PathVariable Long internshipId,
            @RequestBody ApplicationCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.apply(user.getId(), internshipId, dto), "Applied"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApplicationResponseDto>>> getMyApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getMyApplications(user.getId()), "Fetched"));
    }

    @PutMapping("/{applicationId}/withdraw")
    public ResponseEntity<ApiResponse<Void>> withdraw(@AuthenticationPrincipal User user, @PathVariable Long applicationId) {
        applicationService.withdraw(user.getId(), applicationId);
        return ResponseEntity.ok(ApiResponse.success(null, "Withdrawn"));
    }
}
