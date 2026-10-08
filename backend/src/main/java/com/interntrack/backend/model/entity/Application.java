package com.interntrack.backend.model.entity;
import com.interntrack.backend.model.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "applications", uniqueConstraints = {@UniqueConstraint(columnNames = {"student_id", "internship_id"})})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Application extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;
    
    @Column(columnDefinition = "TEXT")
    private String coverNote;
    
    private String resumeLink;
    
    @Column(columnDefinition = "TEXT")
    private String remarks; // For admin/org feedback
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;
}
