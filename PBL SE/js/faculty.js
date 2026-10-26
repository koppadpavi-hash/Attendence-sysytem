/**
 * GM UNIVERSITY (GMU), DAVANAGERE - ATTENDANCE MANAGEMENT SYSTEM
 * Faculty Management Module (faculty.js)
 * Handles Faculty CRUD, Multi-Department Authorization, Subject Allocations,
 * User Account Synchronization, and Department-Scoped Filtering.
 */

const FacultyManager = {
  // Validate faculty form inputs
  validateFaculty(data, isEdit = false, originalId = '') {
    const errors = [];

    if (!data.name || data.name.trim().length < 3) {
      errors.push('Faculty Name must be at least 3 characters.');
    }

    if (!data.facultyId || data.facultyId.trim().length < 4) {
      errors.push('Valid Faculty ID (e.g. GMU-FAC-08) is required.');
    } else {
      const idUpper = data.facultyId.trim().toUpperCase();
      const existing = StorageManager.getFaculty();
      const duplicate = existing.find(f => f.facultyId.toUpperCase() === idUpper);

      if (duplicate && (!isEdit || originalId.toUpperCase() !== idUpper)) {
        errors.push(`Duplicate ID: Faculty member with ID "${idUpper}" already exists.`);
      }
    }

    if (!data.departmentId && !data.department) {
      errors.push('Please select a Primary Department.');
    }

    if (!data.subject || data.subject.trim().length < 2) {
      errors.push('Primary Course / Subject allocation is required.');
    }

    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.push('Valid official university email address is required.');
    }

    return errors;
  },

  // Add new faculty member with department authorization
  addFaculty(facultyData) {
    const errors = this.validateFaculty(facultyData);
    if (errors.length > 0) {
      return { success: false, errors };
    }

    const dept = DepartmentsManager.getDepartmentById(facultyData.departmentId) || 
                 DepartmentsManager.getDepartmentByCode(facultyData.department) ||
                 { id: 'DEP-CSE', code: 'CSE', name: 'Computer Science and Engineering' };

    const authorized = Array.isArray(facultyData.authorizedDepartments) && facultyData.authorizedDepartments.length > 0
      ? facultyData.authorizedDepartments
      : [dept.id];

    const facultyList = StorageManager.getFaculty();
    const newFaculty = {
      facultyId: facultyData.facultyId.trim().toUpperCase(),
      name: facultyData.name.trim(),
      departmentId: dept.id,
      departmentCode: dept.code,
      department: dept.name,
      authorizedDepartments: authorized,
      subject: facultyData.subject.trim(),
      subjectCode: facultyData.subjectCode ? facultyData.subjectCode.trim().toUpperCase() : 'CS405',
      assignedSubjects: [facultyData.subjectCode ? facultyData.subjectCode.trim().toUpperCase() : 'CS405'],
      assignedClasses: [facultyData.assignedClass || 'CSE-A'],
      assignedClass: facultyData.assignedClass || 'CSE-A',
      email: facultyData.email.trim(),
      phone: facultyData.phone ? facultyData.phone.trim() : '+91 9448000000',
      createdAt: new Date().toISOString()
    };

    facultyList.push(newFaculty);
    StorageManager.saveFaculty(facultyList);

    // Automatically generate portal login account
    const username = StorageManager.autoCreateFacultyAccount(newFaculty);

    return { success: true, faculty: newFaculty, username };
  },

  // Update existing faculty member
  updateFaculty(facultyId, updatedData) {
    const errors = this.validateFaculty(updatedData, true, facultyId);
    if (errors.length > 0) {
      return { success: false, errors };
    }

    const facultyList = StorageManager.getFaculty();
    const index = facultyList.findIndex(f => f.facultyId.toUpperCase() === facultyId.toUpperCase());
    if (index === -1) {
      return { success: false, errors: ['Faculty member not found.'] };
    }

    const dept = DepartmentsManager.getDepartmentById(updatedData.departmentId) || 
                 DepartmentsManager.getDepartmentByCode(updatedData.department) ||
                 { id: facultyList[index].departmentId, code: facultyList[index].departmentCode, name: facultyList[index].department };

    const authorized = Array.isArray(updatedData.authorizedDepartments) && updatedData.authorizedDepartments.length > 0
      ? updatedData.authorizedDepartments
      : (facultyList[index].authorizedDepartments || [dept.id]);

    facultyList[index] = {
      ...facultyList[index],
      name: updatedData.name.trim(),
      departmentId: dept.id,
      departmentCode: dept.code,
      department: dept.name,
      authorizedDepartments: authorized,
      subject: updatedData.subject.trim(),
      subjectCode: updatedData.subjectCode ? updatedData.subjectCode.trim().toUpperCase() : facultyList[index].subjectCode,
      assignedSubjects: [updatedData.subjectCode ? updatedData.subjectCode.trim().toUpperCase() : facultyList[index].subjectCode],
      assignedClass: updatedData.assignedClass || facultyList[index].assignedClass,
      assignedClasses: [updatedData.assignedClass || facultyList[index].assignedClass],
      email: updatedData.email.trim(),
      phone: updatedData.phone ? updatedData.phone.trim() : facultyList[index].phone
    };

    StorageManager.saveFaculty(facultyList);

    // Synchronize linked user account
    StorageManager.autoCreateFacultyAccount(facultyList[index]);

    return { success: true, faculty: facultyList[index] };
  },

  // Delete faculty
  deleteFaculty(facultyId) {
    if (!confirm(`Are you sure you want to remove Faculty member with ID: ${facultyId}? This will revoke their teaching access and delete their login account.`)) {
      return false;
    }

    let facultyList = StorageManager.getFaculty();
    const target = facultyList.find(f => f.facultyId.toUpperCase() === facultyId.toUpperCase());
    facultyList = facultyList.filter(f => f.facultyId.toUpperCase() !== facultyId.toUpperCase());
    StorageManager.saveFaculty(facultyList);

    // Remove linked user account
    if (target && target.email) {
      const username = target.email.split('@')[0].toLowerCase();
      let users = StorageManager.getUsers();
      users = users.filter(u => u.username.toLowerCase() !== username && u.facultyId !== facultyId);
      StorageManager.saveUsers(users);
    }

    showToast(`Faculty ${facultyId} deleted successfully.`, 'info');
    return true;
  },

  // Filter faculty members with department scoping
  filterFaculty(facultyList, filters = {}) {
    return facultyList.filter(f => {
      // Search by Name, ID, or Subject
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesId = f.facultyId.toLowerCase().includes(q);
        const matchesSubj = f.subject.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesSubj) return false;
      }

      // Department filter
      if (filters.departmentId && filters.departmentId !== 'ALL') {
        const inPrimary = f.departmentId === filters.departmentId || f.departmentCode === filters.departmentId;
        const inAuth = f.authorizedDepartments && f.authorizedDepartments.includes(filters.departmentId);
        if (!inPrimary && !inAuth) return false;
      }

      return true;
    });
  },

  // Render Faculty Table
  renderFacultyTable(tableBodyEl, facultyList) {
    if (!tableBodyEl) return;

    if (facultyList.length === 0) {
      tableBodyEl.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 28px; color: var(--gmu-text-muted);">
            No faculty members found for this department. Click "+ Add New Faculty" to register.
          </td>
        </tr>
      `;
      return;
    }

    tableBodyEl.innerHTML = facultyList.map((f, idx) => {
      const authDepts = (f.authorizedDepartments || [f.departmentId || 'DEP-CSE'])
        .map(dId => {
          const d = DepartmentsManager.getDepartmentById(dId);
          return d ? d.code : dId.replace('DEP-', '');
        })
        .join(', ');

      return `
        <tr>
          <td>${idx + 1}</td>
          <td>
            <strong style="color: var(--gmu-primary); font-family: monospace;">${f.facultyId}</strong>
          </td>
          <td>
            <strong>${f.name}</strong>
            <div style="font-size: 0.78rem; color: var(--gmu-text-muted);">${f.email}</div>
          </td>
          <td>
            <span class="meta-pill" style="font-weight: 800;">${f.departmentCode || 'CSE'}</span>
            ${f.authorizedDepartments && f.authorizedDepartments.length > 1 ? `
              <div style="font-size: 0.72rem; color: var(--gmu-gold-dark); margin-top: 3px;">
                Auth: ${authDepts}
              </div>
            ` : ''}
          </td>
          <td>
            <strong>${f.subject}</strong>
            <div style="font-size: 0.72rem; color: var(--gmu-text-muted); margin-top: 2px;">
              Code: ${f.subjectCode || 'N/A'} • Class: ${f.assignedClass || 'All'}
            </div>
          </td>
          <td>${f.phone}</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-outline-primary btn-sm" onclick="handleEditFaculty('${f.facultyId}')" title="Edit Faculty Allocation" style="padding: 5px 9px;">
                ✎ Edit
              </button>
              <button class="btn btn-danger btn-sm" onclick="handleDeleteFaculty('${f.facultyId}')" title="Delete Faculty" style="padding: 5px 9px;">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
};
