# InternTrack 🚀
InternTrack is a comprehensive, enterprise-grade Student Internship & Skill Training Tracking Portal. It unites Students, Organizations (Companies/Training Providers), and College Administrators into a single seamless ecosystem.

## Features
- **Role-Based Access**: Specialized portals for Students, Organizations, and Admins.
- **Internship & Training Management**: Organizations can post opportunities; students can apply and track their applications.
- **Real-Time Progress Tracking**: Organizations can update student progress, triggering automated status changes.
- **Document Vault**: Secure, drag-and-drop file uploads for resumes and ID proofs.
- **Automated Certification**: Cryptographically verifiable PDF certificates generated on-the-fly via OpenPDF upon course completion.
- **Interactive UI**: "Lavender Glass" design system, Framer Motion animations, Recharts analytics, and 3D scenes powered by React Three Fiber.
- **Dark Mode**: Fully responsive, accessible light/dark theme toggles.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Recharts, TanStack Query, Zustand, React-Three-Fiber.
- **Backend**: Java 17, Spring Boot 3.4, Spring Security 7 (JWT), Spring Data JPA, Hibernate, MySQL, OpenPDF.
- **Infra**: Docker, Docker Compose.

## Quick Start (Docker)
1. Ensure Docker and Docker Compose are installed.
2. Run `docker-compose up --build -d`
3. Access Frontend at `http://localhost:80`
4. Access Backend API at `http://localhost:8080` (Swagger: `http://localhost:8080/swagger-ui.html`)

## Demo Script & Test Accounts
The database automatically seeds the following accounts (Password for all is `password123`):
- **Admin**: `admin@interntrack.com`
- **Organization**: `hr@techcorp.com`, `training@skillup.com`
- **Student**: `john@student.edu`, `alice@student.edu`

**Demo Flow:**
1. Login as **Organization** -> Post an Internship.
2. Login as **Student** -> Apply to the Internship -> Upload Resume.
3. Login as **Admin** -> Verify Resume -> Approve Application.
4. Login as **Organization** -> Update Student Progress to 100%.
5. Login as **Student** -> Download the newly generated PDF Certificate.
