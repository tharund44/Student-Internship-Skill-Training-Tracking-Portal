package com.interntrack.backend.payload.response;
import com.interntrack.backend.model.enums.Role;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserManagementDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean active;
    private LocalDateTime createdAt;
    // Context details
    private String orgName;
    private String collegeName;
}
