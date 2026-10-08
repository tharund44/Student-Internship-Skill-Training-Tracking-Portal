package com.interntrack.backend.controller;
import com.interntrack.backend.model.enums.OrganizationStatus;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.request.InternshipCreateDto;
import com.interntrack.backend.payload.response.InternshipDto;
import com.interntrack.backend.payload.response.OrganizationDto;
import com.interntrack.backend.service.InternshipService;
import com.interntrack.backend.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminManagementController {
    private final InternshipService internshipService;
    private final OrganizationService orgService;

    @GetMapping("/organizations")
    public ResponseEntity<ApiResponse<Page<OrganizationDto>>> getOrgs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(orgService.getAllOrganizations(PageRequest.of(page, size)), "Orgs fetched"));
    }

    @PutMapping("/organizations/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updateOrgStatus(@PathVariable Long id, @RequestParam OrganizationStatus status) {
        orgService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(null, "Status updated"));
    }

    @GetMapping("/internships")
    public ResponseEntity<ApiResponse<Page<InternshipDto>>> getInternships(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(internshipService.getAllInternships(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))), "Fetched"));
    }

    @PutMapping("/internships/{id}")
    public ResponseEntity<ApiResponse<InternshipDto>> updateInternshipStatus(@PathVariable Long id, @RequestBody InternshipCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(internshipService.updateInternship(id, null, dto, true), "Updated"));
    }
}
