# Team Contribution Matrix (4-Member Team)

**Project:** Student Attendance Management System  
**Institution:** GM University (GMU), Davanagere  
**Department:** Computer Science & Engineering (B.Tech)  
**Academic Year:** 2026–2027  

---

## 1. Project Team Work Breakdown Structure

| Member Name | Role | Primary Assigned Module | Specific Tasks & Deliverables Completed | Contribution % |
| :--- | :--- | :--- | :--- | :--- |
| **Team Member 1** *(Lead)* | System Architect & Full-Stack Developer | **Architecture & Storage Module** (`storage.js`, `index.html`) | • Designed modular client-side architecture and `StorageManager` API.<br>• Designed isolated localStorage schemas (`gmu_users`, `gmu_students`, `gmu_faculty`, `gmu_attendance`).<br>• Synthesized realistic seed dataset (24+ students, 5 faculty, 4 subjects).<br>• Created University portal gateway & login page with 1-click test chips.<br>• Drafted System Architecture and ER/DFD diagrams. | **25%** |
| **Team Member 2** | Frontend & UI/UX Designer | **Visual Identity & Design System** (`style.css`, SVG Assets) | • Studied live GM University portal (`https://www.gmu.ac.in/`) layout, fonts, and colors.<br>• Developed custom vector SVGs: `gmu-logo.svg` and `gmu-crest.svg`.<br>• Created responsive CSS design system matching Betel Nut Brown (`#4A121A`) and Gold (`#E3B559`).<br>• Styled responsive tables, modal windows, alert boxes, and progress bars.<br>• Authored print stylesheet (`@media print`) and UI responsiveness across breakpoints. | **25%** |
| **Team Member 3** | Core Logic Developer | **Entity Management & Security** (`auth.js`, `students.js`, `faculty.js`) | • Implemented 3-role authentication engine and route guards (`requireAuth`).<br>• Built Student CRUD with USN uniqueness validation and duplicate blocking.<br>• Engineered automatic account creation pipeline for new students and faculty.<br>• Built Faculty CRUD with profile edit modal and subject allocation synchronization.<br>• Authored SRS specification and Role-Based Use-Case model. | **25%** |
| **Team Member 4** | Business Logic & QA Lead | **Attendance Engine & Testing** (`attendance.js`, `docs/07_test_plan.md`) | • Built daily attendance marking interface with "Mark All Present" shortcut.<br>• Implemented duplicate session detection and overwrite protection.<br>• Programmed mathematical engine for overall and subject-wise percentages.<br>• Developed real-time 75% low attendance alert triggers and defaulter reports.<br>• Implemented RFC-4180 CSV export and executed all 18 verification test cases. | **25%** |

---

## 2. Team Collaboration & Version Control Guidelines
- **Modularity Principle:** Each developer worked on independent JavaScript module files (`auth.js`, `students.js`, `faculty.js`, `attendance.js`, `storage.js`), preventing code merge conflicts.
- **Peer Code Reviews:** Every major sprint milestone required validation against the 18 test cases before merging into the main working folder.
- **PBL Report Alignment:** All 4 members contributed equally to the 12-page academic report, cross-referencing functional requirements and UML diagrams with the running code.
