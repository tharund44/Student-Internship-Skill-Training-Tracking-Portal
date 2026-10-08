package com.interntrack.backend.controller;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.response.StudentProfileDto;
import com.interntrack.backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStudentController {
    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<StudentProfileDto>>> getStudents(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<StudentProfileDto> students = studentService.searchStudents(search, PageRequest.of(page, size, Sort.by("user.name")));
        return ResponseEntity.ok(ApiResponse.success(students, "Students fetched"));
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Void>> toggleStatus(@PathVariable Long id) {
        studentService.toggleStatus(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Student status toggled"));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getStudent(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getProfile(id), "Student fetched"));
    }
}
