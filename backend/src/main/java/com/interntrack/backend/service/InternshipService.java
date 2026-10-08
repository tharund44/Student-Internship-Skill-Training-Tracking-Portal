package com.interntrack.backend.service;
import com.interntrack.backend.model.entity.*;
import com.interntrack.backend.model.enums.*;
import com.interntrack.backend.payload.request.InternshipCreateDto;
import com.interntrack.backend.payload.response.InternshipDto;
import com.interntrack.backend.payload.response.OrganizationDto;
import com.interntrack.backend.repository.InternshipRepository;
import com.interntrack.backend.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class InternshipService {
    private final InternshipRepository internshipRepository;
    private final OrganizationRepository orgRepository;

    public Page<InternshipDto> getPublicInternships(String search, WorkMode mode, String skill, Pageable pageable) {
        return internshipRepository.findPublicInternships(search, mode, skill, pageable).map(this::mapToDto);
    }

    public InternshipDto getInternship(Long id) {
        return mapToDto(internshipRepository.findById(id).orElseThrow(() -> new RuntimeException("Internship not found")));
    }

    public Page<InternshipDto> getOrgInternships(Long orgId, Pageable pageable) {
        return internshipRepository.findByOrganizationId(orgId, pageable).map(this::mapToDto);
    }

    public Page<InternshipDto> getAllInternships(Pageable pageable) {
        return internshipRepository.findAll(pageable).map(this::mapToDto);
    }

    @Transactional
    public InternshipDto createInternship(Long orgId, InternshipCreateDto dto) {
        Organization org = orgRepository.findById(orgId).orElseThrow(() -> new RuntimeException("Org not found"));
        Internship internship = Internship.builder()
                .organization(org)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .requirements(dto.getRequirements())
                .skills(dto.getSkills())
                .durationWeeks(dto.getDurationWeeks())
                .stipend(dto.getStipend())
                .location(dto.getLocation())
                .mode(dto.getMode())
                .deadline(dto.getDeadline())
                .openings(dto.getOpenings())
                .status(dto.getStatus())
                .build();
        return mapToDto(internshipRepository.save(internship));
    }

    @Transactional
    public InternshipDto updateInternship(Long internshipId, Long orgId, InternshipCreateDto dto, boolean isAdmin) {
        Internship internship = internshipRepository.findById(internshipId).orElseThrow(() -> new RuntimeException("Internship not found"));
        if (!isAdmin && !internship.getOrganization().getId().equals(orgId)) {
            throw new RuntimeException("Unauthorized to edit this internship");
        }
        
        internship.setTitle(dto.getTitle());
        internship.setDescription(dto.getDescription());
        internship.setRequirements(dto.getRequirements());
        internship.setSkills(dto.getSkills());
        internship.setDurationWeeks(dto.getDurationWeeks());
        internship.setStipend(dto.getStipend());
        internship.setLocation(dto.getLocation());
        internship.setMode(dto.getMode());
        internship.setDeadline(dto.getDeadline());
        internship.setOpenings(dto.getOpenings());
        if(dto.getStatus() != null) internship.setStatus(dto.getStatus());
        
        return mapToDto(internshipRepository.save(internship));
    }

    public void deleteInternship(Long id, Long orgId, boolean isAdmin) {
        Internship internship = internshipRepository.findById(id).orElseThrow();
        if (!isAdmin && !internship.getOrganization().getId().equals(orgId)) throw new RuntimeException("Unauthorized");
        internshipRepository.delete(internship);
    }

    private InternshipDto mapToDto(Internship i) {
        Organization o = i.getOrganization();
        OrganizationDto orgDto = OrganizationDto.builder()
                .id(o.getId()).companyName(o.getCompanyName()).description(o.getDescription())
                .website(o.getWebsite()).logoUrl(o.getLogoUrl()).status(o.getStatus()).email(o.getUser().getEmail()).build();
        
        return InternshipDto.builder()
                .id(i.getId()).title(i.getTitle()).description(i.getDescription()).requirements(i.getRequirements())
                .skills(i.getSkills()).durationWeeks(i.getDurationWeeks()).stipend(i.getStipend()).location(i.getLocation())
                .mode(i.getMode()).deadline(i.getDeadline()).openings(i.getOpenings()).status(i.getStatus())
                .organization(orgDto)
                .createdAt(i.getCreatedAt() != null ? i.getCreatedAt().atZone(ZoneId.systemDefault()).toEpochSecond() * 1000 : 0)
                .build();
    }
}
