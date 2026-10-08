package com.interntrack.backend.service;
import com.interntrack.backend.model.entity.*;
import com.interntrack.backend.model.enums.Role;
import com.interntrack.backend.model.enums.OrganizationStatus;
import com.interntrack.backend.payload.request.LoginRequest;
import com.interntrack.backend.payload.request.RegisterRequest;
import com.interntrack.backend.payload.response.AuthResponse;
import com.interntrack.backend.payload.response.UserDto;
import com.interntrack.backend.repository.OrganizationRepository;
import com.interntrack.backend.repository.StudentRepository;
import com.interntrack.backend.repository.UserRepository;
import com.interntrack.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already in use.");
        }
        if (request.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot self-register as ADMIN.");
        }

        // Fix: Auto-approve all users (including Organizations) so they can log in immediately
        boolean isActive = true;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(isActive)
                .build();
        user = userRepository.save(user);

        if (request.getRole() == Role.STUDENT) {
            Student student = Student.builder()
                    .user(user)
                    .college(request.getCollege())
                    .department(request.getDepartment())
                    .graduationYear(request.getYearOfStudy())
                    .phone(request.getStudentPhone())
                    .build();
            studentRepository.save(student);
        } else if (request.getRole() == Role.ORGANIZATION) {
            Organization org = Organization.builder()
                    .user(user)
                    .companyName(request.getOrganizationName())
                    .type(request.getOrganizationType())
                    .contactPerson(request.getContactPerson())
                    .website(request.getWebsite())
                    .phone(request.getOrgPhone())
                    // Fix: Set status to APPROVED by default
                    .status(OrganizationStatus.APPROVED)
                    .build();
            organizationRepository.save(org);
        }

        String jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .accessToken(jwtToken)
                .user(UserDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (!user.isActive()) {
            if (user.getRole() == Role.ORGANIZATION) {
                throw new RuntimeException("Your organization account is pending admin approval or suspended.");
            }
            throw new RuntimeException("Your account is currently suspended.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder()
                .accessToken(jwtToken)
                .user(UserDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .build();
    }
}
