package com.interntrack.backend.payload.request;
import com.interntrack.backend.model.enums.ApplicationStatus;
import lombok.Data;
@Data
public class StatusUpdateDto {
    private ApplicationStatus status;
    private String remarks;
}
