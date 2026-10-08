package com.interntrack.backend.payload.response;
import com.interntrack.backend.model.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ApplicationResponseDto {
    private Long id;
    private Long internshipId;
    private String internshipTitle;
    private String companyName;
    private Long studentId;
    private String studentName;
    private String studentCollege;
    private Double studentCgpa;
    private String coverNote;
    private String resumeLink;
    private ApplicationStatus status;
    private String remarks;
    private LocalDateTime appliedAt;
    private List<ApplicationHistoryDto> history;
}
