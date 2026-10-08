package com.interntrack.backend.payload.request;
import com.interntrack.backend.model.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String password;
    
    @NotNull
    private Role role; // STUDENT or ORGANIZATION
    
    // Student specifics
    private String college;
    private String department;
    private Integer yearOfStudy;
    private String studentPhone;
    
    // Organization specifics
    private String organizationName;
    private String organizationType;
    private String contactPerson;
    private String website;
    private String orgPhone;
}
