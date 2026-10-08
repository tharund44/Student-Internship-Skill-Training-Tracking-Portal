package com.interntrack.backend.payload.response;
import com.interntrack.backend.model.enums.InternshipStatus;
import com.interntrack.backend.model.enums.WorkMode;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class InternshipDto {
    private Long id;
    private String title;
    private String description;
    private String requirements;
    private String skills;
    private Integer durationWeeks;
    private String stipend;
    private String location;
    private WorkMode mode;
    private LocalDate deadline;
    private Integer openings;
    private InternshipStatus status;
    private OrganizationDto organization;
    private Long createdAt; // Unix timestamp
}
