package com.interntrack.backend.service;
import com.interntrack.backend.model.entity.*;
import com.interntrack.backend.model.enums.*;
import com.interntrack.backend.payload.request.ApplicationCreateDto;
import com.interntrack.backend.payload.request.StatusUpdateDto;
import com.interntrack.backend.payload.response.ApplicationHistoryDto;
import com.interntrack.backend.payload.response.ApplicationResponseDto;
import com.interntrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final ApplicationHistoryRepository historyRepository;
    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;
    private final UserRepository userRepository;

    @Transactional
    public ApplicationResponseDto apply(Long studentId, Long internshipId, ApplicationCreateDto dto) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        Internship internship = internshipRepository.findById(internshipId).orElseThrow();

        if (internship.getDeadline() != null && internship.getDeadline().isBefore(LocalDate.now())) {
            throw new RuntimeException("Internship application deadline has passed.");
        }
        if (applicationRepository.existsByStudentIdAndInternshipId(studentId, internshipId)) {
            throw new RuntimeException("You have already applied to this internship.");
        }
        if (student.getResumeLink() == null || student.getCgpa() == null) {
            throw new RuntimeException("Profile incomplete. Please add CGPA and Resume Link to apply.");
        }

        Application application = Application.builder()
                .student(student)
                .internship(internship)
                .coverNote(dto.getCoverNote())
                .resumeLink(dto.getResumeLink() != null ? dto.getResumeLink() : student.getResumeLink())
                .status(ApplicationStatus.APPLIED)
                .build();
        application = applicationRepository.save(application);

        logHistory(application, null, ApplicationStatus.APPLIED, student.getUser(), "Initial application");
        return mapToDto(application, false);
    }

    @Transactional
    public void withdraw(Long studentId, Long applicationId) {
        Application application = applicationRepository.findById(applicationId).orElseThrow();
        if (!application.getStudent().getId().equals(studentId)) throw new RuntimeException("Unauthorized");
        
        if (application.getStatus() != ApplicationStatus.APPLIED && application.getStatus() != ApplicationStatus.UNDER_REVIEW) {
            throw new RuntimeException("Cannot withdraw at this stage.");
        }
        updateStatusCore(application, ApplicationStatus.WITHDRAWN, application.getStudent().getUser(), "Student withdrew application.");
    }

    @Transactional
    public ApplicationResponseDto updateStatus(Long applicationId, Long userId, StatusUpdateDto dto, boolean isAdmin) {
        Application application = applicationRepository.findById(applicationId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        
        if (!isAdmin && !application.getInternship().getOrganization().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to change status of this application");
        }

        validateTransition(application.getStatus(), dto.getStatus(), isAdmin);
        updateStatusCore(application, dto.getStatus(), user, dto.getRemarks());
        return mapToDto(application, false);
    }

    private void updateStatusCore(Application application, ApplicationStatus newStatus, User user, String remarks) {
        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(newStatus);
        application.setRemarks(remarks);
        application = applicationRepository.save(application);
        logHistory(application, oldStatus, newStatus, user, remarks);
    }

    private void validateTransition(ApplicationStatus current, ApplicationStatus next, boolean isAdmin) {
        if (isAdmin) return; // Admin can override
        boolean valid = switch (current) {
            case APPLIED -> next == ApplicationStatus.UNDER_REVIEW || next == ApplicationStatus.REJECTED;
            case UNDER_REVIEW -> next == ApplicationStatus.SELECTED || next == ApplicationStatus.REJECTED;
            case SELECTED -> next == ApplicationStatus.ONGOING || next == ApplicationStatus.REJECTED;
            case ONGOING -> next == ApplicationStatus.COMPLETED;
            default -> false;
        };
        if (!valid) throw new RuntimeException("Invalid status transition from " + current + " to " + next);
    }

    private void logHistory(Application app, ApplicationStatus oldStatus, ApplicationStatus newStatus, User user, String remarks) {
        ApplicationHistory history = ApplicationHistory.builder()
                .application(app).oldStatus(oldStatus).newStatus(newStatus).changedBy(user).remarks(remarks).build();
        historyRepository.save(history);
    }

    public List<ApplicationResponseDto> getMyApplications(Long studentId) {
        return applicationRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .map(a -> mapToDto(a, true)).collect(Collectors.toList());
    }

    public List<ApplicationResponseDto> getInternshipApplications(Long internshipId, Long orgId, boolean isAdmin) {
        Internship internship = internshipRepository.findById(internshipId).orElseThrow();
        if (!isAdmin && !internship.getOrganization().getId().equals(orgId)) throw new RuntimeException("Unauthorized");
        
        return applicationRepository.findByInternshipIdOrderByCreatedAtDesc(internshipId).stream()
                .map(a -> mapToDto(a, true)).collect(Collectors.toList());
    }
    
    public List<ApplicationResponseDto> getAllApplications() {
        return applicationRepository.findAll().stream().map(a -> mapToDto(a, false)).collect(Collectors.toList());
    }

    private ApplicationResponseDto mapToDto(Application a, boolean includeHistory) {
        List<ApplicationHistoryDto> history = includeHistory ? 
            historyRepository.findByApplicationIdOrderByCreatedAtDesc(a.getId()).stream()
                .map(h -> ApplicationHistoryDto.builder()
                    .id(h.getId()).oldStatus(h.getOldStatus()).newStatus(h.getNewStatus())
                    .changedBy(h.getChangedBy().getName()).remarks(h.getRemarks()).timestamp(h.getCreatedAt()).build())
                .collect(Collectors.toList()) : null;

        return ApplicationResponseDto.builder()
                .id(a.getId()).internshipId(a.getInternship().getId()).internshipTitle(a.getInternship().getTitle())
                .companyName(a.getInternship().getOrganization().getCompanyName())
                .studentId(a.getStudent().getId()).studentName(a.getStudent().getUser().getName())
                .studentCollege(a.getStudent().getCollege()).studentCgpa(a.getStudent().getCgpa())
                .coverNote(a.getCoverNote()).resumeLink(a.getResumeLink()).status(a.getStatus())
                .remarks(a.getRemarks()).appliedAt(a.getCreatedAt()).history(history).build();
    }
}
