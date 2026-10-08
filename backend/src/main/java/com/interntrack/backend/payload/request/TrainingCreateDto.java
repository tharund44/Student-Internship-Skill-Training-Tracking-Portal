package com.interntrack.backend.payload.request;
import com.interntrack.backend.model.enums.TrainingStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TrainingCreateDto {
    private String title;
    private String description;
    private String requirements;
    private String modulesSyllabus;
    private Integer durationWeeks;
    private Integer seats;
    private LocalDate startDate;
    private LocalDate endDate;
    private TrainingStatus status;
}
