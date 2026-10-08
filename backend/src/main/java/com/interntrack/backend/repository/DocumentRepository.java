package com.interntrack.backend.repository;
import com.interntrack.backend.model.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<Document> findByReferenceTypeAndReferenceIdOrderByCreatedAtDesc(com.interntrack.backend.model.enums.ReferenceType type, Long referenceId);
}
