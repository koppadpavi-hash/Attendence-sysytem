# Problem Statement and Objectives

**Project Title:** Student Attendance Management System  
**Institution:** GM University (GMU), Davanagere, Karnataka  
**Academic Program:** Bachelor of Technology (B.Tech) - Computer Science & Engineering  
**Curricular Context:** Software Engineering Project-Based Learning (PBL)  

---

## 1. Problem Statement
In higher education institutions like GM University, monitoring student course attendance is crucial for both academic rigor and regulatory compliance. University statutory bodies (e.g., UGC, AICTE, and State University Acts) mandate that every student maintain a minimum of 75% attendance in theory and laboratory courses to qualify for Semester-End Examinations (SEE).

Historically, attendance in colleges has been recorded using physical roll-call registers and pen-and-paper ledgers. This legacy process suffers from severe systemic challenges:
1. **Inefficient Lecture Time Utilization:** Taking attendance manually for batches of 60+ students consumes 7 to 10 minutes per lecture hour, totaling hundreds of lost instructional hours per semester.
2. **Error-Prone and Vulnerable to Proxy:** Paper records are prone to human calculation errors, physical register loss, proxy marking, and tampering.
3. **Delayed Defaulter Identification:** Calculating student attendance percentages is typically done manually at the end of each month. Consequently, students and academic mentors only learn of attendance shortages when it is too late to recover.
4. **Lack of Transparency:** Students lack on-demand visibility into their attendance records across subjects, leading to disputes during exam hall ticket clearance.
5. **No Centralized Data Audit Trail:** Department Heads and Deans lack immediate access to aggregate turnout trends across faculty lectures, classes, and departments.

---

## 2. Project Objectives
The primary objective of this project is to develop a lightweight, dependable, client-side web application tailored to GM University's academic workflow and visual identity.

### Specific Objectives:
1. **Digital Attendance Automation:** Enable faculty to record course attendance in under 30 seconds with automated bulk shortcuts ("Mark All Present") and duplicate entry prevention.
2. **Real-Time 75% Attendance Compliance Alerts:** Dynamically calculate overall and subject-wise percentages, immediately triggering visual warning alerts and defaulter reports for any student below 75%.
3. **Role-Based Access Control (RBAC):** Provide tailored, authenticated dashboards for three distinct university stakeholders:
   - **Administrator:** Campus analytics, batch health, student enrollment, faculty allocations, and data recovery.
   - **Faculty:** Subject-wise register, past session histories, class rosters, and defaulter tracking.
   - **Student:** Real-time personal attendance dashboard, subject breakdown progress bars, and chronological lecture logs.
4. **Institutional Brand Replication:** Mirror the official visual identity of the GM University portal (`https://www.gmu.ac.in/`), using official Betel Nut Brown (`#4A121A`) and Gold (`#E3B559`) styling, university typography, and responsive layouts.
5. **Zero-Dependency Architecture:** Build the complete system using pure HTML5, CSS3, and vanilla JavaScript storing data in structured `localStorage` keys, ensuring the portal runs standalone without requiring external servers or database installations.
6. **Reporting and Portability:** Provide one-click CSV report exports and printable rosters for university administrative audits.
