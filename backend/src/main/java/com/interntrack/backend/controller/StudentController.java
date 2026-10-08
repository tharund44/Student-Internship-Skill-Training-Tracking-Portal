package com.interntrack.backend.controller;
import com.interntrack.backend.model.entity.User;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.request.StudentUpdateDto;
import com.interntrack.backend.payload.response.HistoryItemDto;
import com.interntrack.backend.payload.response.StudentProfileDto;
import com.interntrack.backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {
    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getProfile(user.getId()), "Profile fetched"));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody StudentUpdateDto request) {
        return ResponseEntity.ok(ApiResponse.success(studentService.updateProfile(user.getId(), request), "Profile updated"));
    }

    @GetMapping("/history/internships")
    public ResponseEntity<ApiResponse<List<HistoryItemDto>>> getInternshipHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getInternshipHistory(user.getId()), "Internship history"));
    }

    @GetMapping("/history/trainings")
    public ResponseEntity<ApiResponse<List<HistoryItemDto>>> getTrainingHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getTrainingHistory(user.getId()), "Training history"));
    }
}
