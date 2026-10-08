package com.interntrack.backend.repository;
import com.interntrack.backend.model.entity.TrainingProgram;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {
    
    @Query("SELECT t FROM TrainingProgram t WHERE t.status = 'OPEN' AND " +
           "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.provider.companyName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<TrainingProgram> searchPublic(@Param("search") String search, Pageable pageable);
    
    Page<TrainingProgram> findByProviderId(Long providerId, Pageable pageable);
}
