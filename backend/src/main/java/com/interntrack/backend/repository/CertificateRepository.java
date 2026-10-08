package com.interntrack.backend.repository;
import com.interntrack.backend.model.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    Optional<Certificate> findByVerificationCode(String verificationCode);
    boolean existsByReferenceTypeAndReferenceId(com.interntrack.backend.model.enums.ReferenceType type, Long referenceId);
}
