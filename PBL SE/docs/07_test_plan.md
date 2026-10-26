# Software Verification & Test Plan

**Project:** GM University Student Attendance Management System  
**Test Scope:** Unit, Integration, and System Verification of Core Modules (`auth.js`, `students.js`, `faculty.js`, `attendance.js`, `storage.js`)  
**Target Quality Goal:** Zero Console Errors, 100% Core Test Case Pass Rate  

---

## 1. Test Strategy & Traceability Matrix

Testing was performed across functional boundaries using boundary value analysis, negative input injection, role-mismatch detection, duplicate key assertion, and mathematical compliance validation for attendance percentage formulas.

---

## 2. Test Execution Results (18 Test Cases)

| Test ID | Module / Function | Test Description | Input Data | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | `auth.js` | Valid Administrator login | User: `admin`<br>Pass: `admin123`<br>Role: `admin` | Authentication succeeds; session stored in `gmu_current_user`; redirected to `admin-dashboard.html`. | User authenticated; redirected to Admin dashboard. | **PASSED** |
| **TC-02** | `auth.js` | Invalid password handling | User: `admin`<br>Pass: `wrongpass`<br>Role: `admin` | Authentication fails; error message displayed: "Invalid credentials." | Error displayed; no session saved. | **PASSED** |
| **TC-03** | `auth.js` | Role mismatch prevention | User: `admin`<br>Pass: `admin123`<br>Role: `student` | Login rejected; error explains account belongs to Admin, not Student role. | Error message highlights role mismatch; redirects blocked. | **PASSED** |
| **TC-04** | `auth.js` | Unauthenticated direct dashboard access guard | Direct navigation to `admin-dashboard.html` without session | System intercepts request; redirects to `index.html?error=unauthorized`. | Direct access prevented; redirected to portal login. | **PASSED** |
| **TC-05** | `students.js` | Enroll new valid student | Name: `Sumanth Rao`<br>USN: `4GM22CS088`<br>Class: `CSE-A`<br>Dept: `CSE` | Student added to `gmu_students`; auto-account created in `gmu_users`; table updates. | Student enrolled; login credentials activated. | **PASSED** |
| **TC-06** | `students.js` | Duplicate USN rejection | USN: `4GM22CS001` (already exists in seed database) | Enrollment blocked; error returned: "Duplicate USN Error: A student with USN already exists." | Error caught; record insertion rejected. | **PASSED** |
| **TC-07** | `students.js` | Student name length validation | Name: `Al`<br>USN: `4GM22CS099` | Rejected with validation error: "Full Name must be at least 3 characters." | Form highlights validation error. | **PASSED** |
| **TC-08** | `students.js` | Automatic user account creation verification | Student with USN `4GM22CS088` created | Account exists in `gmu_users` with `username: "4GM22CS088"` and default password `"student123"`. | Account created; student can log in immediately. | **PASSED** |
| **TC-09** | `faculty.js` | Appoint new faculty member | ID: `GMU-FAC-06`<br>Name: `Dr. Ramesh N.`<br>Dept: `CSE`<br>Subject: `Cloud Computing`<br>Email: `ramesh.n@gmu.ac.in` | Faculty added to `gmu_faculty`; user account auto-generated (`ramesh.n` / `faculty123`). | Faculty listed; account created with designated subject. | **PASSED** |
| **TC-10** | `faculty.js` | Update faculty details | Update subject for `GMU-FAC-02` to "Advanced Database Systems" | Updated in `gmu_faculty` and synchronized across user profiles without duplicate IDs. | Changes saved; table displays updated subject. | **PASSED** |
| **TC-11** | `attendance.js`| Load student roster for class | Select Class: `CSE-A` | System returns exactly the 10 registered students belonging to `CSE-A`. | Exactly 10 student cards loaded in attendance marking grid. | **PASSED** |
| **TC-12** | `attendance.js`| Shortcut "Mark All Present" | Click "Mark All Present" button | All loaded students have status set to "Present" with green card highlight; counter shows 10 Present, 0 Absent. | All cards turn green; counters update synchronously. | **PASSED** |
| **TC-13** | `attendance.js`| Prevent duplicate attendance session | Class: `CSE-A`<br>Subject: `Software Engineering`<br>Date: `2026-10-24` | System detects pre-existing session; warns user and prompts for overwrite confirmation. | Confirmation dialog shown; prevents silent duplicate entry. | **PASSED** |
| **TC-14** | `attendance.js`| Calculate overall student attendance % | Student attended 1 out of 5 classes (Harsha Vardhan `4GM22CS006`) | Percentage formula: $(1/5) \times 100 = 20\%$. | Calculated as exactly 20%; flag set to Low Attendance. | **PASSED** |
| **TC-15** | `attendance.js`| Low attendance (< 75%) alert trigger | Student with attendance $= 20\%$ viewed in Student / Admin dashboard | Display bold red alert banner, pulse animation, and "At Risk (<75%)" warning badge. | Red alert shown on dashboard; student listed in defaulters. | **PASSED** |
| **TC-16** | `attendance.js`| Export attendance register to CSV | Click "Export CSV" on Master Attendance view | Generates and triggers browser download of `GMU_Master_Attendance.csv` with standard RFC-4180 headers. | Valid `.csv` file downloaded containing session logs. | **PASSED** |
| **TC-17** | `storage.js` | Reset system to default demo dataset | Click "Reset to Demo Data" in Admin System Maintenance | Replaces modified `localStorage` data with fresh seed dataset (24 students, 5 faculty). | Success toast displayed; all metrics return to baseline. | **PASSED** |
| **TC-18** | `auth.js` | Terminate session (Logout) | Click "Logout" button from any dashboard | Clears `gmu_current_user` from `localStorage`; redirects user to `index.html`. | Session cleared; back navigation cannot view dashboard. | **PASSED** |

---

## 3. Test Summary & Conclusions
- **Total Test Cases Executed:** 18
- **Total Passed:** 18
- **Total Failed:** 0
- **Quality Verdict:** All acceptance criteria satisfied. Zero runtime console errors detected. System exhibits high resilience against duplicate data and unauthorized role escalation.
