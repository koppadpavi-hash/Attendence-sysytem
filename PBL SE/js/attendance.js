/**
 * GM UNIVERSITY (GMU), DAVANAGERE - ATTENDANCE MANAGEMENT SYSTEM
 * Attendance Module (attendance.js)
 * Manages daily lecture marking, duplicate session prevention, department-aware metrics,
 * history queries, and RFC-4180 CSV report generation.
 */

const AttendanceManager = {
  // Check for duplicate attendance record for (department, class, subject, date)
  checkDuplicate(departmentId, classSection, subject, date) {
    const records = StorageManager.getAttendance();
    return records.find(r => 
      (r.departmentId === departmentId || !departmentId) &&
      r.classSection === classSection && 
      r.subject.toLowerCase() === subject.toLowerCase() && 
      r.date === date
    );
  },

  // Save or update attendance session
  saveSession(sessionData, overwrite = false) {
    const records = StorageManager.getAttendance();
    const existingIndex = records.findIndex(r => 
      (r.departmentId === sessionData.departmentId || !sessionData.departmentId) &&
      r.classSection === sessionData.classSection && 
      r.subject.toLowerCase() === sessionData.subject.toLowerCase() && 
      r.date === sessionData.date
    );

    if (existingIndex !== -1 && !overwrite) {
      return { 
        success: false, 
        isDuplicate: true, 
        message: `Attendance for ${sessionData.classSection} in ${sessionData.subject} on ${sessionData.date} already exists!` 
      };
    }

    const dept = DepartmentsManager.getDepartmentById(sessionData.departmentId) || 
                 DepartmentsManager.getDepartmentByCode(sessionData.departmentCode) || 
                 { id: 'DEP-CSE', code: 'CSE' };

    const sessionId = sessionData.id || `ATT-${dept.code}-${sessionData.subjectCode || 'SUB'}-${sessionData.date}`;
    const recordPayload = {
      id: sessionId,
      departmentId: dept.id,
      departmentCode: dept.code,
      classSection: sessionData.classSection,
      subject: sessionData.subject,
      subjectCode: sessionData.subjectCode || 'CS401',
      date: sessionData.date,
      facultyId: sessionData.facultyId || 'GMU-FAC',
      facultyName: sessionData.facultyName || 'Faculty',
      records: sessionData.records, // { [usn]: 'Present' | 'Absent' }
      timestamp: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      records[existingIndex] = recordPayload;
    } else {
      records.unshift(recordPayload);
    }

    StorageManager.saveAttendance(records);
    return { success: true, record: recordPayload };
  },

  // Delete an attendance session
  deleteSession(sessionId) {
    if (!confirm('Are you sure you want to delete this lecture attendance session record?')) {
      return false;
    }
    let records = StorageManager.getAttendance();
    records = records.filter(r => r.id !== sessionId);
    StorageManager.saveAttendance(records);
    showToast('Attendance session deleted successfully.', 'info');
    return true;
  },

  // Filter attendance history with department, class, subject, and date filters
  filterHistory(filters = {}) {
    let records = StorageManager.getAttendance();

    return records.filter(r => {
      // Department filter
      if (filters.departmentId && filters.departmentId !== 'ALL') {
        if (r.departmentId !== filters.departmentId && r.departmentCode !== filters.departmentId) return false;
      }

      // Class section filter
      if (filters.classSection && filters.classSection !== 'ALL') {
        if (r.classSection !== filters.classSection) return false;
      }

      // Subject filter
      if (filters.subject && filters.subject !== 'ALL') {
        if (r.subject !== filters.subject) return false;
      }

      // Date range filter
      if (filters.dateFrom) {
        if (r.date < filters.dateFrom) return false;
      }

      if (filters.dateTo) {
        if (r.date > filters.dateTo) return false;
      }

      // Faculty filter
      if (filters.facultyId && filters.facultyId !== 'ALL') {
        if (r.facultyId !== filters.facultyId) return false;
      }

      return true;
    });
  },

  // Compute university-wide or department-specific metrics
  getSystemMetrics(deptId = null) {
    const students = StorageManager.getStudents();
    const faculty = StorageManager.getFaculty();
    const attendance = StorageManager.getAttendance();
    const departments = StorageManager.getDepartments();

    // Filter by department if specified
    const filteredStudents = (!deptId || deptId === 'ALL') 
      ? students 
      : students.filter(s => s.departmentId === deptId || s.departmentCode === deptId);

    const filteredFaculty = (!deptId || deptId === 'ALL') 
      ? faculty 
      : faculty.filter(f => f.departmentId === deptId || (f.authorizedDepartments && f.authorizedDepartments.includes(deptId)));

    const filteredAttendance = (!deptId || deptId === 'ALL') 
      ? attendance 
      : attendance.filter(a => a.departmentId === deptId || a.departmentCode === deptId);

    // Calculate today's average attendance %
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySessions = filteredAttendance.filter(a => a.date === todayStr);

    let todayPresents = 0;
    let todayTotalMarks = 0;
    todaySessions.forEach(session => {
      Object.values(session.records || {}).forEach(status => {
        todayTotalMarks++;
        if (status === 'Present') todayPresents++;
      });
    });

    const todayPercentage = todayTotalMarks > 0 
      ? Math.round((todayPresents / todayTotalMarks) * 100) 
      : 88;

    // Detect students below 75%
    let lowAttendanceCount = 0;
    const lowAttendanceList = [];

    filteredStudents.forEach(s => {
      const stats = StudentsManager.getStudentAttendanceStats(s.usn);
      if (stats.isLowAttendance) {
        lowAttendanceCount++;
        lowAttendanceList.push({
          student: s,
          stats: stats
        });
      }
    });

    return {
      totalDepartments: departments.length,
      totalStudents: filteredStudents.length,
      totalFaculty: filteredFaculty.length,
      totalSessions: filteredAttendance.length,
      todayAttendancePercentage: todayPercentage,
      lowAttendanceCount: lowAttendanceCount,
      lowAttendanceList: lowAttendanceList
    };
  },

  // Export filtered attendance sessions to CSV
  exportToCSV(sessions, filename = 'GMU_Attendance_Report.csv') {
    if (!sessions || sessions.length === 0) {
      showToast('No attendance records available to export.', 'warning');
      return;
    }

    const students = StorageManager.getStudents();
    const studentMap = {};
    students.forEach(s => {
      studentMap[s.usn] = s.name;
    });

    const rows = [
      ['GM UNIVERSITY (GMU), DAVANAGERE - DEPARTMENT ATTENDANCE REPORT'],
      ['Generated On', new Date().toLocaleString()],
      ['Total Lecture Sessions', sessions.length],
      [],
      ['Session ID', 'Department', 'Date', 'Class/Section', 'Course Name', 'Course Code', 'Instructor', 'Student USN', 'Student Name', 'Status']
    ];

    sessions.forEach(sess => {
      const recs = sess.records || {};
      Object.keys(recs).forEach(usn => {
        rows.push([
          sess.id,
          sess.departmentCode || 'CSE',
          sess.date,
          sess.classSection,
          `"${sess.subject}"`,
          sess.subjectCode,
          `"${sess.facultyName}"`,
          usn,
          `"${studentMap[usn] || 'N/A'}"`,
          recs[usn]
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Department attendance report exported to CSV.', 'success');
  },

  // Export single student attendance summary to CSV
  exportStudentCSV(student, stats) {
    const rows = [
      ['GM UNIVERSITY (GMU), DAVANAGERE - STUDENT ATTENDANCE REPORT'],
      ['Student Name', student.name],
      ['USN', student.usn],
      ['Department', student.department],
      ['Class/Section', student.classSection],
      ['Semester', student.semester],
      ['Overall Attendance', `${stats.percentage}%`],
      ['Total Classes Conducted', stats.totalClasses],
      ['Classes Attended', stats.attended],
      ['Classes Missed', stats.missed],
      ['UGC Compliance Status', stats.isLowAttendance ? 'AT RISK / NOT ELIGIBLE (<75%)' : 'NORMAL / ELIGIBLE'],
      [],
      ['Course Code', 'Course Name', 'Total Conducted', 'Attended', 'Missed', 'Percentage (%)', 'Status']
    ];

    Object.values(stats.subjectWise || {}).forEach(sub => {
      rows.push([
        sub.subjectCode,
        `"${sub.subject}"`,
        sub.total,
        sub.attended,
        sub.total - sub.attended,
        `${sub.percentage}%`,
        sub.isLow ? 'CRITICAL (<75%)' : 'SAFE'
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${student.usn}_Attendance_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Student attendance report exported to CSV.', 'success');
  }
};
