package com.interntrack.backend.payload.request;
import lombok.Data;
@Data
public class ProgressUpdateDto {
    private Integer percentage;
    private String currentStage;
    private String remarks;
}
