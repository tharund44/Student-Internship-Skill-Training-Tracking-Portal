package com.interntrack.backend.payload.response;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentProfileDto {
    private Long id;
    private String name;
    private String email;
    private String rollNumber;
    private String college;
    private String department;
    private Integer graduationYear;
    private Double cgpa;
    private String skills;
    private String resumeLink;
    private String avatarUrl;
    private boolean active;
}
