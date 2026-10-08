package com.interntrack.backend.payload.response;
import com.interntrack.backend.model.enums.CertificateStatus;
import com.interntrack.backend.model.enums.ReferenceType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class CertificateDto {
    private Long id;
    private String verificationCode;
    private Long studentId;
    private String studentName;
    private String companyName;
    private ReferenceType referenceType;
    private String programTitle;
    private LocalDate issueDate;
    private CertificateStatus status;
}
