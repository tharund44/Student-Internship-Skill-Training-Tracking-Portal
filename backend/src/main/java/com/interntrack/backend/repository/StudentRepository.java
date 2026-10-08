package com.interntrack.backend.repository;
import com.interntrack.backend.model.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    
    @Query("SELECT s FROM Student s WHERE " +
           "(:search IS NULL OR LOWER(s.user.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(s.college) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Student> searchStudents(@Param("search") String search, Pageable pageable);
}
