package com.interntrack.backend.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "progress_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Progress extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Can be tied to an Application (Internship) or Enrollment (Training)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    private Application application;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;
    
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Integer completionPercentage;
}
