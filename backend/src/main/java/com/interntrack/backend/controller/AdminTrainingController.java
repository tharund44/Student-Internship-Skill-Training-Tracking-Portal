package com.interntrack.backend.controller;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.request.TrainingCreateDto;
import com.interntrack.backend.payload.response.TrainingDto;
import com.interntrack.backend.service.TrainingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/trainings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminTrainingController {
    private final TrainingService trainingService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TrainingDto>>> getAllTrainings(@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.getAllTrainings(PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdAt"))), "Fetched"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TrainingDto>> updateTrainingStatus(@PathVariable Long id, @RequestBody TrainingCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.updateTraining(id, null, dto, true), "Updated"));
    }
}
