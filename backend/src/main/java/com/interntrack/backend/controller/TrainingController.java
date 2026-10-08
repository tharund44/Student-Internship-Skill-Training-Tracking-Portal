package com.interntrack.backend.controller;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.response.TrainingDto;
import com.interntrack.backend.service.TrainingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trainings")
@RequiredArgsConstructor
public class TrainingController {
    private final TrainingService trainingService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TrainingDto>>> getPublicTrainings(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
            trainingService.getPublicTrainings(search, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))), "Fetched"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TrainingDto>> getTraining(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(trainingService.getTraining(id), "Fetched"));
    }
}
