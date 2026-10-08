package com.interntrack.backend.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "progress_histories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProgressHistory extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "progress_tracker_id", nullable = false)
    private ProgressTracker progressTracker;
    
    private Integer oldPercentage;
    private Integer newPercentage;
    
    private String stage;
    private String remarks;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by_id", nullable = false)
    private User updatedBy;
}
