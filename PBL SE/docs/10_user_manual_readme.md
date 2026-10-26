# User Manual, Setup Guide & Demonstration Credentials

**Project:** GM University Student Attendance Management System  
**Portal Webpage:** `index.html`  
**Compatibility:** Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari  

---

## 1. Quick Setup & Execution Steps

### Zero Build Step Required
This web application is built strictly using standard HTML5, CSS3, and ES6 JavaScript. It runs locally without needing Node.js, npm, npm install, Apache, or Python.

1. **Locate the project folder:**
   ```text
   C:\Users\Pavitra M K\.gemini\antigravity\scratch\gmu-attendance-system\
   ```
2. **Launch the application:**
   - Double-click `index.html` in Windows File Explorer, **OR**
   - Right-click `index.html` &rarr; *Open with* &rarr; *Google Chrome* (or *Microsoft Edge*).
3. **Automatic Data Initialization:**
   - On first launch, the application automatically seeds your browser's `localStorage` with:
     - 24 realistic enrolled students across 3 batches (`CSE-A`, `CSE-B`, `ISE-A`)
     - 5 active faculty members with assigned courses
     - Multi-date lecture attendance records
     - Linked user authentication accounts

---

## 2. Demonstration Login Credentials

The portal login page (`index.html`) includes **1-Click Auto Login Buttons** for instant evaluator testing without manual typing. Alternatively, enter the credentials below:

| Role | Username | Password | Persona & Purpose | Notes / Features to Verify |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Dr. S. B. Shivakumar<br>*(Dean & Principal Administrator)* | Full control: University stats, enroll student, add/edit faculty, master attendance, low-attendance count, data reset. |
| **Faculty** | `rajesh.kumar` | `faculty123` | Dr. Rajesh Kumar<br>*(Dept. of CSE - Software Engg)* | Mark attendance for `CSE-A`, "Mark All Present", check duplicate entry alert, view lecture history, class roster. |
| **Faculty (Alt)** | `ananya.sharma` | `faculty123` | Prof. Ananya Sharma<br>*(Dept. of CSE - DBMS)* | Course instructor for Database Systems (`CSE-A`). |
| **Student (Normal)** | `4GM22CS054` | `student123` | Sneha Patil<br>*(4th Sem, CSE-B)* | Normal compliance (>75% attendance); subject breakdown cards; chronological session logs; CSV export. |
| **Student (Defaulter Demo)**| `4GM22CS006` | `student123` | Harsha Vardhan K.<br>*(4th Sem, CSE-A)* | **Low Attendance Alert Showcase:** Attendance is **22% (<75%)**; triggers prominent red warning box and risk alert. |

---

## 3. Guide to Taking Screenshots for the 12-Page PBL Report

When compiling the final college project report, take high-resolution screenshots of the following 6 key screens:

1. **Screenshot 1: Portal Landing & Authentication Screen (`index.html`)**
   - *Caption:* Figure 1: Official GM University Attendance Portal Login with role selector and 1-click test accounts.
   - *Tip:* Ensure the GM University gold & maroon header and accreditation banner are clearly visible.

2. **Screenshot 2: Administrator Analytics & Defaulters Overview (`admin-dashboard.html`)**
   - *Caption:* Figure 2: Executive Admin Dashboard displaying real-time enrollment stats, turnout percentage, and low-attendance alert.

3. **Screenshot 3: Student Management & Enrollment Modal (`admin-dashboard.html` &rarr; Tab 2)**
   - *Caption:* Figure 3: Student Enrollment Interface featuring USN validation and automatic login account generation.

4. **Screenshot 4: Faculty Daily Attendance Register (`faculty-dashboard.html` &rarr; Tab 1)**
   - *Caption:* Figure 4: Daily Lecture Attendance Marking Screen showing student toggles, "Mark All Present", and counters.

5. **Screenshot 5: Duplicate Entry Prevention Notice (`faculty-dashboard.html`)**
   - *Caption:* Figure 5: System duplicate prevention warning when attempting to re-record an existing lecture session.

6. **Screenshot 6: Student Self-Service Dashboard with Low Attendance Alert (`student-dashboard.html`)**
   - *Caption:* Figure 6: Student Self-Service View for USN `4GM22CS006` illustrating the critical `< 75%` attendance warning box and subject progress bars.
