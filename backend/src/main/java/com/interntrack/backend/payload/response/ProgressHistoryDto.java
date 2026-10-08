package com.interntrack.backend.payload.response;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ProgressHistoryDto {
    private Integer oldPercentage;
    private Integer newPercentage;
    private String stage;
    private String remarks;
    private String updatedBy;
    private LocalDateTime timestamp;
}
