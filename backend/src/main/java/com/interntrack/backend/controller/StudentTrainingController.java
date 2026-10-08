package com.interntrack.backend.controller;
import com.interntrack.backend.model.entity.User;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.response.EnrollmentDto;
import com.interntrack.backend.service.TrainingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/student/trainings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudentTrainingController {
    private final TrainingService trainingService;

    @PostMapping("/{id}/enroll")
    public ResponseEntity<ApiResponse<EnrollmentDto>> enroll(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.enroll(user.getId(), id), "Enrolled"));
    }

    @PutMapping("/enrollments/{enrollmentId}/unenroll")
    public ResponseEntity<ApiResponse<Void>> unenroll(@AuthenticationPrincipal User user, @PathVariable Long enrollmentId) {
        trainingService.unenroll(user.getId(), enrollmentId);
        return ResponseEntity.ok(ApiResponse.success(null, "Unenrolled"));
    }

    @GetMapping("/enrollments")
    public ResponseEntity<ApiResponse<List<EnrollmentDto>>> getMyEnrollments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.getStudentEnrollments(user.getId()), "Fetched"));
    }
}
