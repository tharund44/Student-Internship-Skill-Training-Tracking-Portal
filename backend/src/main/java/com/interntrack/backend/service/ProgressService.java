package com.interntrack.backend.service;
import com.interntrack.backend.model.entity.*;
import com.interntrack.backend.model.enums.*;
import com.interntrack.backend.payload.request.ProgressUpdateDto;
import com.interntrack.backend.payload.response.ProgressHistoryDto;
import com.interntrack.backend.payload.response.ProgressTrackerDto;
import com.interntrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {
    private final ProgressTrackerRepository progressRepository;
    private final ProgressHistoryRepository historyRepository;
    private final ApplicationRepository applicationRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProgressTrackerDto initOrUpdateApplicationProgress(Long applicationId, ProgressUpdateDto dto, Long updatedById) {
        Application app = applicationRepository.findById(applicationId).orElseThrow();
        ProgressTracker tracker = progressRepository.findByReferenceTypeAndReferenceId(ReferenceType.INTERNSHIP, applicationId)
            .orElseGet(() -> ProgressTracker.builder()
                .student(app.getStudent()).organization(app.getInternship().getOrganization())
                .referenceType(ReferenceType.INTERNSHIP).referenceId(applicationId).title(app.getInternship().getTitle())
                .percentage(0).startDate(LocalDate.now()).certificateEligible(false).build());
        return applyUpdate(tracker, dto, updatedById);
    }

    @Transactional
    public ProgressTrackerDto initOrUpdateEnrollmentProgress(Long enrollmentId, ProgressUpdateDto dto, Long updatedById) {
        Enrollment enroll = enrollmentRepository.findById(enrollmentId).orElseThrow();
        ProgressTracker tracker = progressRepository.findByReferenceTypeAndReferenceId(ReferenceType.TRAINING, enrollmentId)
            .orElseGet(() -> ProgressTracker.builder()
                .student(enroll.getStudent()).organization(enroll.getTrainingProgram().getProvider())
                .referenceType(ReferenceType.TRAINING).referenceId(enrollmentId).title(enroll.getTrainingProgram().getTitle())
                .percentage(0).startDate(LocalDate.now()).certificateEligible(false).build());
        return applyUpdate(tracker, dto, updatedById);
    }

    private ProgressTrackerDto applyUpdate(ProgressTracker tracker, ProgressUpdateDto dto, Long updatedById) {
        User user = userRepository.findById(updatedById).orElseThrow();
        Integer oldPct = tracker.getPercentage() != null ? tracker.getPercentage() : 0;
        
        tracker.setPercentage(dto.getPercentage());
        tracker.setCurrentStage(dto.getCurrentStage());
        tracker.setRemarks(dto.getRemarks());
        
        if (dto.getPercentage() != null && dto.getPercentage() >= 100) {
            tracker.setPercentage(100);
            tracker.setCertificateEligible(true);
            tracker.setEndDate(LocalDate.now());
            // Sync status
            if(tracker.getReferenceType() == ReferenceType.INTERNSHIP) {
                Application app = applicationRepository.findById(tracker.getReferenceId()).orElseThrow();
                app.setStatus(ApplicationStatus.COMPLETED);
                applicationRepository.save(app);
            } else {
                Enrollment e = enrollmentRepository.findById(tracker.getReferenceId()).orElseThrow();
                e.setStatus(EnrollmentStatus.COMPLETED);
                enrollmentRepository.save(e);
            }
        }
        
        tracker = progressRepository.save(tracker);
        
        ProgressHistory history = ProgressHistory.builder()
                .progressTracker(tracker).oldPercentage(oldPct).newPercentage(tracker.getPercentage())
                .stage(tracker.getCurrentStage()).remarks(tracker.getRemarks()).updatedBy(user).build();
        historyRepository.save(history);
        
        return mapToDto(tracker, true);
    }
    
    @Transactional
    public ProgressTrackerDto getProgress(Long progressId) {
        return mapToDto(progressRepository.findById(progressId).orElseThrow(), true);
    }

    public List<ProgressTrackerDto> getStudentProgress(Long studentId) {
        return progressRepository.findByStudentIdOrderByUpdatedAtDesc(studentId).stream()
                .map(t -> mapToDto(t, false)).collect(Collectors.toList());
    }

    public List<ProgressTrackerDto> getOrgProgress(Long orgId) {
        return progressRepository.findByOrganizationIdOrderByUpdatedAtDesc(orgId).stream()
                .map(t -> mapToDto(t, false)).collect(Collectors.toList());
    }

    public List<ProgressTrackerDto> getAllProgress() {
        return progressRepository.findAll().stream().map(t -> mapToDto(t, false)).collect(Collectors.toList());
    }

    private ProgressTrackerDto mapToDto(ProgressTracker t, boolean includeHistory) {
        List<ProgressHistoryDto> history = includeHistory ? historyRepository.findByProgressTrackerIdOrderByCreatedAtDesc(t.getId()).stream()
            .map(h -> ProgressHistoryDto.builder().oldPercentage(h.getOldPercentage()).newPercentage(h.getNewPercentage())
                .stage(h.getStage()).remarks(h.getRemarks()).updatedBy(h.getUpdatedBy().getName()).timestamp(h.getCreatedAt()).build())
            .collect(Collectors.toList()) : null;

        return ProgressTrackerDto.builder()
            .id(t.getId()).studentId(t.getStudent().getId()).studentName(t.getStudent().getUser().getName())
            .orgId(t.getOrganization().getId()).companyName(t.getOrganization().getCompanyName())
            .referenceType(t.getReferenceType()).referenceId(t.getReferenceId()).title(t.getTitle())
            .percentage(t.getPercentage()).currentStage(t.getCurrentStage()).remarks(t.getRemarks())
            .startDate(t.getStartDate()).endDate(t.getEndDate()).certificateEligible(t.getCertificateEligible())
            .lastUpdatedAt(t.getUpdatedAt()).history(history).build();
    }
}
