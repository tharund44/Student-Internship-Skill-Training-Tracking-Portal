package com.interntrack.backend.repository;
import com.interntrack.backend.model.entity.Internship;
import com.interntrack.backend.model.enums.WorkMode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InternshipRepository extends JpaRepository<Internship, Long> {
    
    @Query("SELECT i FROM Internship i WHERE i.status = 'OPEN' AND " +
           "(:search IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(i.organization.companyName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:mode IS NULL OR i.mode = :mode) AND " +
           "(:skill IS NULL OR LOWER(i.skills) LIKE LOWER(CONCAT('%', :skill, '%')))")
    Page<Internship> findPublicInternships(@Param("search") String search, @Param("mode") WorkMode mode, @Param("skill") String skill, Pageable pageable);
    
    Page<Internship> findByOrganizationId(Long organizationId, Pageable pageable);
}
