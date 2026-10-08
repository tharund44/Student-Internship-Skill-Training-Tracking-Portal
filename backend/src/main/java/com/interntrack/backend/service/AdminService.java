package com.interntrack.backend.service;
import com.interntrack.backend.model.entity.*;
import com.interntrack.backend.model.enums.Role;
import com.interntrack.backend.payload.response.AuditLogDto;
import com.interntrack.backend.payload.response.UserManagementDto;
import com.interntrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final OrganizationRepository orgRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void logAction(String action, String entityName, Long entityId, String details, Long performedById) {
        User admin = userRepository.findById(performedById).orElseThrow();
        AuditLog log = AuditLog.builder()
                .action(action).entityName(entityName).entityId(entityId)
                .details(details).performedBy(admin).build();
        auditLogRepository.save(log);
    }

    public List<AuditLogDto> getAuditLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(l -> AuditLogDto.builder()
                        .id(l.getId()).action(l.getAction()).entityName(l.getEntityName())
                        .entityId(l.getEntityId()).details(l.getDetails())
                        .performedBy(l.getPerformedBy().getName())
                        .timestamp(l.getCreatedAt()).build())
                .collect(Collectors.toList());
    }

    public List<UserManagementDto> getAllUsers() {
        return userRepository.findAll().stream().map(u -> {
            String orgName = null;
            String college = null;
            if (u.getRole() == Role.ORGANIZATION) {
                orgName = orgRepository.findByUserId(u.getId()).map(Organization::getCompanyName).orElse(null);
            } else if (u.getRole() == Role.STUDENT) {
                college = studentRepository.findByUserId(u.getId()).map(Student::getCollege).orElse(null);
            }
            return UserManagementDto.builder()
                    .id(u.getId()).name(u.getName()).email(u.getEmail())
                    .role(u.getRole()).active(u.isActive()).createdAt(u.getCreatedAt())
                    .orgName(orgName).collegeName(college).build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public UserManagementDto toggleUserStatus(Long userId, Long adminId) {
        if (userId.equals(adminId)) throw new RuntimeException("Cannot suspend or alter your own account.");
        User target = userRepository.findById(userId).orElseThrow();
        
        if (target.getRole() == Role.ADMIN && target.isActive()) {
            long activeAdmins = userRepository.findAll().stream().filter(u -> u.getRole() == Role.ADMIN && u.isActive()).count();
            if (activeAdmins <= 1) throw new RuntimeException("Cannot suspend the last active administrator.");
        }
        
        target.setActive(!target.isActive());
        target = userRepository.save(target);
        
        logAction(target.isActive() ? "USER_ACTIVATED" : "USER_SUSPENDED", "User", target.getId(), 
                 "Status changed to " + (target.isActive() ? "ACTIVE" : "SUSPENDED"), adminId);
                 
        String orgName = null; String college = null;
        if (target.getRole() == Role.ORGANIZATION) { orgName = orgRepository.findByUserId(target.getId()).map(Organization::getCompanyName).orElse(null); }
        if (target.getRole() == Role.STUDENT) { college = studentRepository.findByUserId(target.getId()).map(Student::getCollege).orElse(null); }
                 
        return UserManagementDto.builder().id(target.getId()).name(target.getName()).email(target.getEmail())
                .role(target.getRole()).active(target.isActive()).createdAt(target.getCreatedAt())
                .orgName(orgName).collegeName(college).build();
    }
}
