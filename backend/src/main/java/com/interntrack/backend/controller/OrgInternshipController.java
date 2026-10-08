package com.interntrack.backend.controller;
import com.interntrack.backend.model.entity.User;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.request.InternshipCreateDto;
import com.interntrack.backend.payload.response.InternshipDto;
import com.interntrack.backend.service.InternshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/org/internships")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ORGANIZATION')")
public class OrgInternshipController {
    private final InternshipService internshipService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<InternshipDto>>> getMyInternships(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
            internshipService.getOrgInternships(user.getId(), PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))),
            "Org internships fetched"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InternshipDto>> createInternship(
            @AuthenticationPrincipal User user,
            @RequestBody InternshipCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(internshipService.createInternship(user.getId(), dto), "Created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InternshipDto>> updateInternship(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody InternshipCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(internshipService.updateInternship(id, user.getId(), dto, false), "Updated"));
    }
}
