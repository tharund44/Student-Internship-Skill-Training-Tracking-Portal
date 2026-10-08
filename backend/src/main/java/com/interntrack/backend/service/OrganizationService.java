package com.interntrack.backend.service;
import com.interntrack.backend.model.entity.Organization;
import com.interntrack.backend.model.enums.OrganizationStatus;
import com.interntrack.backend.payload.response.OrganizationDto;
import com.interntrack.backend.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrganizationService {
    private final OrganizationRepository orgRepository;
    
    public Page<OrganizationDto> getAllOrganizations(Pageable pageable) {
        return orgRepository.findAll(pageable).map(this::mapToDto);
    }
    
    @Transactional
    public void updateStatus(Long id, OrganizationStatus status) {
        Organization org = orgRepository.findById(id).orElseThrow();
        org.setStatus(status);
        if(status == OrganizationStatus.APPROVED) org.getUser().setActive(true);
        if(status == OrganizationStatus.REJECTED) org.getUser().setActive(false);
        orgRepository.save(org);
    }
    
    private OrganizationDto mapToDto(Organization o) {
        return OrganizationDto.builder()
                .id(o.getId()).companyName(o.getCompanyName()).description(o.getDescription())
                .website(o.getWebsite()).logoUrl(o.getLogoUrl()).status(o.getStatus())
                .email(o.getUser().getEmail()).build();
    }
}
