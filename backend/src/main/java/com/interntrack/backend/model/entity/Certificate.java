package com.interntrack.backend.model.entity;
import com.interntrack.backend.model.enums.CertificateStatus;
import com.interntrack.backend.model.enums.ReferenceType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "certificates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Certificate extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String verificationCode;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReferenceType referenceType;
    
    @Column(nullable = false)
    private Long referenceId;
    
    @Column(nullable = false)
    private String programTitle;
    
    private LocalDate issueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CertificateStatus status;
    
    private String remarks; // Reason for revocation, etc.
}
