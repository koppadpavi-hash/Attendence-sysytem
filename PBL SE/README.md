# GM University - Department-Wise Student Attendance Management System

An institutional web application engineered for **GM University (GMU), Davanagere** as part of a **College Software Engineering Project-Based Learning (PBL)** assignment.

The application replicates the official visual identity of the **GM University website** ([https://www.gmu.ac.in/](https://www.gmu.ac.in/)), featuring its Betel Nut Brown (`#4A121A`) and Gold (`#E3B559`) palette, authentic university crest, typography, responsive card layouts, and portal navigation.

---

## 🌐 Quick Access Links

- **Localhost Web Server:** [http://localhost:3000/](http://localhost:3000/)
- **Direct Browser File Access:** [index.html](file:///C:/Users/Pavitra%20M%20K/.gemini/antigravity/scratch/gmu-attendance-system/index.html)

---

## 🚀 Key Highlights & Engineering Features

- **Department-Wise Attendance Management:**
  - Maintains separate records, faculty allocations, classes, subjects, and attendance registers across **5 core departments**:
    1. **Computer Science and Engineering (CSE)**
    2. **Information Science and Engineering (ISE)**
    3. **Electronics and Communication Engineering (ECE)**
    4. **Mechanical Engineering (ME)**
    5. **Civil Engineering (CE)**
  - Extensible architecture: Administrator can create additional departments dynamically via the UI without code changes.
  - Safe deletion protection: Prevents deleting departments containing active students, faculty, classes, or subjects.
- **Login-First Entry Architecture:**
  - `index.html` is the strict entry sign-in page. Inner pages are protected by client-side route guards.
  - One-click demo credentials chip selector categorized by role and department.
- **Multi-Department Faculty Access:**
  - Faculty accounts can be assigned to multiple departments (e.g. Dr. Venkatesh Rao authorized for both ISE and CSE).
  - Contextual department switcher on the faculty dashboard.
- **Role-Based Dashboards:**
  - ⚙ **Administrator Console:** University-wide or department-specific dashboard switcher, Department management (Add/Edit/Safe Delete), Class management, Subject curriculum management, Student & Faculty directories, and Attendance Master.
  - 👨‍🏫 **Faculty Portal:** Department-scoped lecture marking, duplicate session prevention `(dept + class + subject + date)`, lecture history, and class roster defaulter tracking.
  - 🎓 **Student Self-Service:** Department badge, overall & subject-wise percentage, UGC 75% critical shortage alerts, course logs, and CSV download.
- **Zero-Dependency Architecture:** Pure HTML5, CSS3, and modern vanilla JavaScript. No build steps, no npm packages, and no external runtime required.
- **Partitioned LocalStorage Engine:**
  - `gmu_users`: User credentials, roles, and profile linkages.
  - `gmu_departments`: Department codes, names, HODs, and operational status.
  - `gmu_classes`: Batches and sections linked by department.
  - `gmu_subjects`: Curriculum courses with code and assigned faculty.
  - `gmu_students`: Student enrollment records with USN, class, and department.
  - `gmu_faculty`: Faculty profiles, primary department, and authorized departments array.
  - `gmu_attendance`: Attendance session records with department tags and timestamps.
  - `gmu_current_user`: Active authenticated session token.

---

## 📁 Repository Directory Structure

```text
gmu-attendance-system/
│
├── index.html                   # University Portal Login (First Page)
├── admin-dashboard.html         # Administrator Department Hub & Management
├── faculty-dashboard.html       # Faculty Daily Attendance Register & History
├── student-dashboard.html       # Student Self-Service Attendance Dashboard
├── server.ps1                   # Lightweight PowerShell HTTP Local Server
├── README.md                    # Root Documentation & Quick Start
│
├── assets/
│   ├── gmu-official-logo.png    # Authentic GM University Logo Crest
│   ├── gmu-campus-bg.png        # Official GMU Campus Photograph
│   └── gmu-crest.svg            # Scalable University Crest Icon
│
├── css/
│   └── style.css                # GMU design tokens, responsive layout, print rules
│
├── js/
│   ├── storage.js               # Multi-department seed data & localStorage engine
│   ├── departments.js           # DepartmentsManager (Depts, Classes, Subjects CRUD & safe delete)
│   ├── auth.js                  # Authentication, department route guards & session
│   ├── students.js              # Student CRUD, enrollment & attendance math
│   ├── faculty.js               # Faculty CRUD & multi-department authorization
│   └── attendance.js            # Marking logic, duplicate prevention & CSV exports
│
└── docs/                        # Complete 12-Page PBL Documentation Suite
    ├── 01_problem_statement.md   # Problem statement & institutional objectives
    ├── 02_srs.md                # Software Requirements Specification (SRS)
    ├── 03_sdlc_model.md         # Iterative/Agile SDLC rationale & sprint milestones
    ├── 04_use_case_diagram.md   # Mermaid Use-Case diagram (Admin, Faculty, Student)
    ├── 05_system_architecture.md# Mermaid 4-Layer System Architecture diagram
    ├── 06_er_dfd_diagram.md     # Mermaid ER Diagram & Level 0/1 DFD
    ├── 07_test_plan.md          # 20+ comprehensive test cases
    ├── 08_change_management.md  # Requirement change management (Department-wise)
    ├── 09_team_contributions.md # 4-member PBL team contribution matrix
    └── 10_user_manual_readme.md # Complete user guide with demo workflows
```

---

## 🔑 Demo Login Credentials

| Role | Department | Username | Password | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | All 5 Departments | `admin` | `admin123` | Full access across all departments |
| **Faculty** | CSE | `rajesh.kumar` | `faculty123` | CSE Department Head & Faculty |
| **Faculty** | ISE & CSE (Multi-Dept) | `venkatesh.rao` | `faculty123` | Authorized for both ISE & CSE |
| **Faculty** | ECE | `suresh.babu` | `faculty123` | ECE Department |
| **Faculty** | ME | `ramesh.patil` | `faculty123` | Mechanical Engineering |
| **Faculty** | CE | `manjunath.swamy` | `faculty123` | Civil Engineering |
| **Student** | CSE | `4GM22CS054` | `student123` | Attendance > 75% (Eligible) |
| **Student** | CSE (Defaulter) | `4GM22CS006` | `student123` | Attendance < 75% (Shortage Alert) |
| **Student** | ECE | `4GM22EC001` | `student123` | ECE 4th Semester Student |
| **Student** | ME | `4GM22ME001` | `student123` | ME 4th Semester Student |
| **Student** | CE | `4GM22CV001` | `student123` | CE 4th Semester Student |
    ├── 07_test_plan.md          # 18 comprehensive test cases with execution results
    ├── 08_change_management.md  # Requirement change management protocol
    ├── 09_team_contributions.md # 4-member team contribution breakdown matrix
    └── 10_user_manual_readme.md # User guide, evaluation credentials, and report screenshots
```

---

## 🔑 Demonstration Login Credentials

The portal login page provides **1-Click Auto Login Buttons** for instant evaluation without manual typing.

| Role | Username | Password | User Persona & Testing Focus |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Dr. S. B. Shivakumar *(Principal Administrator)* &bull; Campus stats, enroll student, add faculty, data reset. |
| **Faculty** | `rajesh.kumar` | `faculty123` | Dr. Rajesh Kumar *(Dept. of CSE - Software Engg)* &bull; Mark attendance for `CSE-A`, duplicate check, history. |
| **Student (Normal)** | `4GM22CS054` | `student123` | Sneha Patil *(4th Sem, CSE-B)* &bull; Eligible student (>75% attendance), subject breakdown, session logs. |
| **Student (Defaulter Demo)**| `4GM22CS006` | `student123` | Harsha Vardhan K. *(4th Sem, CSE-A)* &bull; **Low Attendance Alert Showcase: 22% (<75%)**, critical alert banner. |

---

## 💻 How to Run the Application

1. Double-click `index.html` in your file browser, or open it in any modern browser (Chrome, Edge, Firefox, Safari).
2. Choose your role (or click any of the 1-click demo login buttons).
3. Explore the dashboard features:
   - Mark a session in the Faculty dashboard and observe the duplicate-check alert.
   - Add a student in the Admin dashboard and verify their automatic user account generation.
   - Log in as student `4GM22CS006` to observe the `< 75%` low attendance warning alert.
   - Click "Export CSV" to download an official attendance sheet.
