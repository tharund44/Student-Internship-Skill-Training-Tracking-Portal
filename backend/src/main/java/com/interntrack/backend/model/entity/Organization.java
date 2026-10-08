package com.interntrack.backend.model.entity;
import com.interntrack.backend.model.enums.OrganizationStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "organizations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Organization extends BaseEntity {
    @Id
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private User user;
    
    private String companyName;
    private String description;
    private String website;
    private String logoUrl;
    
    private String type; // "Company" or "Training Provider"
    private String contactPerson;
    private String phone;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OrganizationStatus status = OrganizationStatus.PENDING;
}
