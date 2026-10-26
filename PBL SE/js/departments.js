/**
 * GM UNIVERSITY (GMU), DAVANAGERE - ATTENDANCE MANAGEMENT SYSTEM
 * Departments, Classes, and Subjects Module (departments.js)
 * Manages institutional hierarchy, department statistics, and dependency-protected operations.
 */

const DepartmentsManager = {
  // Utility for safe HTML escaping
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Retrieve all departments
  getDepartments() {
    return StorageManager.getDepartments();
  },

  // Find department by ID or Code
  getDepartmentById(id) {
    if (!id) return null;
    const depts = this.getDepartments();
    return depts.find(d => d.id === id || d.code === id) || null;
  },

  getDepartmentByCode(code) {
    if (!code) return null;
    const depts = this.getDepartments();
    return depts.find(d => d.code.toUpperCase() === code.toUpperCase()) || null;
  },

  // Validate and add new department
  addDepartment(deptData) {
    const errors = [];
    if (!deptData.name || deptData.name.trim().length < 3) {
      errors.push('Department Name must be at least 3 characters.');
    }

    if (!deptData.code || deptData.code.trim().length < 2) {
      errors.push('Department Code (e.g., ECE, CSE) is required.');
    } else {
      const codeUpper = deptData.code.trim().toUpperCase();
      const existing = this.getDepartmentByCode(codeUpper);
      if (existing) {
        errors.push(`Duplicate Department Code: "${codeUpper}" already exists.`);
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    const cleanCode = deptData.code.trim().toUpperCase();
    const newDept = {
      id: `DEP-${cleanCode}`,
      code: cleanCode,
      name: deptData.name.trim(),
      description: deptData.description ? deptData.description.trim() : `Department of ${deptData.name.trim()}`,
      status: deptData.status || 'Active',
      headOfDept: deptData.headOfDept ? deptData.headOfDept.trim() : 'TBA',
      createdAt: new Date().toISOString()
    };

    const depts = this.getDepartments();
    depts.push(newDept);
    StorageManager.saveDepartments(depts);

    return { success: true, department: newDept };
  },

  // Update existing department
  updateDepartment(id, updatedData) {
    const depts = this.getDepartments();
    const index = depts.findIndex(d => d.id === id);
    if (index === -1) {
      return { success: false, errors: ['Department not found.'] };
    }

    if (!updatedData.name || updatedData.name.trim().length < 3) {
      return { success: false, errors: ['Department Name must be at least 3 characters.'] };
    }

    depts[index] = {
      ...depts[index],
      name: updatedData.name.trim(),
      description: updatedData.description ? updatedData.description.trim() : depts[index].description,
      status: updatedData.status || depts[index].status,
      headOfDept: updatedData.headOfDept ? updatedData.headOfDept.trim() : depts[index].headOfDept
    };

    StorageManager.saveDepartments(depts);
    return { success: true, department: depts[index] };
  },

  // Safe delete with dependency protection
  deleteDepartment(id) {
    const dept = this.getDepartmentById(id);
    if (!dept) return { success: false, message: 'Department not found.' };

    // 1. Check for dependent students
    const students = StorageManager.getStudents();
    const linkedStudents = students.filter(s => s.departmentId === id || s.departmentCode === dept.code);
    if (linkedStudents.length > 0) {
      return {
        success: false,
        message: `Deletion Blocked: ${linkedStudents.length} student(s) are enrolled in ${dept.name} (${dept.code}). Please reassign or delete these students first.`
      };
    }

    // 2. Check for dependent faculty
    const faculty = StorageManager.getFaculty();
    const linkedFaculty = faculty.filter(f => f.departmentId === id || (f.authorizedDepartments && f.authorizedDepartments.includes(id)));
    if (linkedFaculty.length > 0) {
      return {
        success: false,
        message: `Deletion Blocked: ${linkedFaculty.length} faculty member(s) are assigned to ${dept.name}. Please reassign them first.`
      };
    }

    // 3. Check for dependent classes
    const classes = this.getClasses(id);
    if (classes.length > 0) {
      return {
        success: false,
        message: `Deletion Blocked: ${classes.length} class section(s) exist for ${dept.code}. Please remove them first.`
      };
    }

    // 4. Check for dependent subjects
    const subjects = this.getSubjects(id);
    if (subjects.length > 0) {
      return {
        success: false,
        message: `Deletion Blocked: ${subjects.length} course(s) are registered under ${dept.code}. Please remove them first.`
      };
    }

    if (!confirm(`Are you sure you want to permanently delete department ${dept.name} (${dept.code})?`)) {
      return { success: false, message: 'Action cancelled.' };
    }

    let depts = this.getDepartments();
    depts = depts.filter(d => d.id !== id);
    StorageManager.saveDepartments(depts);

    return { success: true, message: `Department ${dept.code} deleted successfully.` };
  },

  // =========================================================================
  // CLASS MANAGEMENT
  // =========================================================================
  getClasses(deptId = null) {
    const classes = StorageManager.getClasses();
    if (!deptId || deptId === 'ALL') return classes;
    return classes.filter(c => c.departmentId === deptId || c.departmentCode === deptId);
  },

  addClass(classData) {
    const errors = [];
    if (!classData.name || classData.name.trim().length < 2) {
      errors.push('Class / Section name (e.g., ECE-A) is required.');
    }
    if (!classData.departmentId) {
      errors.push('Please select a Department for this class.');
    }

    const dept = this.getDepartmentById(classData.departmentId);
    if (!dept) {
      errors.push('Invalid department selected.');
    }

    if (errors.length > 0) return { success: false, errors };

    const cleanName = classData.name.trim().toUpperCase();
    const classes = this.getClasses();
    const duplicate = classes.find(c => c.departmentId === dept.id && c.name.toUpperCase() === cleanName);
    if (duplicate) {
      return { success: false, errors: [`Class "${cleanName}" already exists in ${dept.code}.`] };
    }

    const newClass = {
      id: `CLS-${dept.code}-${classData.semester ? classData.semester.charAt(0) : '4'}${cleanName.replace(/[^a-zA-Z0-9]/g, '')}`,
      departmentId: dept.id,
      departmentCode: dept.code,
      name: cleanName,
      section: classData.section || cleanName.slice(-1) || 'A',
      semester: classData.semester || '4th Sem',
      academicYear: classData.academicYear || '2026-2027',
      courseProgram: classData.courseProgram || 'B.Tech'
    };

    classes.push(newClass);
    StorageManager.saveClasses(classes);
    return { success: true, classItem: newClass };
  },

  deleteClass(classId) {
    const students = StorageManager.getStudents();
    const classes = this.getClasses();
    const target = classes.find(c => c.id === classId);
    if (!target) return { success: false, message: 'Class not found.' };

    const enrolled = students.filter(s => s.classSection === target.name);
    if (enrolled.length > 0) {
      return {
        success: false,
        message: `Cannot delete class ${target.name}: ${enrolled.length} student(s) are currently enrolled in this section.`
      };
    }

    if (!confirm(`Are you sure you want to delete class ${target.name}?`)) {
      return { success: false, message: 'Action cancelled.' };
    }

    const updated = classes.filter(c => c.id !== classId);
    StorageManager.saveClasses(updated);
    return { success: true, message: `Class ${target.name} removed successfully.` };
  },

  // =========================================================================
  // SUBJECT MANAGEMENT
  // =========================================================================
  getSubjects(deptId = null) {
    const subjects = StorageManager.getSubjects();
    if (!deptId || deptId === 'ALL') return subjects;
    return subjects.filter(s => s.departmentId === deptId || s.departmentCode === deptId);
  },

  addSubject(subjectData) {
    const errors = [];
    if (!subjectData.name || subjectData.name.trim().length < 2) {
      errors.push('Course / Subject name is required.');
    }
    if (!subjectData.code || subjectData.code.trim().length < 2) {
      errors.push('Course Code (e.g. EC401) is required.');
    }
    if (!subjectData.departmentId) {
      errors.push('Please select a Department.');
    }

    const dept = this.getDepartmentById(subjectData.departmentId);
    if (!dept) errors.push('Invalid department selected.');

    if (errors.length > 0) return { success: false, errors };

    const cleanCode = subjectData.code.trim().toUpperCase();
    const subjects = this.getSubjects();
    const duplicate = subjects.find(s => s.code.toUpperCase() === cleanCode);
    if (duplicate) {
      return { success: false, errors: [`Course Code "${cleanCode}" already exists.`] };
    }

    const faculty = StorageManager.getFaculty();
    let facultyName = 'Unassigned';
    if (subjectData.facultyId) {
      const fac = faculty.find(f => f.facultyId === subjectData.facultyId);
      if (fac) facultyName = fac.name;
    }

    const newSubj = {
      id: `SUB-${cleanCode}`,
      code: cleanCode,
      name: subjectData.name.trim(),
      departmentId: dept.id,
      departmentCode: dept.code,
      semester: subjectData.semester || '4th Sem',
      facultyId: subjectData.facultyId || '',
      facultyName: facultyName
    };

    subjects.push(newSubj);
    StorageManager.saveSubjects(subjects);
    return { success: true, subject: newSubj };
  },

  deleteSubject(subjectId) {
    const subjects = this.getSubjects();
    const target = subjects.find(s => s.id === subjectId);
    if (!target) return { success: false, message: 'Course not found.' };

    const attendance = StorageManager.getAttendance();
    const sessionsUsing = attendance.filter(a => a.subjectCode === target.code || a.subject === target.name);
    if (sessionsUsing.length > 0) {
      return {
        success: false,
        message: `Cannot delete course ${target.name} (${target.code}): ${sessionsUsing.length} attendance record(s) are associated with it.`
      };
    }

    if (!confirm(`Are you sure you want to remove course ${target.name} (${target.code})?`)) {
      return { success: false, message: 'Action cancelled.' };
    }

    const updated = subjects.filter(s => s.id !== subjectId);
    StorageManager.saveSubjects(updated);
    return { success: true, message: `Course ${target.code} removed successfully.` };
  },

  // =========================================================================
  // DEPARTMENT-SPECIFIC METRICS & ANALYTICS
  // =========================================================================
  getDepartmentStats(deptId) {
    const dept = this.getDepartmentById(deptId);
    const allStudents = StorageManager.getStudents();
    const allFaculty = StorageManager.getFaculty();
    const allAttendance = StorageManager.getAttendance();
    const classes = this.getClasses(deptId);
    const subjects = this.getSubjects(deptId);

    // Filter students by department
    const deptStudents = allStudents.filter(s => s.departmentId === deptId || (dept && s.departmentCode === dept.code));

    // Filter faculty who belong to or are authorized for this department
    const deptFaculty = allFaculty.filter(f => 
      f.departmentId === deptId || 
      (f.authorizedDepartments && f.authorizedDepartments.includes(deptId)) ||
      (dept && f.departmentCode === dept.code)
    );

    // Filter attendance sessions for this department
    const deptAttendance = allAttendance.filter(a => a.departmentId === deptId || (dept && a.departmentCode === dept.code));

    // Calculate today's average attendance %
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySessions = deptAttendance.filter(a => a.date === todayStr);

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
      : 86; // Benchmark default

    // Detect low-attendance students (< 75%) within this department
    const lowAttendanceList = [];
    deptStudents.forEach(s => {
      const stats = StudentsManager.getStudentAttendanceStats(s.usn);
      if (stats.isLowAttendance) {
        lowAttendanceList.push({ student: s, stats: stats });
      }
    });

    return {
      department: dept,
      totalStudents: deptStudents.length,
      totalFaculty: deptFaculty.length,
      totalClasses: classes.length,
      totalSubjects: subjects.length,
      totalSessions: deptAttendance.length,
      todayAttendancePercentage: todayPercentage,
      lowAttendanceCount: lowAttendanceList.length,
      lowAttendanceList: lowAttendanceList,
      recentSessions: deptAttendance.slice(0, 6)
    };
  }
};
