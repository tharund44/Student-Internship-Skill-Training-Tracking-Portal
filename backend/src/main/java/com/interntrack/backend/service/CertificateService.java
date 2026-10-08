package com.interntrack.backend.service;
import com.interntrack.backend.model.entity.*;
import com.interntrack.backend.model.enums.*;
import com.interntrack.backend.payload.response.CertificateDto;
import com.interntrack.backend.payload.response.VerificationResultDto;
import com.interntrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {
    private final CertificateRepository certificateRepository;
    private final ApplicationRepository applicationRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PdfGenerationService pdfGenerationService;

    @Transactional
    public CertificateDto issueCertificate(ReferenceType type, Long referenceId) {
        if (certificateRepository.existsByReferenceTypeAndReferenceId(type, referenceId)) {
            throw new RuntimeException("Certificate already issued for this program.");
        }

        Student student;
        Organization org;
        String title;

        if (type == ReferenceType.INTERNSHIP) {
            Application app = applicationRepository.findById(referenceId).orElseThrow();
            if (app.getStatus() != ApplicationStatus.COMPLETED) throw new RuntimeException("Internship not completed.");
            student = app.getStudent();
            org = app.getInternship().getOrganization();
            title = app.getInternship().getTitle();
        } else {
            Enrollment e = enrollmentRepository.findById(referenceId).orElseThrow();
            if (e.getStatus() != EnrollmentStatus.COMPLETED) throw new RuntimeException("Training not completed.");
            student = e.getStudent();
            org = e.getTrainingProgram().getProvider();
            title = e.getTrainingProgram().getTitle();
        }

        String verificationCode = "CERT-" + UUID.randomUUID().toString().substring(0, 13).toUpperCase();

        Certificate certificate = Certificate.builder()
                .verificationCode(verificationCode).student(student).organization(org)
                .referenceType(type).referenceId(referenceId).programTitle(title)
                .issueDate(LocalDate.now()).status(CertificateStatus.ISSUED).build();

        return mapToDto(certificateRepository.save(certificate));
    }

    public List<CertificateDto> getMyCertificates(Long studentId) {
        return certificateRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<CertificateDto> getAllCertificates() {
        return certificateRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public CertificateDto revokeCertificate(Long id, String remarks) {
        Certificate c = certificateRepository.findById(id).orElseThrow();
        c.setStatus(CertificateStatus.REVOKED);
        c.setRemarks(remarks);
        return mapToDto(certificateRepository.save(c));
    }

    public VerificationResultDto verifyCertificate(String code) {
        return certificateRepository.findByVerificationCode(code)
            .map(c -> VerificationResultDto.builder()
                .valid(c.getStatus() == CertificateStatus.ISSUED)
                .message(c.getStatus() == CertificateStatus.ISSUED ? "Valid Certificate" : "Certificate has been REVOKED.")
                .studentName(c.getStudent().getUser().getName())
                .programTitle(c.getProgramTitle())
                .companyName(c.getOrganization().getCompanyName())
                .issueDate(c.getIssueDate()).build())
            .orElseGet(() -> VerificationResultDto.builder().valid(false).message("Invalid verification code.").build());
    }

    public byte[] downloadPdf(Long id, Long requesterId, boolean isAdmin) {
        Certificate c = certificateRepository.findById(id).orElseThrow();
        if (!isAdmin && !c.getStudent().getId().equals(requesterId)) {
            throw new RuntimeException("Unauthorized to download this certificate");
        }
        return pdfGenerationService.generateCertificatePdf(c);
    }
    
    public Certificate getRawCertificate(Long id) {
        return certificateRepository.findById(id).orElseThrow();
    }

    private CertificateDto mapToDto(Certificate c) {
        return CertificateDto.builder()
                .id(c.getId()).verificationCode(c.getVerificationCode())
                .studentId(c.getStudent().getId()).studentName(c.getStudent().getUser().getName())
                .companyName(c.getOrganization().getCompanyName()).referenceType(c.getReferenceType())
                .programTitle(c.getProgramTitle()).issueDate(c.getIssueDate()).status(c.getStatus()).build();
    }
}
