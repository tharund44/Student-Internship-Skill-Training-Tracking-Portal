package com.interntrack.backend.payload.response;
import com.interntrack.backend.model.enums.TrainingStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class TrainingDto {
    private Long id;
    private String title;
    private String description;
    private String requirements;
    private String modulesSyllabus;
    private Integer durationWeeks;
    private Integer seats;
    private LocalDate startDate;
    private LocalDate endDate;
    private TrainingStatus status;
    private OrganizationDto provider;
    private Integer enrolledCount;
}
