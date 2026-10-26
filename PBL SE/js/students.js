/**
 * GM UNIVERSITY (GMU), DAVANAGERE - ATTENDANCE MANAGEMENT SYSTEM
 * Students Management Module (students.js)
 * Robust CRUD, Duplicate Prevention, Course Mapping, and Attendance Calculation Engine.
 */

const StudentsManager = {
  // Validate student inputs
  validateStudent(data, isEdit = false, originalUsn = '') {
    const errors = [];

    if (!data.name || data.name.trim().length < 3) {
      errors.push('Full Name must be at least 3 characters.');
    }

    if (!data.usn || data.usn.trim().length < 5) {
      errors.push('Valid University Seat Number (USN) is required.');
    } else {
      const usnUpper = data.usn.trim().toUpperCase();
      const existing = StorageManager.getStudents();
      const duplicate = existing.find(s => s.usn.toUpperCase() === usnUpper);
      
      if (duplicate && (!isEdit || originalUsn.toUpperCase() !== usnUpper)) {
        errors.push(`Duplicate USN: A student with USN "${usnUpper}" is already enrolled.`);
      }
    }

    if (!data.classSection) {
      errors.push('Please select Class / Section.');
    }

    if (!data.department) {
      errors.push('Please select Academic Department.');
    }

    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.push('Please enter a valid email address.');
    }

    return errors;
  },

  // Add new student with automatic course and session synchronization
  addStudent(studentData) {
    const errors = this.validateStudent(studentData);
    if (errors.length > 0) {
      return { success: false, errors };
    }

    const students = StorageManager.getStudents();
    const cleanUsn = studentData.usn.trim().toUpperCase();

    const newStudent = {
      usn: cleanUsn,
      name: studentData.name.trim(),
      classSection: studentData.classSection,
      semester: studentData.semester || '4th Sem',
      department: studentData.department,
      email: studentData.email ? studentData.email.trim() : `${cleanUsn.toLowerCase()}@student.gmu.ac.in`,
      phone: studentData.phone ? studentData.phone.trim() : 'N/A',
      createdAt: new Date().toISOString()
    };

    students.push(newStudent);
    StorageManager.saveStudents(students);

    // Auto-create login account for student
    StorageManager.autoCreateStudentAccount(newStudent);

    // Synchronize into existing class attendance records so student has baseline records
    const attendance = StorageManager.getAttendance();
    let updatedAttendance = false;

    attendance.forEach(session => {
      if (session.classSection === newStudent.classSection) {
        if (!session.records) session.records = {};
        if (session.records[cleanUsn] === undefined) {
          // Default new student as Present in past class sessions so they start in good standing
          session.records[cleanUsn] = 'Present';
          updatedAttendance = true;
        }
      }
    });

    if (updatedAttendance) {
      StorageManager.saveAttendance(attendance);
    }

    return { success: true, student: newStudent };
  },

  // Delete student
  deleteStudent(usn) {
    if (!confirm(`Are you sure you want to remove student ${usn}? Their login account will also be deleted.`)) {
      return false;
    }

    let students = StorageManager.getStudents();
    students = students.filter(s => s.usn.toUpperCase() !== usn.toUpperCase());
    StorageManager.saveStudents(students);

    // Clean up login account
    let users = StorageManager.getUsers();
    users = users.filter(u => !u.usn || u.usn.toUpperCase() !== usn.toUpperCase());
    StorageManager.saveUsers(users);

    // Clean up attendance maps
    let attendance = StorageManager.getAttendance();
    attendance.forEach(sess => {
      if (sess.records && sess.records[usn]) {
        delete sess.records[usn];
      }
    });
    StorageManager.saveAttendance(attendance);

    showToast(`Student ${usn} removed successfully.`, 'info');
    return true;
  },

  // Get default registered subjects for a class section
  getClassSubjects(classSection) {
    const faculty = StorageManager.getFaculty();
    const attendance = StorageManager.getAttendance();
    const subjectsMap = {};

    // 1. From Faculty assignments
    faculty.forEach(f => {
      if (f.assignedClass === classSection || f.assignedClass === 'All') {
        subjectsMap[f.subject] = {
          subject: f.subject,
          subjectCode: f.subjectCode || 'CS401',
          facultyName: f.name
        };
      }
    });

    // 2. From conducted sessions
    attendance.forEach(s => {
      if (s.classSection === classSection && !subjectsMap[s.subject]) {
        subjectsMap[s.subject] = {
          subject: s.subject,
          subjectCode: s.subjectCode || 'CS401',
          facultyName: s.facultyName || 'Faculty'
        };
      }
    });

    // 3. Fallback defaults if new class
    if (Object.keys(subjectsMap).length === 0) {
      subjectsMap['Software Engineering'] = { subject: 'Software Engineering', subjectCode: 'CS401', facultyName: 'Dr. Rajesh Kumar' };
      subjectsMap['Database Management Systems'] = { subject: 'Database Management Systems', subjectCode: 'CS402', facultyName: 'Prof. Ananya Sharma' };
      subjectsMap['Operating Systems'] = { subject: 'Operating Systems', subjectCode: 'CS403', facultyName: 'Prof. Priya Deshmukh' };
    }

    return subjectsMap;
  },

  // Calculate comprehensive attendance statistics for any student
  getStudentAttendanceStats(usn) {
    const students = StorageManager.getStudents();
    const student = students.find(s => s.usn.toUpperCase() === usn.toUpperCase());
    const attendanceRecords = StorageManager.getAttendance();

    let totalClasses = 0;
    let attended = 0;
    const subjectWise = {};

    // Pre-populate with all subjects registered for this student's class
    if (student) {
      const classSubjects = this.getClassSubjects(student.classSection);
      Object.keys(classSubjects).forEach(subName => {
        const item = classSubjects[subName];
        subjectWise[subName] = {
          subject: item.subject,
          subjectCode: item.subjectCode,
          facultyName: item.facultyName,
          total: 0,
          attended: 0,
          percentage: 100, // Starts at 100% until absences occur
          isLow: false
        };
      });
    }

    // Now compute actual attended / conducted
    attendanceRecords.forEach(session => {
      if (session.records && session.records[usn] !== undefined) {
        totalClasses++;
        const status = session.records[usn];
        if (status === 'Present') {
          attended++;
        }

        const subj = session.subject;
        if (!subjectWise[subj]) {
          subjectWise[subj] = {
            subject: subj,
            subjectCode: session.subjectCode || 'GEN',
            facultyName: session.facultyName || 'Faculty',
            total: 0,
            attended: 0
          };
        }

        subjectWise[subj].total++;
        if (status === 'Present') {
          subjectWise[subj].attended++;
        }
      }
    });

    // Calculate subject-wise percentages
    Object.keys(subjectWise).forEach(k => {
      const s = subjectWise[k];
      if (s.total > 0) {
        s.percentage = Math.round((s.attended / s.total) * 100);
        s.isLow = s.percentage < 75;
      } else {
        s.percentage = 100; // No missed classes yet
        s.isLow = false;
        s.isNew = true;
      }
    });

    const percentage = totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 100;
    const isLowAttendance = totalClasses > 0 && percentage < 75;

    return {
      totalClasses,
      attended,
      missed: totalClasses - attended,
      percentage,
      isLowAttendance,
      isNewAdmission: totalClasses === 0,
      subjectWise
    };
  },

  // Filter students
  filterStudents(students, filters = {}) {
    return students.filter(s => {
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesUsn = s.usn.toLowerCase().includes(q);
        const matchesClass = s.classSection.toLowerCase().includes(q);
        if (!matchesName && !matchesUsn && !matchesClass) return false;
      }

      if (filters.department && filters.department !== 'ALL') {
        if (s.department !== filters.department) return false;
      }

      if (filters.classSection && filters.classSection !== 'ALL') {
        if (s.classSection !== filters.classSection) return false;
      }

      if (filters.onlyLowAttendance) {
        const stats = this.getStudentAttendanceStats(s.usn);
        if (!stats.isLowAttendance) return false;
      }

      return true;
    });
  },

  // Render Students Table with Direct "View Dashboard" Action
  renderStudentsTable(tableBodyEl, studentsList, canDelete = true) {
    if (!tableBodyEl) return;

    if (studentsList.length === 0) {
      tableBodyEl.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 28px; color: var(--gmu-text-muted);">
            No students found matching your criteria. Click "+ Add New Student" to enroll.
          </td>
        </tr>
      `;
      return;
    }

    tableBodyEl.innerHTML = studentsList.map((s, idx) => {
      const stats = this.getStudentAttendanceStats(s.usn);
      const isLow = stats.isLowAttendance;
      
      let statusBadge = `<span class="badge badge-safe">✓ Eligible (${stats.percentage}%)</span>`;
      if (stats.isNewAdmission) {
        statusBadge = `<span class="badge" style="background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD;">New Enrolled (100%)</span>`;
      } else if (isLow) {
        statusBadge = `<span class="badge badge-warning">⚠ At Risk (${stats.percentage}%)</span>`;
      }

      return `
        <tr>
          <td>${idx + 1}</td>
          <td>
            <a href="student-dashboard.html?usn=${s.usn}" style="font-weight: 800; color: var(--gmu-primary); font-family: monospace; text-decoration: underline;" title="Open Student Dashboard">
              ${s.usn}
            </a>
          </td>
          <td>
            <strong>${s.name}</strong>
            <div style="font-size: 0.78rem; color: var(--gmu-text-muted);">${s.email}</div>
          </td>
          <td><span class="meta-pill">${s.classSection}</span></td>
          <td>${s.semester}</td>
          <td>
            <div>${statusBadge}</div>
            <div style="font-size: 0.75rem; color: var(--gmu-text-muted); margin-top: 3px;">
              ${stats.attended}/${stats.totalClasses} classes
            </div>
          </td>
          <td>
            <div style="display: flex; gap: 6px; align-items: center;">
              <a href="student-dashboard.html?usn=${s.usn}" class="btn btn-outline-primary btn-sm" title="View Student Dashboard" style="padding: 5px 9px;">
                👁 View
              </a>
              ${canDelete ? `
                <button class="btn btn-danger btn-sm" onclick="handleDeleteStudent('${s.usn}')" title="Delete Student" style="padding: 5px 9px;">
                  ✕
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
};
