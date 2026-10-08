package com.interntrack.backend.payload.response;
import com.interntrack.backend.model.enums.ReferenceType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProgressTrackerDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long orgId;
    private String companyName;
    private ReferenceType referenceType;
    private Long referenceId;
    private String title;
    private Integer percentage;
    private String currentStage;
    private String remarks;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean certificateEligible;
    private LocalDateTime lastUpdatedAt;
    private List<ProgressHistoryDto> history;
}
