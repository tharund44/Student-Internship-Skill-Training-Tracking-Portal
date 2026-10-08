package com.interntrack.backend.payload.response;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class HistoryItemDto {
    private Long id;
    private String type; // "INTERNSHIP" or "TRAINING"
    private String title;
    private String organizationName;
    private String status;
    private LocalDateTime date;
}
