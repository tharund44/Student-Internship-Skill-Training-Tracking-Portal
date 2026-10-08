package com.interntrack.backend.payload.request;
import lombok.Data;

@Data
public class StudentUpdateDto {
    private String name;
    private String college;
    private String department;
    private Integer graduationYear;
    private Double cgpa;
    private String skills;
    private String resumeLink;
    private String avatarUrl;
}
