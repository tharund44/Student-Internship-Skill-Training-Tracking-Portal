package com.interntrack.backend.controller;
import com.interntrack.backend.model.enums.WorkMode;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.response.InternshipDto;
import com.interntrack.backend.service.InternshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
public class InternshipController {
    private final InternshipService internshipService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<InternshipDto>>> getPublicInternships(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) WorkMode mode,
            @RequestParam(required = false) String skill,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
            internshipService.getPublicInternships(search, mode, skill, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))),
            "Internships fetched"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InternshipDto>> getInternship(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(internshipService.getInternship(id), "Internship fetched"));
    }
}
