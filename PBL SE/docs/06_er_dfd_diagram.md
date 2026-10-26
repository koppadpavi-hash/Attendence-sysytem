# Entity-Relationship (ER) & Data Flow (DFD) Specifications

**System:** GM University Student Attendance Management System  
**Models:** Entity-Relationship Diagram & Data Flow Diagram (Level 0 / Level 1)  

---

## 1. Entity-Relationship (ER) Diagram

The system maintains 4 primary entities within separate `localStorage` namespaces, maintaining referential integrity through foreign keys:

```mermaid
erDiagram
    USER {
        string username PK "Primary key / Login ID"
        string password "Hashed or plain demo credential"
        string role "admin | faculty | student"
        string name "Full display name"
        string email "Official university email"
        string facultyId FK "Optional link to faculty"
        string usn FK "Optional link to student"
    }

    STUDENT {
        string usn PK "University Seat Number (e.g. 4GM22CS001)"
        string name "Student Full Name"
        string classSection "Assigned Section (e.g. CSE-A)"
        string semester "Current Semester (e.g. 4th Sem)"
        string department "Department of Study"
        string email "Official student email"
        string phone "Contact number"
        datetime createdAt "Enrollment timestamp"
    }

    FACULTY {
        string facultyId PK "Faculty Identification (e.g. GMU-FAC-01)"
        string name "Faculty Full Name"
        string department "Academic Department"
        string subject "Primary Allocated Subject"
        string subjectCode "Course Code (e.g. CS401)"
        string email "Official faculty email"
        string phone "Contact number"
        string assignedClass "Assigned Class Section"
    }

    ATTENDANCE_SESSION {
        string id PK "Unique session ID (ATT-Class-Subj-Date)"
        string classSection "Section conducted"
        string subject "Course Name"
        string subjectCode "Course Code"
        date date "Lecture Date (YYYY-MM-DD)"
        string facultyId FK "Instructor taking attendance"
        string facultyName "Instructor Name"
        object records "Map of { USN: 'Present' | 'Absent' }"
        datetime timestamp "Recording timestamp"
    }

    USER ||--o| STUDENT : "authenticates"
    USER ||--o| FACULTY : "authenticates"
    FACULTY ||--o{ ATTENDANCE_SESSION : "conducts & records"
    STUDENT }o--o{ ATTENDANCE_SESSION : "is recorded in"
```

---

## 2. Data Flow Diagram (DFD Level 0 - Context Diagram)

```mermaid
flowchart TD
    Admin[("⚙ Administrator")]
    Faculty[("👨‍🏫 Faculty Member")]
    Student[("🎓 Student")]

    subgraph SystemBoundary ["GM University Attendance Management System"]
        CoreEngine["Portal Engine & Validation Core"]
        StorageEngine[("Browser LocalStorage<br>(gmu_users, gmu_students, gmu_faculty, gmu_attendance)")]
    end

    Admin -->|"Enroll Students / Faculty Data, Reset Trigger"| CoreEngine
    CoreEngine -->|"System Metrics, Analytics, Master Records"| Admin

    Faculty -->|"Class Selection, Date, Student Attendance States"| CoreEngine
    CoreEngine -->|"Rosters, Turnout %, Duplicate Notices, CSV Reports"| Faculty

    Student -->|"View Request (USN Session)"| CoreEngine
    CoreEngine -->|"Personal Attendance %, Subject Cards, Defaulter Alerts"| Student

    CoreEngine <-->|"Read / Write JSON Entities"| StorageEngine
```

---

## 3. Data Flow Diagram (DFD Level 1 - Operational Flow)

```mermaid
flowchart LR
    F[Faculty User] -->|1. Selects Class, Subject, Date| P1[1.0 Session Validation]
    P1 -->|Check Existing Session| D1[gmu_attendance]
    D1 -->|Existing Session Data / Null| P1
    
    P1 -->|Load Enrolled Class Roster| D2[gmu_students]
    D2 -->|Student List| P2[2.0 Attendance Marking UI]
    
    F -->|2. Toggle P/A or Mark All Present| P2
    P2 -->|3. Submit Attendance Records| P3[3.0 Conflict & Duplicate Filter]
    P3 -->|Save Verified Session Record| D1
    
    D1 -->|Read History| P4[4.0 Calculation & Defaulter Engine]
    P4 -->|Compute & Compare < 75%| P5[5.0 Alerts & Dashboard Rendering]
    P5 -->|Display Warning Badges| S[Student / Admin / Faculty UI]
```
