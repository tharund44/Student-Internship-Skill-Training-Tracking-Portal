package com.interntrack.backend.payload.response;
import com.interntrack.backend.model.enums.EnrollmentStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EnrollmentDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentCollege;
    private Long trainingId;
    private String trainingTitle;
    private String providerName;
    private EnrollmentStatus status;
    private LocalDateTime enrolledAt;
}
