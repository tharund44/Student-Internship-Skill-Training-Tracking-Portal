package com.interntrack.backend.payload.response;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogDto {
    private Long id;
    private String action;
    private String entityName;
    private Long entityId;
    private String details;
    private String performedBy;
    private LocalDateTime timestamp;
}
