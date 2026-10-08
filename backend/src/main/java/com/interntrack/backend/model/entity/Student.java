package com.interntrack.backend.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Student extends BaseEntity {
    @Id
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private User user;
    
    private String rollNumber;
    private String college;
    private String department;
    private Integer graduationYear;
    private Double cgpa;
    
    @Column(columnDefinition = "TEXT")
    private String skills; 
    
    private String resumeLink;
    private String avatarUrl;
    
    private String phone; // Added
}
