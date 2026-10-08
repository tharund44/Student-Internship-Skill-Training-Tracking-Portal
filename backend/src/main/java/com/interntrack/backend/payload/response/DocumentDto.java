package com.interntrack.backend.payload.response;
import com.interntrack.backend.model.enums.DocumentStatus;
import com.interntrack.backend.model.enums.DocumentType;
import com.interntrack.backend.model.enums.ReferenceType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DocumentDto {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private ReferenceType referenceType;
    private Long referenceId;
    private DocumentType documentType;
    private String originalFilename;
    private String mimeType;
    private Long fileSize;
    private DocumentStatus status;
    private String remarks;
    private LocalDateTime uploadedAt;
}
