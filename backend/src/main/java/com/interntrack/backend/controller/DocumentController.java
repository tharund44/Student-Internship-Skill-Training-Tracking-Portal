package com.interntrack.backend.controller;
import com.interntrack.backend.model.entity.Document;
import com.interntrack.backend.model.entity.User;
import com.interntrack.backend.model.enums.DocumentType;
import com.interntrack.backend.model.enums.ReferenceType;
import com.interntrack.backend.payload.ApiResponse;
import com.interntrack.backend.payload.request.DocumentStatusUpdateDto;
import com.interntrack.backend.payload.response.DocumentDto;
import com.interntrack.backend.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DocumentDto>> upload(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") DocumentType type,
            @RequestParam(value = "refType", required = false) ReferenceType refType,
            @RequestParam(value = "refId", required = false) Long refId) {
        return ResponseEntity.ok(ApiResponse.success(documentService.uploadDocument(user.getId(), file, type, refType, refId), "Uploaded"));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@AuthenticationPrincipal User user, @PathVariable Long id) {
        boolean isAdmin = user.getRole().equals(com.interntrack.backend.model.enums.Role.ADMIN);
        boolean isOrg = user.getRole().equals(com.interntrack.backend.model.enums.Role.ORGANIZATION);
        Resource file = documentService.downloadDocument(id, user.getId(), isAdmin, isOrg);
        Document rawDoc = documentService.getRawDocument(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + rawDoc.getOriginalFilename() + "\"")
                .contentType(MediaType.parseMediaType(rawDoc.getMimeType()))
                .body(file);
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getMyDocuments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(documentService.getStudentDocuments(user.getId()), "Fetched"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getAllDocuments() {
        return ResponseEntity.ok(ApiResponse.success(documentService.getAllDocuments(), "Fetched"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<DocumentDto>> updateStatus(@PathVariable Long id, @RequestBody DocumentStatusUpdateDto dto) {
        return ResponseEntity.ok(ApiResponse.success(documentService.updateStatus(id, dto), "Updated"));
    }
}
