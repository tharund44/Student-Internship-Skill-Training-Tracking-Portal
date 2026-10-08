package com.interntrack.backend.service;
import com.interntrack.backend.model.entity.*;
import com.interntrack.backend.model.enums.*;
import com.interntrack.backend.payload.response.DashboardStatsDto;
import com.interntrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final StudentRepository studentRepository;
    private final OrganizationRepository orgRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final TrainingProgramRepository trainingRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateRepository certificateRepository;
    private final AuditLogRepository auditLogRepository;

    public DashboardStatsDto getStudentStats(Long userId) {
        Student s = studentRepository.findByUserId(userId).orElseThrow();
        long apps = applicationRepository.findByStudentIdOrderByCreatedAtDesc(s.getId()).size();
        long enrolls = enrollmentRepository.findByStudentIdOrderByCreatedAtDesc(s.getId()).size();
        long certs = certificateRepository.findByStudentIdOrderByCreatedAtDesc(s.getId()).size();

        Map<String, Object> counters = new HashMap<>();
        counters.put("applications", apps);
        counters.put("trainings", enrolls);
        counters.put("certificates", certs);
        counters.put("overallProgress", 75); // Mocked progress avg

        // Mock trends for charts
        List<Map<String, Object>> trends = List.of(
            Map.of("month", "Jan", "applications", 1, "interviews", 0),
            Map.of("month", "Feb", "applications", 3, "interviews", 1),
            Map.of("month", "Mar", "applications", 2, "interviews", 2)
        );

        return DashboardStatsDto.builder().counters(counters).trends(trends).recentActivities(List.of()).build();
    }

    public DashboardStatsDto getAdminStats() {
        long students = studentRepository.count();
        long orgs = orgRepository.count();
        long internships = internshipRepository.count();
        long trainings = trainingRepository.count();

        Map<String, Object> counters = new HashMap<>();
        counters.put("totalStudents", students);
        counters.put("totalOrganizations", orgs);
        counters.put("activeInternships", internships);
        counters.put("activeTrainings", trainings);

        List<Map<String, Object>> trends = List.of(
            Map.of("month", "Jan", "students", 10, "internships", 5),
            Map.of("month", "Feb", "students", 25, "internships", 15),
            Map.of("month", "Mar", "students", 40, "internships", 20),
            Map.of("month", "Apr", "students", students, "internships", internships) // Current
        );

        List<Map<String, Object>> activities = auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
            .limit(5).map(a -> Map.of("action", (Object)a.getAction(), "time", a.getCreatedAt().toString(), "admin", a.getPerformedBy().getName()))
            .collect(Collectors.toList());

        return DashboardStatsDto.builder().counters(counters).trends(trends).recentActivities(activities).build();
    }

    public DashboardStatsDto getOrgStats(Long userId) {
        Organization o = orgRepository.findByUserId(userId).orElseThrow();
        long internships = internshipRepository.findAll().stream().filter(i -> i.getOrganization().getId().equals(o.getId())).count();
        long trainings = trainingRepository.findAll().stream().filter(t -> t.getProvider().getId().equals(o.getId())).count();
        
        Map<String, Object> counters = new HashMap<>();
        counters.put("activeOpportunities", internships + trainings);
        counters.put("newApplications", 15); // Mocked
        counters.put("enrolledStudents", 42); // Mocked

        List<Map<String, Object>> trends = List.of(
            Map.of("month", "Jan", "views", 100, "applicants", 20),
            Map.of("month", "Feb", "views", 250, "applicants", 45),
            Map.of("month", "Mar", "views", 400, "applicants", 80)
        );

        return DashboardStatsDto.builder().counters(counters).trends(trends).recentActivities(List.of()).build();
    }

    public String generateAdminCsvReport() {
        StringBuilder csv = new StringBuilder("ID,Name,Role,Status,Created At\n");
        // In a real app, query all users. Mocking output string.
        csv.append("1,Admin User,ADMIN,ACTIVE,2024-01-01\n");
        csv.append("2,John Doe,STUDENT,ACTIVE,2024-01-15\n");
        csv.append("3,Tech Corp,ORGANIZATION,ACTIVE,2024-02-01\n");
        return csv.toString();
    }
}
