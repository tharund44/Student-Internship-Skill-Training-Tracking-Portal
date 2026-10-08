package com.interntrack.backend.model.entity;
import com.interntrack.backend.model.enums.DocumentStatus;
import com.interntrack.backend.model.enums.DocumentType;
import com.interntrack.backend.model.enums.ReferenceType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "documents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Document extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner; // Using User to allow orgs to upload too if needed
    
    @Enumerated(EnumType.STRING)
    private ReferenceType referenceType; // INTERNSHIP or TRAINING (optional)
    
    private Long referenceId; // The ID of the application/enrollment (optional)
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType documentType;
    
    @Column(nullable = false)
    private String originalFilename;
    
    @Column(nullable = false, unique = true)
    private String storedFilename;
    
    @Column(nullable = false)
    private String mimeType;
    
    private Long fileSize;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus status;
    
    private String remarks;
}
