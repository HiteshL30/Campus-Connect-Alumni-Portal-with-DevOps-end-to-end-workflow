# Alumni Connect (Campus Connect)

## Overview
Alumni Connect is a full-stack platform designed to bridge the gap between students and university alumni. The platform provides a modern, interactive, and responsive ecosystem for networking, mentorship, job opportunities, event management, and AI-driven interview preparation.

## Technology Stack

### Backend Stack
* **Framework:** Spring Boot 3.2.0 (Java 17)
* **Data Persistence:** Spring Data JPA, Hibernate, MySQL, HikariCP Connection Pooling
* **Database Migrations:** Flyway
* **Security:** Spring Security, JWT (JSON Web Tokens) Authentication
* **Real-time Communication:** Spring Boot WebSocket
* **Resilience & Rate Limiting:** Resilience4j (Circuit Breaker for external LLM calls), Bucket4j
* **AI/LLM Integration:** Pluggable architecture supporting both Google Gemini API and Local Ollama (running models like gemma3:1b)
* **Monitoring:** Spring Boot Actuator (Health, Metrics, Info endpoints)
* **Resume Parsing:** Apache PDFBox

### Frontend Stack
* **Framework:** React 18.2.0 with Vite
* **Routing:** React Router v6
* **Styling:** TailwindCSS v4 with Autoprefixer and PostCSS
* **UI Interactions:** Framer Motion (animations), Lucide React (icons), React Hot Toast (notifications)
* **HTTP Client:** Axios

---

## Core Features & Functionality

### 1. Authentication & Role-Based Access Control
The application supports three primary roles:
* `STUDENT`: Current students seeking guidance, jobs, and networking.
* `ALUMNI`: Graduates offering mentorship, posting opportunities.
* `ADMIN`: Platform administrators capable of verifying alumni authenticity, managing events, and overseeing platform operations.

Users go through a registration process that captures their basic details, followed by a verification step (`AdminVerification`, `PendingVerification`), ensuring that only authentic alumni can provide guidance. This state is managed via secure, stateless JWT tokens.

### 2. Networking and Mentorship
* **User Profiles:** Distinct sub-profiles for students (`StudentProfile`) and alumni (`AlumniProfile`), featuring education history, skills, experience, and contact details.
* **Connections:** Integrated tracking for bidirectional connection states (`ConnectionStatus`) analogous to a LinkedIn-style networking model.
* **Real-time Chat:** Once connected, users can engage in private messaging using a WebSocket-based chat system (`ChatController`, `Message` entity), integrated seamlessly on the frontend via the `Chats` view.

### 3. Career & Opportunity Portal
* **Job Board:** A dedicated module for Alumni and Admins to post job or internship opportunities, allowing students to securely apply (`JobController`, `Jobs` UI).
* **Event Management:** Creating, updating, and RSVPing for university or alumni-driven events (`Event`, `EventParticipant`). Allows both scheduling and timeline monitoring.

### 4. AI-Driven Tools
The platform stands out with significant investments in AI utility for students:
* **Resume Analysis:** A student can upload their resume (processed by PDFBox). An LLM provides comprehensive feedback, scoring, and improvement suggestions.
* **AI Mock Interviews:** Students can initiate mock interview sessions powered by Gemini or a local LLM via local Ollama. The app assesses their inputs against expected patterns and ranks performance according to a defined `Difficulty`.
* **Support Chatbot:** A universal chatbot (`Chatbot.jsx`, `SupportChatbotController`) acts as a platform concierge, answering generalized queries or navigating students through the platform.

External LLM calls use **Resilience4j** to manage failures smartly (sliding window, failure rate thresholds, half-open states) mitigating latency loops or downtime across LLM provider APIs.

---

## Architecture & Design Patterns

* **Separation of Concerns:** Strict adherence to layered architecture on the backend (`Controller` -> `Service` -> `Repository` -> `Entity`).
* **DTO-Based Exchange:** Data travels securely between client and server mostly utilizing specialized Data Transfer Objects (DTOs), segregating business rules from presentation models.
* **Migration-Controlled Database State:** Relying heavily on Flyway. `V1` strictly bootstraps the `User` schema progressively flowing to `V14__resume_analysis.sql`, enforcing repeatable, reliable environment cloning from development to production without schema corruption.
* **Resilient Infrastructure Design:** The `application.properties` cleanly delineates connection timeouts, circuit breaking defaults (`permittedNumberOfCallsInHalfOpenState`, `waitDurationInOpenState`), and switchable LLM drivers (`llm.provider=llama` vs `gemini`).

---

## Setup & Execution Guide

### Prerequisites
* Java 17+ installed.
* Node.js v18+ installed.
* MySQL 8+ database configured and running.
* Optionally, Ollama installed and running locally for `llama` inference (serving `gemma3:1b` model on port `11434`).

### Backend Execution
1. Navigate to `backend/`.
2. Configure `src/main/resources/application.properties` (specifically `spring.datasource.url`, `username`, and `password`).
3. Build and Run:
   ```bash
   mvn clean install -DskipTests
   mvn spring-boot:run
   ```
   *Note: Flyway will automatically execute all migration scripts to build the schema on startup.*

### Frontend Execution
1. Navigate to `frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will typically map to `http://localhost:5000` assuming standard Vite routing configurations mapped to access backend APIs via Axios securely.*
