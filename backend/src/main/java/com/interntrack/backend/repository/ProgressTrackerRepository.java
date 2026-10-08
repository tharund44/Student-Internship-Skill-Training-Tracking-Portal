package com.interntrack.backend.repository;
import com.interntrack.backend.model.entity.ProgressTracker;
import com.interntrack.backend.model.enums.ReferenceType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProgressTrackerRepository extends JpaRepository<ProgressTracker, Long> {
    List<ProgressTracker> findByStudentIdOrderByUpdatedAtDesc(Long studentId);
    List<ProgressTracker> findByOrganizationIdOrderByUpdatedAtDesc(Long orgId);
    Optional<ProgressTracker> findByReferenceTypeAndReferenceId(ReferenceType type, Long referenceId);
}
