package com.interntrack.backend.repository;
import com.interntrack.backend.model.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Enrollment> findByTrainingProgramIdOrderByCreatedAtDesc(Long trainingId);
    boolean existsByStudentIdAndTrainingProgramId(Long studentId, Long trainingId);
    int countByTrainingProgramIdAndStatusNot(Long trainingId, com.interntrack.backend.model.enums.EnrollmentStatus status);
}
