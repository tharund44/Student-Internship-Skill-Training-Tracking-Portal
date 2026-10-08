package com.interntrack.backend.model.entity;
import com.interntrack.backend.model.enums.ReferenceType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "progress_trackers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProgressTracker extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
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
    private Long referenceId; // ID of Application or Enrollment
    
    private String title; // Snapshot of Internship or Training title
    
    private Integer percentage; // 0 to 100
    private String currentStage;
    private String remarks;
    
    private LocalDate startDate;
    private LocalDate endDate;
    
    private Boolean certificateEligible;
}
