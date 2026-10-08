package com.interntrack.backend.service;
import com.interntrack.backend.model.entity.*;
import com.interntrack.backend.payload.request.StudentUpdateDto;
import com.interntrack.backend.payload.response.HistoryItemDto;
import com.interntrack.backend.payload.response.StudentProfileDto;
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
public class StudentService {
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final EnrollmentRepository enrollmentRepository;

    public StudentProfileDto getProfile(Long userId) {
        Student student = studentRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return mapToDto(student);
    }

    @Transactional
    public StudentProfileDto updateProfile(Long userId, StudentUpdateDto dto) {
        Student student = studentRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        student.getUser().setName(dto.getName());
        student.setCollege(dto.getCollege());
        student.setDepartment(dto.getDepartment());
        student.setGraduationYear(dto.getGraduationYear());
        student.setCgpa(dto.getCgpa());
        student.setSkills(dto.getSkills());
        student.setResumeLink(dto.getResumeLink());
        student.setAvatarUrl(dto.getAvatarUrl());
        
        return mapToDto(studentRepository.save(student));
    }

    public List<HistoryItemDto> getInternshipHistory(Long userId) {
        return applicationRepository.findByStudentIdOrderByCreatedAtDesc(userId).stream()
            .map(app -> HistoryItemDto.builder()
                .id(app.getId())
                .type("INTERNSHIP")
                .title(app.getInternship().getTitle())
                .organizationName(app.getInternship().getOrganization().getCompanyName())
                .status(app.getStatus().name())
                .date(app.getCreatedAt())
                .build())
            .collect(Collectors.toList());
    }

    public List<HistoryItemDto> getTrainingHistory(Long userId) {
        return enrollmentRepository.findByStudentIdOrderByCreatedAtDesc(userId).stream()
            .map(en -> HistoryItemDto.builder()
                .id(en.getId())
                .type("TRAINING")
                .title(en.getTrainingProgram().getTitle())
                .organizationName(en.getTrainingProgram().getProvider().getCompanyName())
                .status(en.getStatus().name())
                .date(en.getCreatedAt())
                .build())
            .collect(Collectors.toList());
    }

    // Admin Methods
    public Page<StudentProfileDto> searchStudents(String search, Pageable pageable) {
        return studentRepository.searchStudents(search, pageable).map(this::mapToDto);
    }

    @Transactional
    public void toggleStatus(Long studentId) {
        User user = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    private StudentProfileDto mapToDto(Student student) {
        return StudentProfileDto.builder()
                .id(student.getId())
                .name(student.getUser().getName())
                .email(student.getUser().getEmail())
                .rollNumber(student.getRollNumber())
                .college(student.getCollege())
                .department(student.getDepartment())
                .graduationYear(student.getGraduationYear())
                .cgpa(student.getCgpa())
                .skills(student.getSkills())
                .resumeLink(student.getResumeLink())
                .avatarUrl(student.getAvatarUrl())
                .active(student.getUser().isActive())
                .build();
    }
}
