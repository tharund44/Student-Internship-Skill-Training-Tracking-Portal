package com.interntrack.backend.runner;
import com.interntrack.backend.model.entity.*;
import com.interntrack.backend.model.enums.*;
import com.interntrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SeedDataRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final OrganizationRepository orgRepository;
    private final InternshipRepository internshipRepository;
    private final TrainingProgramRepository trainingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        // 1. ALWAYS upsert the Admin account. 
        // This ensures if you change the admin details or credentials in this file, they are always stored in the database on restart.
        String adminEmail = "admin@interntrack.com";
        String adminPassword = "password123";
        String encPass = passwordEncoder.encode(adminPassword);
        
        User admin = userRepository.findByEmail(adminEmail).orElseGet(() -> 
            User.builder().email(adminEmail).role(Role.ADMIN).build()
        );
        admin.setName("Admin User");
        admin.setPassword(encPass);
        admin.setActive(true);
        userRepository.save(admin);

        // 2. Prevent double seeding of the rest of the mock data
        if (userRepository.count() > 1) {
            System.out.println("Admin credentials verified. Mock data already exists.");
            return; 
        }

        // Organizations
        User orgUser1 = User.builder().name("Tech Corp").email("hr@techcorp.com").password(encPass).role(Role.ORGANIZATION).active(true).build();
        User orgUser2 = User.builder().name("Skill Up").email("training@skillup.com").password(encPass).role(Role.ORGANIZATION).active(true).build();
        userRepository.save(orgUser1); userRepository.save(orgUser2);
        
        Organization org1 = Organization.builder().user(orgUser1).companyName("Tech Corp").description("A leading tech company.").build();
        Organization org2 = Organization.builder().user(orgUser2).companyName("Skill Up").description("Quality training provider.").build();
        orgRepository.save(org1); orgRepository.save(org2);

        // Students
        User studentUser1 = User.builder().name("John Student").email("john@student.edu").password(encPass).role(Role.STUDENT).active(true).build();
        User studentUser2 = User.builder().name("Alice Student").email("alice@student.edu").password(encPass).role(Role.STUDENT).active(true).build();
        userRepository.save(studentUser1); userRepository.save(studentUser2);

        Student student1 = Student.builder().user(studentUser1).rollNumber("ROLL1").department("CS").graduationYear(2027).skills("Java, React").build();
        Student student2 = Student.builder().user(studentUser2).rollNumber("ROLL2").department("IT").graduationYear(2026).skills("Python, Vue").build();
        studentRepository.save(student1); studentRepository.save(student2);

        // Internships
        for(int i=1; i<=5; i++) {
            Internship intern = Internship.builder().organization(org1).title("Software Engineering Intern " + i).description("Build amazing apps.").location("Remote").stipend("$1000/mo").status(InternshipStatus.OPEN).build();
            internshipRepository.save(intern);
        }

        // Training Programs
        for(int i=1; i<=4; i++) {
            TrainingProgram tp = TrainingProgram.builder().provider(org2).title("Full Stack Web Dev Batch " + i).description("Learn Spring Boot & React.").durationWeeks(12).status(TrainingStatus.OPEN).build();
            trainingRepository.save(tp);
        }
        
        System.out.println("Seed data created successfully! Admin password is: " + adminPassword);
    }
}
