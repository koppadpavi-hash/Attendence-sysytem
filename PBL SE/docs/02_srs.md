# Software Requirements Specification (SRS)

**System:** GM University Student Attendance Management System  
**Document Version:** 1.0  
**Scope:** Client-side Academic Enterprise Web Application  

---

## 1. Stakeholders and User Profiles

| Stakeholder / Role | Description | Primary Responsibilities & Permissions |
| :--- | :--- | :--- |
| **University Administrator (Dean / Registrar)** | Executive authority managing institutional records | • Manage student admissions and enrollments<br>• Manage faculty appointments and subject allocations<br>• Monitor university-wide attendance analytics and defaulter counts<br>• Oversee master registers and perform system demo resets / data backups |
| **Faculty Member (Course Instructor)** | Academic staff conducting lectures and lab sessions | • Take daily attendance for allotted classes & subjects<br>• Prevent duplicate session submissions<br>• Review past session logs and student turnouts<br>• Filter class rosters for attendance defaulters (<75%)<br>• Export class attendance sheets as CSV |
| **Student** | Enrolled undergraduate / postgraduate student | • View real-time overall attendance percentage<br>• Track subject-wise attendance and shortage warnings<br>• Review historical session-by-session records<br>• Download personal attendance summary report |

---

## 2. Functional Requirements (FR)

### FR-1: User Authentication & Role-Based Access
- **FR-1.1:** The system shall authenticate users against credentials stored in `localStorage` under key `gmu_users`.
- **FR-1.2:** The login interface shall provide a 3-way role selector: Administrator, Faculty, and Student.
- **FR-1.3:** The system shall reject unauthorized login attempts and role mismatches with descriptive error messages.
- **FR-1.4:** Session states (`gmu_current_user`) shall persist across page navigation and protect dashboard pages from unauthorized direct URL access.
- **FR-1.5:** Each dashboard shall provide a functional Logout action clearing active session state.

### FR-2: Student Management (Admin & Faculty)
- **FR-2.1:** The administrator shall have the ability to enroll new students by entering: Name, Roll Number/USN, Class/Section, Semester, Department, Email, and Phone.
- **FR-2.2:** The system shall enforce uniqueness on student Roll Number/USN, rejecting duplicates with actionable error alerts.
- **FR-2.3:** Upon adding a new student, the system shall automatically create a corresponding student login account in `gmu_users` with default credentials.
- **FR-2.4:** The system shall allow deleting students with confirmation, removing both student records and linked authentication profiles.
- **FR-2.5:** Administrators and faculty shall be able to filter and search students by Name, USN, Class, Department, and Low Attendance status (<75%).

### FR-3: Faculty Management (Admin)
- **FR-3.1:** The administrator shall have the ability to register faculty members: Faculty ID, Name, Department, Allocated Subject, Subject Code, Email, Phone, and Assigned Class.
- **FR-3.2:** The system shall automatically generate a faculty login account upon registration.
- **FR-3.3:** The administrator shall have the ability to edit existing faculty profiles with immediate data synchronization.
- **FR-3.4:** The system shall support deleting faculty profiles with confirmation.

### FR-4: Attendance Management (Faculty)
- **FR-4.1:** Faculty shall select Class/Section, Subject, and Date to load the active student roster.
- **FR-4.2:** Each student entry shall provide toggle controls for "Present" and "Absent".
- **FR-4.3:** The interface shall provide bulk shortcuts: "Mark All Present" and "Mark All Absent".
- **FR-4.4:** The system shall check for duplicate submissions for the same (Class, Subject, Date). If duplicate exists, it shall prompt the instructor to confirm overwrite.
- **FR-4.5:** Attendance sessions shall be saved in `localStorage` under `gmu_attendance`.

### FR-5: Compliance & Calculation Engine
- **FR-5.1:** Overall attendance percentage shall be computed as:
  $$\text{Percentage} = \left(\frac{\text{Classes Attended}}{\text{Total Classes Conducted}}\right) \times 100$$
- **FR-5.2:** Subject-wise percentage shall be computed individually for every course.
- **FR-5.3:** Any student with overall or subject attendance $< 75\%$ shall be flagged in red with a prominent warning badge and listed on defaulter reports.

### FR-6: Reporting & Data Export
- **FR-6.1:** The system shall generate RFC-4180 compliant CSV files for attendance registers.
- **FR-6.2:** The system shall support formatted print output with browser print styling (`@media print`).

---

## 3. Non-Functional Requirements (NFR)

1. **Zero-Dependency Portability (NFR-1):** The web application must run immediately upon opening `index.html` in any standard web browser (Chrome, Edge, Firefox, Safari) without any build process, Node.js runtime, or external web server.
2. **Performance (NFR-2):** DOM updates, search filtering, and percentage calculations must execute within 50 milliseconds for up to 500 student records.
3. **Institutional UI Consistency (NFR-3):** All pages must strictly adhere to the GM University brand manual, employing official primary maroon (`#4A121A`), university gold (`#E3B559`), and standardized header/footer structures.
4. **Data Isolation & Integrity (NFR-4):** Data entities must be stored under distinct localStorage namespaces: `gmu_users`, `gmu_students`, `gmu_faculty`, and `gmu_attendance`.
5. **Responsiveness (NFR-5):** The user interface must adapt cleanly across desktop (>= 1200px), tablet (768px - 1199px), and mobile devices (< 768px).
6. **Usability & Error Prevention (NFR-6):** Destructive actions (deletion, demo data reset) must require explicit modal/alert confirmation before execution.
