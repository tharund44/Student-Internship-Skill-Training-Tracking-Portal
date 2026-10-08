package com.interntrack.backend.controller;
import com.interntrack.backend.model.entity.User;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.request.ProgressUpdateDto;
import com.interntrack.backend.payload.response.ProgressTrackerDto;
import com.interntrack.backend.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProgressController {
    private final ProgressService progressService;

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/progress")
    public ResponseEntity<ApiResponse<List<ProgressTrackerDto>>> getStudentProgress(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(progressService.getStudentProgress(user.getId()), "Fetched"));
    }

    @PreAuthorize("hasRole('ORGANIZATION')")
    @GetMapping("/org/progress")
    public ResponseEntity<ApiResponse<List<ProgressTrackerDto>>> getOrgProgress(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(progressService.getOrgProgress(user.getId()), "Fetched"));
    }
    
    @PreAuthorize("hasRole('ORGANIZATION') or hasRole('ADMIN')")
    @GetMapping("/progress/{id}")
    public ResponseEntity<ApiResponse<ProgressTrackerDto>> getProgress(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(progressService.getProgress(id), "Fetched"));
    }

    @PreAuthorize("hasRole('ORGANIZATION') or hasRole('ADMIN')")
    @PutMapping("/progress/internship/{applicationId}")
    public ResponseEntity<ApiResponse<ProgressTrackerDto>> updateInternshipProgress(
            @AuthenticationPrincipal User user, @PathVariable Long applicationId, @RequestBody ProgressUpdateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(progressService.initOrUpdateApplicationProgress(applicationId, dto, user.getId()), "Updated"));
    }

    @PreAuthorize("hasRole('ORGANIZATION') or hasRole('ADMIN')")
    @PutMapping("/progress/training/{enrollmentId}")
    public ResponseEntity<ApiResponse<ProgressTrackerDto>> updateTrainingProgress(
            @AuthenticationPrincipal User user, @PathVariable Long enrollmentId, @RequestBody ProgressUpdateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(progressService.initOrUpdateEnrollmentProgress(enrollmentId, dto, user.getId()), "Updated"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/progress")
    public ResponseEntity<ApiResponse<List<ProgressTrackerDto>>> getAllProgress() {
        return ResponseEntity.ok(ApiResponse.success(progressService.getAllProgress(), "Fetched"));
    }
}
