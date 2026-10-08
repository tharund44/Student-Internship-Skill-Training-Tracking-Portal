package com.interntrack.backend.payload.response;
import com.interntrack.backend.model.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ApplicationHistoryDto {
    private Long id;
    private ApplicationStatus oldStatus;
    private ApplicationStatus newStatus;
    private String changedBy;
    private String remarks;
    private LocalDateTime timestamp;
}
