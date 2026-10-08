package com.interntrack.backend.payload.response;
import com.interntrack.backend.model.enums.OrganizationStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrganizationDto {
    private Long id;
    private String companyName;
    private String description;
    private String website;
    private String logoUrl;
    private OrganizationStatus status;
    private String email;
}
