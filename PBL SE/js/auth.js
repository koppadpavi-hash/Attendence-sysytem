/**
 * GM UNIVERSITY (GMU), DAVANAGERE - ATTENDANCE MANAGEMENT SYSTEM
 * Authentication & Authorization Module (auth.js)
 * Manages user sessions, role-based access control, and department-level security guards.
 */

const Auth = {
  // Retrieve currently active session
  getCurrentUser() {
    try {
      const data = localStorage.getItem(GMU_STORAGE_KEYS.SESSION);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading session:', e);
      return null;
    }
  },

  // Save or clear session
  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(GMU_STORAGE_KEYS.SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(GMU_STORAGE_KEYS.SESSION);
    }
  },

  // Attempt login with role and credential validation
  login(username, password, selectedRole) {
    if (!username || !password) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    const users = StorageManager.getUsers();
    const cleanUsername = username.trim().toLowerCase();

    // Look for matching credentials
    const user = users.find(u => 
      u.username.toLowerCase() === cleanUsername && 
      u.password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid credentials. Please verify your username and password.' };
    }

    if (user.role.toLowerCase() !== selectedRole.toLowerCase()) {
      return { 
        success: false, 
        message: `Role mismatch: The account "${username}" belongs to "${user.role.toUpperCase()}", not "${selectedRole.toUpperCase()}". Please switch roles.` 
      };
    }

    // Login successful
    this.setCurrentUser(user);
    return { success: true, user: user };
  },

  // Logout current user and return to login page
  logout() {
    if (confirm('Are you sure you want to log out from the GMU Attendance Portal?')) {
      this.setCurrentUser(null);
      window.location.href = 'index.html';
    }
  },

  // Route Guard: Protects dashboard pages against unauthorized access
  requireAuth(allowedRoles = [], requiredDepartmentId = null) {
    const user = this.getCurrentUser();

    if (!user) {
      window.location.href = 'index.html?error=unauthorized';
      return null;
    }

    // Role check
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      alert(`Access Restricted: You do not have permission to view the ${allowedRoles.join('/')} dashboard.`);
      this.redirectByRole(user.role);
      return null;
    }

    // Department authorization check for faculty
    if (user.role === 'faculty' && requiredDepartmentId && requiredDepartmentId !== 'ALL') {
      const authorized = user.authorizedDepartments || [user.departmentId];
      if (!authorized.includes(requiredDepartmentId)) {
        alert(`Access Restricted: You are not authorized for department ${requiredDepartmentId}.`);
        window.location.href = 'faculty-dashboard.html';
        return null;
      }
    }

    // Render session widget in navigation bar
    this.renderUserSessionBadge(user);
    return user;
  },

  // Helper to redirect user to their authorized dashboard
  redirectByRole(role) {
    switch (role.toLowerCase()) {
      case 'admin':
        window.location.href = 'admin-dashboard.html';
        break;
      case 'faculty':
        window.location.href = 'faculty-dashboard.html';
        break;
      case 'student':
        window.location.href = 'student-dashboard.html';
        break;
      default:
        window.location.href = 'index.html';
    }
  },

  // Render user session widget in top navigation
  renderUserSessionBadge(user) {
    const badgeContainer = document.getElementById('user-session-container');
    if (!badgeContainer) return;

    let roleTag = user.role.toUpperCase();
    let subInfo = user.departmentCode || user.classSection || '';
    if (user.role === 'admin') subInfo = 'ALL DEPTS';

    badgeContainer.innerHTML = `
      <div class="user-badge-info">
        <div class="user-badge-name">${user.name || user.username}</div>
        <div class="user-badge-role">${roleTag} ${subInfo ? `• ${subInfo}` : ''}</div>
      </div>
      <button class="btn-logout" id="btnLogout" title="Log out from portal">
        <i>⎋</i> Logout
      </button>
    `;

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => this.logout());
    }
  }
};
