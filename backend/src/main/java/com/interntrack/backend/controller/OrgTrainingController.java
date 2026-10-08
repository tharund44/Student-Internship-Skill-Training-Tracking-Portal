package com.interntrack.backend.controller;
import com.interntrack.backend.model.entity.User;
import com.interntrack.backend.model.enums.EnrollmentStatus;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.request.TrainingCreateDto;
import com.interntrack.backend.payload.response.EnrollmentDto;
import com.interntrack.backend.payload.response.TrainingDto;
import com.interntrack.backend.service.TrainingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/org/trainings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ORGANIZATION')")
public class OrgTrainingController {
    private final TrainingService trainingService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TrainingDto>>> getMyTrainings(@AuthenticationPrincipal User user, @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.getOrgTrainings(user.getId(), PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdAt"))), "Fetched"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TrainingDto>> createTraining(@AuthenticationPrincipal User user, @RequestBody TrainingCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.createTraining(user.getId(), dto), "Created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TrainingDto>> updateTraining(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestBody TrainingCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.updateTraining(id, user.getId(), dto, false), "Updated"));
    }

    @GetMapping("/{id}/enrollments")
    public ResponseEntity<ApiResponse<List<EnrollmentDto>>> getEnrollments(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.getTrainingEnrollments(id, user.getId(), false), "Fetched"));
    }
    
    @PutMapping("/enrollments/{enrollmentId}/status")
    public ResponseEntity<ApiResponse<Void>> updateEnrollmentStatus(@PathVariable Long enrollmentId, @RequestParam EnrollmentStatus status) {
        trainingService.updateEnrollmentStatus(enrollmentId, status);
        return ResponseEntity.ok(ApiResponse.success(null, "Updated"));
    }
}
