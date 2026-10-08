package com.interntrack.backend.payload.request;
import com.interntrack.backend.model.enums.DocumentStatus;
import lombok.Data;

@Data
public class DocumentStatusUpdateDto {
    private DocumentStatus status;
    private String remarks;
}
