package com.interntrack.backend.payload.response;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class VerificationResultDto {
    private boolean valid;
    private String message;
    private String studentName;
    private String programTitle;
    private String companyName;
    private LocalDate issueDate;
}
