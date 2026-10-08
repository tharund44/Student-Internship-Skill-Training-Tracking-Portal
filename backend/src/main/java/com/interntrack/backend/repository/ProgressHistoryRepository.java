package com.interntrack.backend.repository;
import com.interntrack.backend.model.entity.ProgressHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProgressHistoryRepository extends JpaRepository<ProgressHistory, Long> {
    List<ProgressHistory> findByProgressTrackerIdOrderByCreatedAtDesc(Long progressTrackerId);
}
