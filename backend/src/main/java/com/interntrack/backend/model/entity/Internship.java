package com.interntrack.backend.model.entity;
import com.interntrack.backend.model.enums.InternshipStatus;
import com.interntrack.backend.model.enums.WorkMode;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "internships")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Internship extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(columnDefinition = "TEXT")
    private String requirements;
    
    private String skills; // comma-separated
    private Integer durationWeeks;
    private String stipend;
    private String location;
    
    @Enumerated(EnumType.STRING)
    private WorkMode mode;
    
    private LocalDate deadline;
    private Integer openings;
    
    @Enumerated(EnumType.STRING)
    private InternshipStatus status;
}
