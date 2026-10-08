package com.interntrack.backend.repository;
import com.interntrack.backend.model.entity.ApplicationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationHistoryRepository extends JpaRepository<ApplicationHistory, Long> {
    List<ApplicationHistory> findByApplicationIdOrderByCreatedAtDesc(Long applicationId);
}
