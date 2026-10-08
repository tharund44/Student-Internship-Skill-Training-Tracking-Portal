package com.interntrack.backend.payload.request;
import lombok.Data;
@Data
public class ApplicationCreateDto {
    private String coverNote;
    private String resumeLink; // optional, defaults to profile resume
}
