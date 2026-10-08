package com.interntrack.backend.repository;
import com.interntrack.backend.model.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Application> findByInternshipIdOrderByCreatedAtDesc(Long internshipId);
    boolean existsByStudentIdAndInternshipId(Long studentId, Long internshipId);
}
