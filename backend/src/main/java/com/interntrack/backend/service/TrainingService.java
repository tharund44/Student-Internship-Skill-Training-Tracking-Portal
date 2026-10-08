package com.interntrack.backend.service;
import com.interntrack.backend.model.entity.*;
import com.interntrack.backend.model.enums.*;
import com.interntrack.backend.payload.request.TrainingCreateDto;
import com.interntrack.backend.payload.response.EnrollmentDto;
import com.interntrack.backend.payload.response.OrganizationDto;
import com.interntrack.backend.payload.response.TrainingDto;
import com.interntrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingService {
    private final TrainingProgramRepository trainingRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final OrganizationRepository orgRepository;
    private final StudentRepository studentRepository;

    public Page<TrainingDto> getPublicTrainings(String search, Pageable pageable) {
        return trainingRepository.searchPublic(search, pageable).map(this::mapToDto);
    }

    public Page<TrainingDto> getAllTrainings(Pageable pageable) {
        return trainingRepository.findAll(pageable).map(this::mapToDto);
    }

    public Page<TrainingDto> getOrgTrainings(Long orgId, Pageable pageable) {
        return trainingRepository.findByProviderId(orgId, pageable).map(this::mapToDto);
    }

    public TrainingDto getTraining(Long id) {
        return mapToDto(trainingRepository.findById(id).orElseThrow(() -> new RuntimeException("Training not found")));
    }

    @Transactional
    public TrainingDto createTraining(Long orgId, TrainingCreateDto dto) {
        Organization provider = orgRepository.findById(orgId).orElseThrow();
        TrainingProgram tp = TrainingProgram.builder()
                .provider(provider).title(dto.getTitle()).description(dto.getDescription())
                .requirements(dto.getRequirements()).modulesSyllabus(dto.getModulesSyllabus())
                .durationWeeks(dto.getDurationWeeks()).seats(dto.getSeats())
                .startDate(dto.getStartDate()).endDate(dto.getEndDate()).status(dto.getStatus())
                .build();
        return mapToDto(trainingRepository.save(tp));
    }

    @Transactional
    public TrainingDto updateTraining(Long id, Long orgId, TrainingCreateDto dto, boolean isAdmin) {
        TrainingProgram tp = trainingRepository.findById(id).orElseThrow();
        if (!isAdmin && !tp.getProvider().getId().equals(orgId)) throw new RuntimeException("Unauthorized");
        
        tp.setTitle(dto.getTitle()); tp.setDescription(dto.getDescription());
        tp.setRequirements(dto.getRequirements()); tp.setModulesSyllabus(dto.getModulesSyllabus());
        tp.setDurationWeeks(dto.getDurationWeeks()); tp.setSeats(dto.getSeats());
        tp.setStartDate(dto.getStartDate()); tp.setEndDate(dto.getEndDate());
        if(dto.getStatus() != null) tp.setStatus(dto.getStatus());
        
        return mapToDto(trainingRepository.save(tp));
    }

    @Transactional
    public EnrollmentDto enroll(Long studentId, Long trainingId) {
        TrainingProgram tp = trainingRepository.findById(trainingId).orElseThrow();
        if (tp.getStatus() != TrainingStatus.OPEN) throw new RuntimeException("Training is not open");
        
        int currentEnrollments = enrollmentRepository.countByTrainingProgramIdAndStatusNot(trainingId, EnrollmentStatus.DROPPED);
        if (currentEnrollments >= tp.getSeats()) throw new RuntimeException("No seats available");
        
        if (enrollmentRepository.existsByStudentIdAndTrainingProgramId(studentId, trainingId)) {
            throw new RuntimeException("Already enrolled");
        }
        
        Student student = studentRepository.findById(studentId).orElseThrow();
        Enrollment enrollment = Enrollment.builder()
                .student(student).trainingProgram(tp).status(EnrollmentStatus.ENROLLED).build();
        return mapEnrollmentToDto(enrollmentRepository.save(enrollment));
    }

    @Transactional
    public void unenroll(Long studentId, Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId).orElseThrow();
        if (!enrollment.getStudent().getId().equals(studentId)) throw new RuntimeException("Unauthorized");
        enrollment.setStatus(EnrollmentStatus.DROPPED);
        enrollmentRepository.save(enrollment);
    }

    public List<EnrollmentDto> getStudentEnrollments(Long studentId) {
        return enrollmentRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .map(this::mapEnrollmentToDto).collect(Collectors.toList());
    }

    public List<EnrollmentDto> getTrainingEnrollments(Long trainingId, Long orgId, boolean isAdmin) {
        TrainingProgram tp = trainingRepository.findById(trainingId).orElseThrow();
        if (!isAdmin && !tp.getProvider().getId().equals(orgId)) throw new RuntimeException("Unauthorized");
        
        return enrollmentRepository.findByTrainingProgramIdOrderByCreatedAtDesc(trainingId).stream()
                .map(this::mapEnrollmentToDto).collect(Collectors.toList());
    }
    
    @Transactional
    public void updateEnrollmentStatus(Long enrollmentId, EnrollmentStatus status) {
        Enrollment e = enrollmentRepository.findById(enrollmentId).orElseThrow();
        e.setStatus(status);
        enrollmentRepository.save(e);
    }

    private TrainingDto mapToDto(TrainingProgram tp) {
        Organization o = tp.getProvider();
        OrganizationDto orgDto = OrganizationDto.builder().id(o.getId()).companyName(o.getCompanyName()).website(o.getWebsite()).build();
        int enrolledCount = enrollmentRepository.countByTrainingProgramIdAndStatusNot(tp.getId(), EnrollmentStatus.DROPPED);
        
        return TrainingDto.builder()
                .id(tp.getId()).title(tp.getTitle()).description(tp.getDescription()).requirements(tp.getRequirements())
                .modulesSyllabus(tp.getModulesSyllabus()).durationWeeks(tp.getDurationWeeks()).seats(tp.getSeats())
                .startDate(tp.getStartDate()).endDate(tp.getEndDate()).status(tp.getStatus())
                .provider(orgDto).enrolledCount(enrolledCount).build();
    }

    private EnrollmentDto mapEnrollmentToDto(Enrollment e) {
        return EnrollmentDto.builder()
                .id(e.getId()).studentId(e.getStudent().getId()).studentName(e.getStudent().getUser().getName())
                .studentCollege(e.getStudent().getCollege()).trainingId(e.getTrainingProgram().getId())
                .trainingTitle(e.getTrainingProgram().getTitle()).providerName(e.getTrainingProgram().getProvider().getCompanyName())
                .status(e.getStatus()).enrolledAt(e.getCreatedAt()).build();
    }
}
