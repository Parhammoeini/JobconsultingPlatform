project participants: samantha murillo carmona: 221622816, Ephratah Aguda: 220803490 ,Jonathan Quijano: 220510855 , Parham Moeini: 221767884
## PHASE 1:

```text
src/main/java/com/example/springboot/
├── model/
│   ├── PaymentRequest.java        <-- [UC6] DTO for secure payment data transfer
│   └── PaymentRecord.java         <-- [UC7] Entity for transaction auditing
├── strategy/
│   ├── PaymentStrategy.java       <-- [Pattern] GoF Strategy Interface
│   ├── CreditCardStrategy.java    <-- [UC5] Encapsulated Card Validation logic
│   ├── PayPalStrategy.java        <-- [UC5] Encapsulated PayPal logic
│   └── BankTransferStrategy.java  <-- [UC5] Encapsulated Bank Transfer logic
├── factory/
│   └── PaymentStrategyFactory.java <-- [Pattern] Strategy Creation & Lookup
├── observer/
│   └── PaymentObserver.java       <-- [Pattern] Observer Interface for event-driven updates
├── service/
│   ├── PaymentService.java        <-- [UC5] Subject: Orchestrates payment & notifies observers
│   ├── PaymentMethodService.java  <-- [UC6] CRUD management for saved profiles
│   └── PaymentHistoryService.java <-- [UC4/UC7] Observer: Automated async history logging
└── repository/
    ├── PaymentRepository.java     <-- Persistent storage for Audit Logs
    └── BookingRepository.java     <-- Data Access Layer for Booking retrieval
```

    ### 🛡️ Payment Subsystem Integration Status (UC4-UC7)
I have completed the backend logic for the following:
* **UC4 (Booking History):** Service ready to fetch from `BookingRepository`.
* **UC5 (Payment Processing):** **Strategy Pattern** implemented for Credit/Debit, PayPal, and Bank Transfer. Includes 2-3s simulation delay.
* **UC6 (Manage Methods):** CRUD operations for saved payment profiles.
* **UC7 (Payment History):** Tracking for successful/pending payments and refunds.

**Note to UC1-UC3 devs:** My `PaymentService` is ready to receive your `Booking` objects. Just ensure your `Booking` entity has a `setStatus()` method so I can transition it to `PAID` after the simulation.

### Applied Design Patterns (GoF)

1. **Strategy Pattern**: Used to encapsulate different validation and processing algorithms for Credit Card, PayPal, and Bank Transfers. This allows for easy extension of new payment methods without modifying the core service.
2. **Factory Pattern**: Implemented `PaymentStrategyFactory` to decouple the creation and selection of payment strategies from the `PaymentService`. This centralizes the strategy lookup logic.
3. 1. State Pattern
Where: BookingState.java + BookingLifecycleService.java + Booking.java

The State Pattern is used to model the booking lifecycle from Section 5. The BookingState enum defines all seven possible states a booking can be in (REQUESTED, CONFIRMED, PENDING_PAYMENT, PAID, REJECTED, CANCELLED, COMPLETED). The BookingLifecycleService acts as the state manager — it holds a static EnumMap<BookingState, Set<BookingState>> called TRANSITIONS that maps every state to the exact set of states it is allowed to move to. When any part of the system needs to change a booking's state, it must call BookingLifecycleService.transition(), which resolves the current state, checks the transition map, and either returns the new state or throws an IllegalStateException if the transition is illegal. The Booking model itself stores the current state as a String and exposes getState() and setState(), but all transition logic is externalized into BookingLifecycleService so that no invalid state change can bypass the rules. Terminal states (Rejected, Cancelled, Completed) map to empty sets, meaning once a booking reaches one of those states, it cannot transition any further. This pattern was chosen because the booking has clearly defined states with strict rules governing how it moves between them, which is exactly the problem the State Pattern is designed to solve.

Consultant Subsystem (UC8 - UC10)
Consultant subsytem backend logic is complete for the following:
**UC8 (Manage Availability):** Consultants have a list of avalabilities and they are able to add and remove availbilties. Availabilty Factory is used to generate availability objects ensuring all availability instances are created in a consistent way. 
**UC9 (Accept or Reject Booking Request):** When a Client requests a booking session, a booking request is made and sent to the consultant. The consultant is able to accept or reject the booking and the system uses an Observer pattern to notify clients of the booking state after. 
**UC10 (Complete a Booking):** After a consulting session occurs, the consultant marks the booking as completed.
```text
src/main/java/com/example/springboot/
├── model/
│   ├── Consultant.java               <-- [UC8] Consultant Entity & Availability List
│   ├── AvailabilityStatus.java       <-- [UC8] Enum: AVAILABLE, BOOKED, CANCELLED
│   └── AvailabilityFactory.java             <-- [UC8] GoF Factory Pattern 
├── observer/
│   ├── BookingObserver.java             <-- [UC9 & UC10] Booking Logic Layer
│   └── ClientNotificationObserver.java   <-- [UC9] Notifies Client of booking status
├── service/
│   ├── impl/
│   ├── AvailabilityServiceImpl.java             <-- [UC8] Availability Logic Layer
│   └── AvalabilityService.java           
```
    
Admin Subsystem Integration Status (UC11-UC12)

Admin subsystem backend logic is complete for the following:

* **UC11 (Approve Consultant Registration):** Service ready to approve or reject consultants. Consultant status transitions: `PENDING` → `APPROVED` or `REJECTED`.
* **UC12 (Define System Policies):** Full policy management implemented via `PolicyManager` singleton. Supports adding, updating, viewing, and removing system-wide policies (cancellation rules, refund rates, pricing strategy, notification settings).

Admin Subsystem File Structure

```text
src/main/java/com/example/springboot/
├── model/
│   ├── Consultant.java               <-- [UC11] Consultant Entity & Registration Status
│   ├── RegistrationStatus.java       <-- [UC11] Enum: PENDING, APPROVED, REJECTED
│   └── SystemPolicy.java             <-- [UC12] Policy Entity (name, value, description)
├── service/
│   ├── AdminService.java             <-- [UC11 & UC12] Business Logic Layer
│   └── PolicyManager.java            <-- [Pattern] GoF Singleton - System Policy Store
└── controller/
    └── AdminController.java          <-- [UC11 & UC12] REST API Endpoints
```
Applied Design Patterns (GoF) — Admin Subsystem

3. **Singleton Pattern**: `PolicyManager` ensures only one instance of the policy store exists across the entire application. All services read from the same policy state, preventing inconsistencies in cancellation rules, refund rates, and platform fees.


To run the backend, navigate to the /backend directory and execute ./mvnw spring-boot:run.

## Client Booking Subsystem – File Structure (UC1, UC2, UC3)

The files below implement the client-facing booking flow: browsing services, requesting a booking, and cancelling a booking, along with the full booking lifecycle defined in Section 5.

```text
src/main/java/com/example/springboot/
├── model/
│   ├── BookingState.java                    <-- [Section 5] Enum defining all 7 booking lifecycle states
│   ├── Booking.java                         <-- [Core] The central booking entity linking client, consultant, and state
│   ├── ConsultingServiceInfo.java           <-- [UC1] Model representing a browsable consulting service
│   ├── BookingRequestDTO.java               <-- [UC2] DTO carrying the client's booking request data
│   └── CancellationResult.java              <-- [UC3] DTO returned after a cancellation attempt
├── service/
│   ├── ConsultingServiceCatalogService.java <-- [UC1] Manages the service catalogue and browse/filter logic
│   ├── ClientBookingService.java            <-- [UC2/UC3] Core service for creating and cancelling bookings
│   └── BookingLifecycleService.java         <-- [Section 5] Enforces legal state transitions for all bookings
└── controller/
    └── ClientController.java                <-- [UC1/UC2/UC3] REST API endpoints under /api/client
```
## PHASE 2
## Getting Started

To clone the repository and start up the entire project, run the following commands:
```bash
git clone <repository_url>
cd JobconsultingPlatform
```
The application starts up using the build command. If you are using Docker, you can start up the entire thing with:
```bash
docker-compose up --build
```

## Consultant Approval User Flow

To test the consultant approval flow, log in as an administrator. You must use the same credentials, like `m` for both the username and password. From the admin dashboard, you can review, approve, or reject pending consultant registrations.

## Testing Guide: Phase 2 Demo

To ensure a smooth evaluation of the Consultant Dashboard, Booking Flow, and AI Chatbot, please follow these steps to synchronize the database with the application logic.

### 1. Database Initialization (Resetting Slot 1)
If the system returns an error stating "The selected time slot (id=1) is no longer available," it means the slot was flagged as booked during a previous test. Run the following SQL in your terminal to reset the environment for Consultant 99:

```sql
-- Reset Slot 1 to be Available
UPDATE availability 
SET status = 'AVAILABLE', booked = false, consultant_id = 99 
WHERE id = 1;

-- Ensure Consultant 99 is 'APPROVED' to allow dashboard access
UPDATE consultant SET status = 'APPROVED' WHERE id = 99;
``` 
11.1 GitHub Repository Setup
Repository Structure Your GitHub repository must include:
• All source code (backend and frontend)
• UML diagrams (preferably source files like .plantuml or .drawio)
• Documentation files (README.md, design documents)
• Docker configuration files (Dockerfile, docker-compose.yml)
• .gitignore file (exclude dependencies, build artifacts, API keys)
• .env.example (template for environment variables, NO actual API keys)


AI: Technical Brief
1. Architecture: Hybrid Reasoning Engine

PathFinder AI uses a two-tier architecture to ensure 100% uptime and architectural alignment.

Layer 1: Intent-Based Logic (Regex)

Purpose: Instant, 100% accurate FAQ responses.

Highlight: References the Strategy Design Pattern for payments, proving frontend-backend synergy.

Layer 2: Bio-Assessment (ML/Heuristics)

Purpose: Maps user biographies to 6 core services via suggestServices API.

Fail-Safe: If the API is unreachable, a Local Reasoning Engine uses keyword heuristics (e.g., "CS Student") to provide a contextually accurate fallback.

2. Interaction Tracks

Input Type    Logic Trigger    Sample Response
Process    includes("book")    "1️⃣ Browse... 2️⃣ Request..."
Strategy    includes("pay")    "We use the Strategy Pattern for security."
Academic    includes("cs student")    "Recommend: Mock Interview."
Professional    length > 15    "🧠 AI Analysis: I recommend Resume Review..."

3. Demo Prompts

Technical: "I am a CS student at York with a background in Java."

Pivot: "I have 5 years of marketing experience but want to move into Tech."

Process: "How does the booking and payment process work?"

<img width="1433" height="729" alt="Screenshot 2026-04-05 at 11 35 30 PM" src="https://github.com/user-attachments/assets/b3949e23-99fe-4a21-b65b-d61b5b03c6fc" />
<img width="1433" height="729" alt="Screenshot 2026-04-05 at 11 35 43 PM" src="https://github.com/user-attachments/assets/2fcf9def-e32a-4d1c-8d50-47e9f3f4c4c4" />
<img width="1433" height="729" alt="Screenshot 2026-04-05 at 11 41 21 PM" src="https://github.com/user-attachments/assets/0005f5ed-66a6-4167-97e1-2b5832cf2ae8" />
<img width="1433" height="729" alt="Screenshot 2026-04-05 at 11 42 05 PM" src="https://github.com/user-attachments/assets/6e9077cd-2bf8-4ce8-8628-e0cb59ffe6b6" />
<img width="1433" height="729" alt="Screenshot 2026-04-05 at 11 42 26 PM" src="https://github.com/user-attachments/assets/bd000a7b-1463-4ff5-9898-8d63e9f6417f" />

## Consultant Approval User Flow

To test the consultant approval flow, follow these steps:
1. Log in with the example credentials: `m` for username and `m` for password.
2. Apply to be a consultant through the designated application page.
3. Log out.
4. Go to the admin login and sign in with `admin123` for both username and password.
5. Review and approve the pending consultant registration.
6. Log out.
7. Log back in with the `m` and `m` credentials.
8. You should see a "congrats on becoming a consultant" message and have access to the consultant dashboard.

## Testing Guide: Phase 2 Demo

To ensure a smooth evaluation of the Consultant Dashboard, Booking Flow, and AI Chatbot, please follow these steps to synchronize the database with the application logic.

## Prerequisites

Ensure the following are installed before proceeding:

| Tool | Download |
|------|----------|
| Docker Desktop (includes docker-compose) | https://www.docker.com/products/docker-desktop |
| Git | https://git-scm.com |

> **Windows users:** Make sure Docker Desktop is fully running (whale icon in taskbar) before executing any commands.

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/Parhammoeini/JobconsultingPlatform.git
cd JobconsultingPlatform
```

---

## Step 2 — Set Up the API Key

The AI chatbot feature requires a **Groq API key**.

1. Create a free account at https://console.groq.com
2. Generate an API key from the dashboard
3. In the project root (same folder as `docker-compose.yml`), create a `.env` file:

```bash
# Mac/Linux
echo "GROQ_API_KEY=your_actual_key_here" > .env

# Windows (PowerShell)
echo "GROQ_API_KEY=your_actual_key_here" | Out-File -Encoding utf8 .env
```

> The AI chatbot has a local keyword fallback and will partially work without a key, but full AI-powered recommendations require one.

---

## Step 3 — Build and Start All Services

From the project root:

```bash
docker-compose up --build -d
```

This single command will:
- Build the **Spring Boot backend** from `backend/Dockerfile`
- Build the **React frontend** from `frontend/job-consulting-platform-frontend/Dockerfile`
- Start a **PostgreSQL 16** database on port `5433`
- Connect all three services on a shared Docker network

> **First-time build takes 3–5 minutes.** Maven downloads dependencies and Node builds the React app. Subsequent starts are much faster.

---

## Step 4 — Verify All Containers Are Running

```bash
docker-compose ps
```

All three should show `Up`:

```
NAME                           STATUS
job-consulting-frontend        Up    (port 3000)
job-consulting-api             Up    (port 8080)
postgres-sql-jobconsulting     Up    (port 5433)
```

If any container shows `Exit`, check its logs:

```bash
docker logs job-consulting-api
docker logs job-consulting-frontend
```

---

## Step 5 — Open the Application

| Service | URL |
|---------|-----|
| **Frontend (Main App)** | http://localhost:3000 |
| **Backend API** | http://localhost:8080 |

---

## Logging In

### As a Client
Enter **any username and password** on the login page — the system auto-registers new users as Clients on first login.

### As an Admin
On the login page, click **"Admin Portal Access"** and enter the password: `admin123`

### Consultant Approval Flow (Full Demo)

1. Log in with username `m` and password `m`
2. Apply to become a consultant via the application page
3. Log out
4. Click **Admin Portal Access** → enter `admin123`
5. Approve the pending consultant from the admin dashboard
6. Log out, then log back in with `m` / `m`
7. You now have access to the Consultant Dashboard

---

## Database Access (Optional)

The schema is created automatically by Spring Boot on startup — no manual migration needed.

To open an interactive PostgreSQL shell:

```bash
docker exec -it postgres-sql-jobconsulting psql -U username -d job_consulting
```

Useful commands inside the shell:

```sql
\dt                      -- list all tables
SELECT * FROM app_user;  -- view registered users
SELECT * FROM booking;   -- view all bookings
\q                       -- exit
```

### Resetting Test Data

If you see "The selected time slot is no longer available," run:

```bash
docker exec -it postgres-sql-jobconsulting psql -U username -d job_consulting -c "
UPDATE availability SET status = 'AVAILABLE', booked = false, consultant_id = 99 WHERE id = 1;
UPDATE consultant SET status = 'APPROVED' WHERE id = 99;
"
```

---

## Stopping the Application

```bash
# Stop containers but preserve database data
docker-compose down

# Stop and delete all data (full reset)
docker-compose down -v
```

## Rebuilding After Code Changes

```bash
docker-compose down
docker-compose up --build -d
```

---

## Project Structure

```
JobconsultingPlatform/
├── docker-compose.yml
├── README.md
├── BookingSystemDemo.java
│
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── startup.log
│   └── src/main/java/com/example/springboot/
│       ├── Application.java
│       ├── CorsConfig.java                        ← Global CORS configuration
│       ├── controller/
│       │   ├── AuthController.java                ← Login & auto-registration
│       │   ├── ClientController.java              ← Booking & service endpoints
│       │   ├── AdminController.java               ← Consultant approval & policies
│       │   ├── AiController.java                  ← AI recommendation endpoint
│       │   └── PaymentController.java             ← Payment processing
│       ├── model/
│       │   ├── AppUser.java / Client.java / Consultant.java / Admin.java
│       │   ├── Booking.java / BookingState.java / BookingRequestDTO.java
│       │   ├── Availability.java / AvailabilityStatus.java / AvailabilityFactory.java
│       │   ├── ConsultingServiceInfo.java
│       │   ├── PaymentRecord.java / PaymentRequest.java / PaymentType.java
│       │   ├── SystemPolicy.java / PolicyManager.java  ← Singleton pattern
│       │   ├── LoginRequest.java / CancellationResult.java
│       │   └── RegistrationStatus.java
│       ├── service/
│       │   ├── ClientBookingService.java           ← UC1-UC3 booking logic
│       │   ├── BookingLifecycleService.java        ← State pattern enforcement
│       │   ├── ConsultingServiceCatalogService.java
│       │   ├── AdminService.java                   ← UC11-UC12
│       │   ├── AiConsultingService.java
│       │   ├── AvailabilityService.java / impl/AvailabilityServiceImpl.java
│       │   ├── PaymentService.java                 ← Strategy pattern orchestrator
│       │   ├── PaymentHistoryService.java          ← Observer pattern
│       │   └── PaymentMethodService.java
│       ├── strategy/                               ← GoF Strategy pattern
│       │   ├── PaymentStrategy.java
│       │   ├── CreditCardStrategy.java
│       │   ├── DebitCardStrategy.java
│       │   ├── PayPalStrategy.java
│       │   └── BankTransferStrategy.java
│       ├── factory/
│       │   └── PaymentStrategyFactory.java         ← GoF Factory pattern
│       ├── observer/
│       │   └── PaymentObserver.java                ← GoF Observer pattern
│       └── repository/
│           ├── AppUserRepository.java
│           ├── ClientRepository.java
│           ├── ConsultantRepository.java
│           ├── AdminRepository.java
│           ├── BookingRepository.java
│           ├── AvailabilityRepository.java
│           └── ConsultingServiceRepository.java
│
├── frontend/
│   └── job-consulting-platform-frontend/
│       ├── Dockerfile
│       ├── package.json
│       └── src/
│           ├── App.jsx                            ← Main component, routing & views
│           ├── api.js                             ← Axios client (baseURL: :8080/api)
│           ├── AdminDashboard.jsx
│           ├── ConsultantDashboard.jsx
│           ├── ConsultantApproval.jsx
│           ├── Availability.jsx
│           ├── Booking.jsx
│           ├── BecomeMentor.jsx / MentorApplication.jsx
│           ├── PolicyManager.jsx
│           ├── SystemStatus.jsx
│           ├── SignUp.jsx
│           └── payment.jsx
│
└── diagrams/
    ├── UML.drawio.png
    ├── Admin_Case_Diagram.png
    ├── UC1.drawio.png  UC2.drawio.png  UC3.drawio.png
    ├── UC4-7.png       UC8.png         UC9.png
    ├── UC10.png        UC11.drawio.png UC12.drawio.png
    └── use_case4-7.png
```

---

## AI Chatbot Demo Prompts

| Intent | Example Input |
|--------|--------------|
| Booking process | `"How do I book a session?"` |
| Payment info | `"What payment methods do you accept?"` |
| Cancel info | `"Can I cancel my booking?"` |
| Service list | `"What types of services do you offer?"` |
| Personalized AI | `"I'm a CS student at York with Java experience"` |
| Career pivot | `"I have 5 years of marketing but want to move into tech"` |

---

## Troubleshooting

**Port already in use**
```bash
# Mac/Linux
lsof -ti:8080 | xargs kill -9

# Windows PowerShell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Backend exits immediately**
```bash
docker logs job-consulting-api --tail 50
docker-compose restart backend
```

**Full reset**
```bash
docker-compose down -v --remove-orphans
docker system prune -f
docker-compose up --build -d
```

---

## Environment Variables

| Variable | Description | Where to set |
|----------|-------------|--------------|
| `GROQ_API_KEY` | Groq API key for AI features | `.env` file (you create this) |
| `SPRING_DATASOURCE_URL` | PostgreSQL connection | pre-set in `docker-compose.yml` |
| `SPRING_DATASOURCE_USERNAME` | DB username (`username`) | pre-set in `docker-compose.yml` |
| `SPRING_DATASOURCE_PASSWORD` | DB password (`password`) | pre-set in `docker-compose.yml` |

> Never commit your `.env` file. It is already covered by `.gitignore`. Only `.env.example` should be committed.




