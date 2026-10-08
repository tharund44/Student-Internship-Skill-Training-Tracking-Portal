package com.interntrack.backend.payload.request;
import com.interntrack.backend.model.enums.InternshipStatus;
import com.interntrack.backend.model.enums.WorkMode;
import lombok.Data;
import java.time.LocalDate;

@Data
public class InternshipCreateDto {
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
}
