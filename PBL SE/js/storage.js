/**
 * GM UNIVERSITY (GMU), DAVANAGERE - ATTENDANCE MANAGEMENT SYSTEM
 * Storage Module (storage.js)
 * Manages separate localStorage keys for:
 *   - gmu_users
 *   - gmu_departments
 *   - gmu_classes
 *   - gmu_subjects
 *   - gmu_students
 *   - gmu_faculty
 *   - gmu_attendance
 *   - gmu_current_user (session)
 * Includes schema migration, multi-department seed data, and factory demo reset.
 */

const GMU_STORAGE_KEYS = {
  USERS: 'gmu_users',
  DEPARTMENTS: 'gmu_departments',
  CLASSES: 'gmu_classes',
  SUBJECTS: 'gmu_subjects',
  STUDENTS: 'gmu_students',
  FACULTY: 'gmu_faculty',
  ATTENDANCE: 'gmu_attendance',
  SESSION: 'gmu_current_user'
};

// Complete Seed Dataset for GM University's 5 Core Engineering Departments
const SEED_DATA = {
  departments: [
    {
      id: 'DEP-CSE',
      code: 'CSE',
      name: 'Computer Science and Engineering',
      description: 'Department of Computer Science & Engineering, Faculty of Engineering & Technology (FET)',
      status: 'Active',
      headOfDept: 'Dr. Rajesh Kumar',
      createdAt: '2026-01-15T09:00:00.000Z'
    },
    {
      id: 'DEP-ISE',
      code: 'ISE',
      name: 'Information Science and Engineering',
      description: 'Department of Information Science & Engineering, Faculty of Engineering & Technology',
      status: 'Active',
      headOfDept: 'Dr. Venkatesh Rao',
      createdAt: '2026-01-15T09:00:00.000Z'
    },
    {
      id: 'DEP-ECE',
      code: 'ECE',
      name: 'Electronics and Communication Engineering',
      description: 'Department of Electronics & Communication Engineering, Faculty of Engineering & Technology',
      status: 'Active',
      headOfDept: 'Dr. Suresh Babu',
      createdAt: '2026-01-15T09:00:00.000Z'
    },
    {
      id: 'DEP-ME',
      code: 'ME',
      name: 'Mechanical Engineering',
      description: 'Department of Mechanical Engineering, School of Mechanical & Automation Sciences',
      status: 'Active',
      headOfDept: 'Prof. Ramesh Patil',
      createdAt: '2026-01-15T09:00:00.000Z'
    },
    {
      id: 'DEP-CE',
      code: 'CE',
      name: 'Civil Engineering',
      description: 'Department of Civil Engineering, School of Infrastructure & Environmental Studies',
      status: 'Active',
      headOfDept: 'Dr. Manjunath Swamy',
      createdAt: '2026-01-15T09:00:00.000Z'
    }
  ],

  classes: [
    // CSE Classes
    { id: 'CLS-CSE-4A', departmentId: 'DEP-CSE', departmentCode: 'CSE', name: 'CSE-A', section: 'A', semester: '4th Sem', academicYear: '2026-2027', courseProgram: 'B.Tech' },
    { id: 'CLS-CSE-4B', departmentId: 'DEP-CSE', departmentCode: 'CSE', name: 'CSE-B', section: 'B', semester: '4th Sem', academicYear: '2026-2027', courseProgram: 'B.Tech' },
    // ISE Classes
    { id: 'CLS-ISE-4A', departmentId: 'DEP-ISE', departmentCode: 'ISE', name: 'ISE-A', section: 'A', semester: '4th Sem', academicYear: '2026-2027', courseProgram: 'B.Tech' },
    // ECE Classes
    { id: 'CLS-ECE-4A', departmentId: 'DEP-ECE', departmentCode: 'ECE', name: 'ECE-A', section: 'A', semester: '4th Sem', academicYear: '2026-2027', courseProgram: 'B.Tech' },
    // ME Classes
    { id: 'CLS-ME-4A', departmentId: 'DEP-ME', departmentCode: 'ME', name: 'ME-A', section: 'A', semester: '4th Sem', academicYear: '2026-2027', courseProgram: 'B.Tech' },
    // CE Classes
    { id: 'CLS-CE-4A', departmentId: 'DEP-CE', departmentCode: 'CE', name: 'CE-A', section: 'A', semester: '4th Sem', academicYear: '2026-2027', courseProgram: 'B.Tech' }
  ],

  subjects: [
    // CSE Subjects
    { id: 'SUB-CS401', code: 'CS401', name: 'Software Engineering', departmentId: 'DEP-CSE', departmentCode: 'CSE', semester: '4th Sem', facultyId: 'GMU-FAC-01', facultyName: 'Dr. Rajesh Kumar' },
    { id: 'SUB-CS402', code: 'CS402', name: 'Database Management Systems', departmentId: 'DEP-CSE', departmentCode: 'CSE', semester: '4th Sem', facultyId: 'GMU-FAC-02', facultyName: 'Prof. Ananya Sharma' },
    { id: 'SUB-CS403', code: 'CS403', name: 'Operating Systems', departmentId: 'DEP-CSE', departmentCode: 'CSE', semester: '4th Sem', facultyId: 'GMU-FAC-04', facultyName: 'Prof. Priya Deshmukh' },
    { id: 'SUB-CS404', code: 'CS404', name: 'Design & Analysis of Algorithms', departmentId: 'DEP-CSE', departmentCode: 'CSE', semester: '4th Sem', facultyId: 'GMU-FAC-01', facultyName: 'Dr. Rajesh Kumar' },
    
    // ISE Subjects
    { id: 'SUB-IS401', code: 'IS401', name: 'Full Stack Development', departmentId: 'DEP-ISE', departmentCode: 'ISE', semester: '4th Sem', facultyId: 'GMU-FAC-03', facultyName: 'Dr. Venkatesh Rao' },
    { id: 'SUB-IS402', code: 'IS402', name: 'Computer Networks', departmentId: 'DEP-ISE', departmentCode: 'ISE', semester: '4th Sem', facultyId: 'GMU-FAC-03', facultyName: 'Dr. Venkatesh Rao' },

    // ECE Subjects
    { id: 'SUB-EC401', code: 'EC401', name: 'Digital Signal Processing', departmentId: 'DEP-ECE', departmentCode: 'ECE', semester: '4th Sem', facultyId: 'GMU-FAC-05', facultyName: 'Dr. Suresh Babu' },
    { id: 'SUB-EC402', code: 'EC402', name: 'VLSI Design & Technology', departmentId: 'DEP-ECE', departmentCode: 'ECE', semester: '4th Sem', facultyId: 'GMU-FAC-05', facultyName: 'Dr. Suresh Babu' },

    // ME Subjects
    { id: 'SUB-ME401', code: 'ME401', name: 'Applied Thermodynamics', departmentId: 'DEP-ME', departmentCode: 'ME', semester: '4th Sem', facultyId: 'GMU-FAC-06', facultyName: 'Prof. Ramesh Patil' },
    { id: 'SUB-ME402', code: 'ME402', name: 'Kinematics of Machines', departmentId: 'DEP-ME', departmentCode: 'ME', semester: '4th Sem', facultyId: 'GMU-FAC-06', facultyName: 'Prof. Ramesh Patil' },

    // CE Subjects
    { id: 'SUB-CV401', code: 'CV401', name: 'Structural Analysis', departmentId: 'DEP-CE', departmentCode: 'CE', semester: '4th Sem', facultyId: 'GMU-FAC-07', facultyName: 'Dr. Manjunath Swamy' },
    { id: 'SUB-CV402', code: 'CV402', name: 'Geotechnical Engineering', departmentId: 'DEP-CE', departmentCode: 'CE', semester: '4th Sem', facultyId: 'GMU-FAC-07', facultyName: 'Dr. Manjunath Swamy' }
  ],

  faculty: [
    // 1. CSE Faculty Lead
    {
      facultyId: 'GMU-FAC-01',
      name: 'Dr. Rajesh Kumar',
      departmentId: 'DEP-CSE',
      departmentCode: 'CSE',
      department: 'Computer Science and Engineering',
      authorizedDepartments: ['DEP-CSE'],
      subject: 'Software Engineering',
      subjectCode: 'CS401',
      assignedSubjects: ['CS401', 'CS404'],
      assignedClasses: ['CSE-A'],
      assignedClass: 'CSE-A',
      email: 'rajesh.kumar@gmu.ac.in',
      phone: '+91 9448123456'
    },
    // 2. CSE Faculty
    {
      facultyId: 'GMU-FAC-02',
      name: 'Prof. Ananya Sharma',
      departmentId: 'DEP-CSE',
      departmentCode: 'CSE',
      department: 'Computer Science and Engineering',
      authorizedDepartments: ['DEP-CSE'],
      subject: 'Database Management Systems',
      subjectCode: 'CS402',
      assignedSubjects: ['CS402'],
      assignedClasses: ['CSE-A'],
      assignedClass: 'CSE-A',
      email: 'ananya.sharma@gmu.ac.in',
      phone: '+91 9448234567'
    },
    // 3. Multi-Department Faculty (Authorized for both ISE and CSE)
    {
      facultyId: 'GMU-FAC-03',
      name: 'Dr. Venkatesh Rao',
      departmentId: 'DEP-ISE',
      departmentCode: 'ISE',
      department: 'Information Science and Engineering',
      authorizedDepartments: ['DEP-ISE', 'DEP-CSE'], // Multi-department authorized demo!
      subject: 'Full Stack Development',
      subjectCode: 'IS401',
      assignedSubjects: ['IS401', 'IS402'],
      assignedClasses: ['ISE-A'],
      assignedClass: 'ISE-A',
      email: 'venkatesh.rao@gmu.ac.in',
      phone: '+91 9448345678'
    },
    // 4. CSE Faculty
    {
      facultyId: 'GMU-FAC-04',
      name: 'Prof. Priya Deshmukh',
      departmentId: 'DEP-CSE',
      departmentCode: 'CSE',
      department: 'Computer Science and Engineering',
      authorizedDepartments: ['DEP-CSE'],
      subject: 'Operating Systems',
      subjectCode: 'CS403',
      assignedSubjects: ['CS403'],
      assignedClasses: ['CSE-B'],
      assignedClass: 'CSE-B',
      email: 'priya.deshmukh@gmu.ac.in',
      phone: '+91 9448456789'
    },
    // 5. ECE Faculty
    {
      facultyId: 'GMU-FAC-05',
      name: 'Dr. Suresh Babu',
      departmentId: 'DEP-ECE',
      departmentCode: 'ECE',
      department: 'Electronics and Communication Engineering',
      authorizedDepartments: ['DEP-ECE'],
      subject: 'Digital Signal Processing',
      subjectCode: 'EC401',
      assignedSubjects: ['EC401', 'EC402'],
      assignedClasses: ['ECE-A'],
      assignedClass: 'ECE-A',
      email: 'suresh.babu@gmu.ac.in',
      phone: '+91 9448567891'
    },
    // 6. ME Faculty
    {
      facultyId: 'GMU-FAC-06',
      name: 'Prof. Ramesh Patil',
      departmentId: 'DEP-ME',
      departmentCode: 'ME',
      department: 'Mechanical Engineering',
      authorizedDepartments: ['DEP-ME'],
      subject: 'Applied Thermodynamics',
      subjectCode: 'ME401',
      assignedSubjects: ['ME401', 'ME402'],
      assignedClasses: ['ME-A'],
      assignedClass: 'ME-A',
      email: 'ramesh.patil@gmu.ac.in',
      phone: '+91 9448678912'
    },
    // 7. CE Faculty
    {
      facultyId: 'GMU-FAC-07',
      name: 'Dr. Manjunath Swamy',
      departmentId: 'DEP-CE',
      departmentCode: 'CE',
      department: 'Civil Engineering',
      authorizedDepartments: ['DEP-CE'],
      subject: 'Structural Analysis',
      subjectCode: 'CV401',
      assignedSubjects: ['CV401', 'CV402'],
      assignedClasses: ['CE-A'],
      assignedClass: 'CE-A',
      email: 'manjunath.swamy@gmu.ac.in',
      phone: '+91 9448789023'
    }
  ],

  students: [
    // ==========================================
    // 1. CSE Students (CSE-A & CSE-B)
    // ==========================================
    { usn: '4GM22CS001', name: 'Aarav N. Patil', departmentId: 'DEP-CSE', departmentCode: 'CSE', department: 'Computer Science and Engineering', courseProgram: 'B.Tech', classSection: 'CSE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'aarav.patil@student.gmu.ac.in', phone: '9845011001' },
    { usn: '4GM22CS002', name: 'Ananya S. Hegde', departmentId: 'DEP-CSE', departmentCode: 'CSE', department: 'Computer Science and Engineering', courseProgram: 'B.Tech', classSection: 'CSE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'ananya.hegde@student.gmu.ac.in', phone: '9845011002' },
    { usn: '4GM22CS003', name: 'Chetan M. Kulkarni', departmentId: 'DEP-CSE', departmentCode: 'CSE', department: 'Computer Science and Engineering', courseProgram: 'B.Tech', classSection: 'CSE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'chetan.kulkarni@student.gmu.ac.in', phone: '9845011003' },
    { usn: '4GM22CS004', name: 'Deepa R. Bhat', departmentId: 'DEP-CSE', departmentCode: 'CSE', department: 'Computer Science and Engineering', courseProgram: 'B.Tech', classSection: 'CSE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'deepa.bhat@student.gmu.ac.in', phone: '9845011004' },
    { usn: '4GM22CS005', name: 'Goutham V. Shetty', departmentId: 'DEP-CSE', departmentCode: 'CSE', department: 'Computer Science and Engineering', courseProgram: 'B.Tech', classSection: 'CSE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'goutham.shetty@student.gmu.ac.in', phone: '9845011005' },
    // CSE Low Attendance Demo (<75%)
    { usn: '4GM22CS006', name: 'Harsha Vardhan K.', departmentId: 'DEP-CSE', departmentCode: 'CSE', department: 'Computer Science and Engineering', courseProgram: 'B.Tech', classSection: 'CSE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'harsha.v@student.gmu.ac.in', phone: '9845011006' },
    { usn: '4GM22CS007', name: 'Kavya Suresh', departmentId: 'DEP-CSE', departmentCode: 'CSE', department: 'Computer Science and Engineering', courseProgram: 'B.Tech', classSection: 'CSE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'kavya.suresh@student.gmu.ac.in', phone: '9845011007' },
    { usn: '4GM22CS008', name: 'Manoj Kumar B.', departmentId: 'DEP-CSE', departmentCode: 'CSE', department: 'Computer Science and Engineering', courseProgram: 'B.Tech', classSection: 'CSE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'manoj.kumar@student.gmu.ac.in', phone: '9845011008' },
    { usn: '4GM22CS050', name: 'Rahul S. Naragund', departmentId: 'DEP-CSE', departmentCode: 'CSE', department: 'Computer Science and Engineering', courseProgram: 'B.Tech', classSection: 'CSE-B', semester: '4th Sem', academicYear: '2026-2027', email: 'rahul.naragund@student.gmu.ac.in', phone: '9845012050' },
    { usn: '4GM22CS054', name: 'Sneha Patil', departmentId: 'DEP-CSE', departmentCode: 'CSE', department: 'Computer Science and Engineering', courseProgram: 'B.Tech', classSection: 'CSE-B', semester: '4th Sem', academicYear: '2026-2027', email: 'sneha.patil@student.gmu.ac.in', phone: '9845012054' },

    // ==========================================
    // 2. ISE Students (ISE-A)
    // ==========================================
    { usn: '4GM22IS001', name: 'Akash M. Biradar', departmentId: 'DEP-ISE', departmentCode: 'ISE', department: 'Information Science and Engineering', courseProgram: 'B.Tech', classSection: 'ISE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'akash.biradar@student.gmu.ac.in', phone: '9845013001' },
    { usn: '4GM22IS002', name: 'Bhavana N. Naik', departmentId: 'DEP-ISE', departmentCode: 'ISE', department: 'Information Science and Engineering', courseProgram: 'B.Tech', classSection: 'ISE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'bhavana.naik@student.gmu.ac.in', phone: '9845013002' },
    { usn: '4GM22IS003', name: 'Darshan P. Gudi', departmentId: 'DEP-ISE', departmentCode: 'ISE', department: 'Information Science and Engineering', courseProgram: 'B.Tech', classSection: 'ISE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'darshan.gudi@student.gmu.ac.in', phone: '9845013003' },
    // ISE Low Attendance Demo (<75%)
    { usn: '4GM22IS004', name: 'Divya R. Meti', departmentId: 'DEP-ISE', departmentCode: 'ISE', department: 'Information Science and Engineering', courseProgram: 'B.Tech', classSection: 'ISE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'divya.meti@student.gmu.ac.in', phone: '9845013004' },
    { usn: '4GM22IS005', name: 'Kiran J. Sannakki', departmentId: 'DEP-ISE', departmentCode: 'ISE', department: 'Information Science and Engineering', courseProgram: 'B.Tech', classSection: 'ISE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'kiran.sannakki@student.gmu.ac.in', phone: '9845013005' },

    // ==========================================
    // 3. ECE Students (ECE-A)
    // ==========================================
    { usn: '4GM22EC001', name: 'Aditya S. Rao', departmentId: 'DEP-ECE', departmentCode: 'ECE', department: 'Electronics and Communication Engineering', courseProgram: 'B.Tech', classSection: 'ECE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'aditya.rao@student.gmu.ac.in', phone: '9845014001' },
    { usn: '4GM22EC002', name: 'Meghana R. Joshi', departmentId: 'DEP-ECE', departmentCode: 'ECE', department: 'Electronics and Communication Engineering', courseProgram: 'B.Tech', classSection: 'ECE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'meghana.joshi@student.gmu.ac.in', phone: '9845014002' },
    // ECE Low Attendance Demo (<75%)
    { usn: '4GM22EC003', name: 'Praveen K. Nayak', departmentId: 'DEP-ECE', departmentCode: 'ECE', department: 'Electronics and Communication Engineering', courseProgram: 'B.Tech', classSection: 'ECE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'praveen.nayak@student.gmu.ac.in', phone: '9845014003' },
    { usn: '4GM22EC004', name: 'Ritu V. Deshpande', departmentId: 'DEP-ECE', departmentCode: 'ECE', department: 'Electronics and Communication Engineering', courseProgram: 'B.Tech', classSection: 'ECE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'ritu.deshpande@student.gmu.ac.in', phone: '9845014004' },

    // ==========================================
    // 4. ME Students (ME-A)
    // ==========================================
    { usn: '4GM22ME001', name: 'Ajay M. Badami', departmentId: 'DEP-ME', departmentCode: 'ME', department: 'Mechanical Engineering', courseProgram: 'B.Tech', classSection: 'ME-A', semester: '4th Sem', academicYear: '2026-2027', email: 'ajay.badami@student.gmu.ac.in', phone: '9845015001' },
    // ME Low Attendance Demo (<75%)
    { usn: '4GM22ME002', name: 'Darshan B. Gowda', departmentId: 'DEP-ME', departmentCode: 'ME', department: 'Mechanical Engineering', courseProgram: 'B.Tech', classSection: 'ME-A', semester: '4th Sem', academicYear: '2026-2027', email: 'darshan.gowda@student.gmu.ac.in', phone: '9845015002' },
    { usn: '4GM22ME003', name: 'Karthik N. Kulkarni', departmentId: 'DEP-ME', departmentCode: 'ME', department: 'Mechanical Engineering', courseProgram: 'B.Tech', classSection: 'ME-A', semester: '4th Sem', academicYear: '2026-2027', email: 'karthik.kulkarni@student.gmu.ac.in', phone: '9845015003' },
    { usn: '4GM22ME004', name: 'Nikhil R. Patil', departmentId: 'DEP-ME', departmentCode: 'ME', department: 'Mechanical Engineering', courseProgram: 'B.Tech', classSection: 'ME-A', semester: '4th Sem', academicYear: '2026-2027', email: 'nikhil.patil@student.gmu.ac.in', phone: '9845015004' },

    // ==========================================
    // 5. CE Students (CE-A)
    // ==========================================
    { usn: '4GM22CV001', name: 'Basavaraj H. Angadi', departmentId: 'DEP-CE', departmentCode: 'CE', department: 'Civil Engineering', courseProgram: 'B.Tech', classSection: 'CE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'basavaraj.angadi@student.gmu.ac.in', phone: '9845016001' },
    { usn: '4GM22CV002', name: 'Deepak V. Hosur', departmentId: 'DEP-CE', departmentCode: 'CE', department: 'Civil Engineering', courseProgram: 'B.Tech', classSection: 'CE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'deepak.hosur@student.gmu.ac.in', phone: '9845016002' },
    // CE Low Attendance Demo (<75%)
    { usn: '4GM22CV003', name: 'Pooja K. Hiremath', departmentId: 'DEP-CE', departmentCode: 'CE', department: 'Civil Engineering', courseProgram: 'B.Tech', classSection: 'CE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'pooja.hiremath@student.gmu.ac.in', phone: '9845016003' },
    { usn: '4GM22CV004', name: 'Sachin S. Shinde', departmentId: 'DEP-CE', departmentCode: 'CE', department: 'Civil Engineering', courseProgram: 'B.Tech', classSection: 'CE-A', semester: '4th Sem', academicYear: '2026-2027', email: 'sachin.shinde@student.gmu.ac.in', phone: '9845016004' }
  ]
};

// Generate realistic multi-department attendance sessions across dates
function generateSeedAttendance(students) {
  const records = [];
  const dates = ['2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24'];

  const cseA = students.filter(s => s.classSection === 'CSE-A');
  const cseB = students.filter(s => s.classSection === 'CSE-B');
  const iseA = students.filter(s => s.classSection === 'ISE-A');
  const eceA = students.filter(s => s.classSection === 'ECE-A');
  const meA  = students.filter(s => s.classSection === 'ME-A');
  const ceA  = students.filter(s => s.classSection === 'CE-A');

  // 1. CSE Software Engineering (Dr. Rajesh Kumar)
  dates.forEach((date, dayIdx) => {
    const studentStatus = {};
    cseA.forEach(s => {
      if (s.usn === '4GM22CS006') {
        studentStatus[s.usn] = dayIdx === 0 ? 'Present' : 'Absent'; // 20% attendance
      } else {
        studentStatus[s.usn] = 'Present';
      }
    });

    records.push({
      id: `ATT-CSE-CS401-${date}`,
      departmentId: 'DEP-CSE',
      departmentCode: 'CSE',
      classSection: 'CSE-A',
      subject: 'Software Engineering',
      subjectCode: 'CS401',
      date: date,
      facultyId: 'GMU-FAC-01',
      facultyName: 'Dr. Rajesh Kumar',
      records: studentStatus,
      timestamp: new Date(`${date}T10:30:00Z`).toISOString()
    });
  });

  // 2. CSE Database Management Systems (Prof. Ananya Sharma)
  dates.slice(0, 4).forEach((date, dayIdx) => {
    const studentStatus = {};
    cseA.forEach(s => {
      if (s.usn === '4GM22CS006') {
        studentStatus[s.usn] = dayIdx === 1 ? 'Present' : 'Absent'; // 25% attendance
      } else {
        studentStatus[s.usn] = 'Present';
      }
    });

    records.push({
      id: `ATT-CSE-CS402-${date}`,
      departmentId: 'DEP-CSE',
      departmentCode: 'CSE',
      classSection: 'CSE-A',
      subject: 'Database Management Systems',
      subjectCode: 'CS402',
      date: date,
      facultyId: 'GMU-FAC-02',
      facultyName: 'Prof. Ananya Sharma',
      records: studentStatus,
      timestamp: new Date(`${date}T11:45:00Z`).toISOString()
    });
  });

  // 3. ISE Full Stack Development (Dr. Venkatesh Rao)
  dates.forEach((date, dayIdx) => {
    const studentStatus = {};
    iseA.forEach(s => {
      if (s.usn === '4GM22IS004') {
        studentStatus[s.usn] = dayIdx <= 1 ? 'Present' : 'Absent'; // 40% attendance (<75%)
      } else {
        studentStatus[s.usn] = 'Present';
      }
    });

    records.push({
      id: `ATT-ISE-IS401-${date}`,
      departmentId: 'DEP-ISE',
      departmentCode: 'ISE',
      classSection: 'ISE-A',
      subject: 'Full Stack Development',
      subjectCode: 'IS401',
      date: date,
      facultyId: 'GMU-FAC-03',
      facultyName: 'Dr. Venkatesh Rao',
      records: studentStatus,
      timestamp: new Date(`${date}T14:15:00Z`).toISOString()
    });
  });

  // 4. ECE Digital Signal Processing (Dr. Suresh Babu)
  dates.forEach((date, dayIdx) => {
    const studentStatus = {};
    eceA.forEach(s => {
      if (s.usn === '4GM22EC003') {
        studentStatus[s.usn] = dayIdx === 0 ? 'Present' : 'Absent'; // 20% attendance (<75%)
      } else {
        studentStatus[s.usn] = 'Present';
      }
    });

    records.push({
      id: `ATT-ECE-EC401-${date}`,
      departmentId: 'DEP-ECE',
      departmentCode: 'ECE',
      classSection: 'ECE-A',
      subject: 'Digital Signal Processing',
      subjectCode: 'EC401',
      date: date,
      facultyId: 'GMU-FAC-05',
      facultyName: 'Dr. Suresh Babu',
      records: studentStatus,
      timestamp: new Date(`${date}T09:30:00Z`).toISOString()
    });
  });

  // 5. ME Applied Thermodynamics (Prof. Ramesh Patil)
  dates.forEach((date, dayIdx) => {
    const studentStatus = {};
    meA.forEach(s => {
      if (s.usn === '4GM22ME002') {
        studentStatus[s.usn] = dayIdx <= 1 ? 'Present' : 'Absent'; // 40% attendance (<75%)
      } else {
        studentStatus[s.usn] = 'Present';
      }
    });

    records.push({
      id: `ATT-ME-ME401-${date}`,
      departmentId: 'DEP-ME',
      departmentCode: 'ME',
      classSection: 'ME-A',
      subject: 'Applied Thermodynamics',
      subjectCode: 'ME401',
      date: date,
      facultyId: 'GMU-FAC-06',
      facultyName: 'Prof. Ramesh Patil',
      records: studentStatus,
      timestamp: new Date(`${date}T11:00:00Z`).toISOString()
    });
  });

  // 6. CE Structural Analysis (Dr. Manjunath Swamy)
  dates.forEach((date, dayIdx) => {
    const studentStatus = {};
    ceA.forEach(s => {
      if (s.usn === '4GM22CV003') {
        studentStatus[s.usn] = dayIdx === 2 ? 'Present' : 'Absent'; // 20% attendance (<75%)
      } else {
        studentStatus[s.usn] = 'Present';
      }
    });

    records.push({
      id: `ATT-CE-CV401-${date}`,
      departmentId: 'DEP-CE',
      departmentCode: 'CE',
      classSection: 'CE-A',
      subject: 'Structural Analysis',
      subjectCode: 'CV401',
      date: date,
      facultyId: 'GMU-FAC-07',
      facultyName: 'Dr. Manjunath Swamy',
      records: studentStatus,
      timestamp: new Date(`${date}T15:30:00Z`).toISOString()
    });
  });

  return records;
}

// Generate linked authentication users for Admin, Faculty, and Students
function generateSeedUsers(faculty, students) {
  const users = [
    {
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Dr. S. B. Shivakumar',
      designation: 'Dean of Engineering & University Administrator',
      email: 'admin@gmu.ac.in',
      authorizedDepartments: ['ALL']
    }
  ];

  // Faculty Accounts
  faculty.forEach(f => {
    const username = f.email.split('@')[0];
    users.push({
      username: username,
      password: 'faculty123',
      role: 'faculty',
      facultyId: f.facultyId,
      name: f.name,
      departmentId: f.departmentId,
      departmentCode: f.departmentCode,
      department: f.department,
      authorizedDepartments: f.authorizedDepartments || [f.departmentId],
      email: f.email,
      phone: f.phone
    });
  });

  // Student Accounts
  students.forEach(s => {
    users.push({
      username: s.usn,
      password: 'student123',
      role: 'student',
      usn: s.usn,
      name: s.name,
      departmentId: s.departmentId,
      departmentCode: s.departmentCode,
      department: s.department,
      classSection: s.classSection,
      semester: s.semester,
      email: s.email,
      phone: s.phone
    });
  });

  return users;
}

// StorageManager Object
const StorageManager = {
  init() {
    const hasDepts = localStorage.getItem(GMU_STORAGE_KEYS.DEPARTMENTS);
    const hasUsers = localStorage.getItem(GMU_STORAGE_KEYS.USERS);
    const hasStudents = localStorage.getItem(GMU_STORAGE_KEYS.STUDENTS);

    // If completely uninitialized OR missing department-wise keys, run full seed / migration
    if (!hasDepts || !hasUsers || !hasStudents) {
      this.resetToDemoData(false);
    } else {
      this.migrateLegacyData();
    }
  },

  // Safe migration routine for existing data lacking department IDs
  migrateLegacyData() {
    try {
      let depts = this.getDepartments();
      if (!depts || depts.length === 0) {
        this.saveDepartments(SEED_DATA.departments);
      }

      let classes = this.getClasses();
      if (!classes || classes.length === 0) {
        this.saveClasses(SEED_DATA.classes);
      }

      let subjects = this.getSubjects();
      if (!subjects || subjects.length === 0) {
        this.saveSubjects(SEED_DATA.subjects);
      }

      // Check students for departmentId
      let students = this.getStudents();
      let updatedStudents = false;
      students.forEach(s => {
        if (!s.departmentId) {
          if (s.usn.includes('CS')) { s.departmentId = 'DEP-CSE'; s.departmentCode = 'CSE'; }
          else if (s.usn.includes('IS')) { s.departmentId = 'DEP-ISE'; s.departmentCode = 'ISE'; }
          else if (s.usn.includes('EC')) { s.departmentId = 'DEP-ECE'; s.departmentCode = 'ECE'; }
          else if (s.usn.includes('ME')) { s.departmentId = 'DEP-ME'; s.departmentCode = 'ME'; }
          else if (s.usn.includes('CV')) { s.departmentId = 'DEP-CE'; s.departmentCode = 'CE'; }
          else { s.departmentId = 'DEP-CSE'; s.departmentCode = 'CSE'; }
          updatedStudents = true;
        }
      });
      if (updatedStudents) this.saveStudents(students);

      // Check faculty for authorizedDepartments
      let faculty = this.getFaculty();
      let updatedFaculty = false;
      faculty.forEach(f => {
        if (!f.authorizedDepartments || f.authorizedDepartments.length === 0) {
          f.authorizedDepartments = [f.departmentId || 'DEP-CSE'];
          updatedFaculty = true;
        }
      });
      if (updatedFaculty) this.saveFaculty(faculty);

      // Check attendance for departmentId
      let attendance = this.getAttendance();
      let updatedAttendance = false;
      attendance.forEach(a => {
        if (!a.departmentId) {
          if (a.classSection && a.classSection.startsWith('CSE')) { a.departmentId = 'DEP-CSE'; a.departmentCode = 'CSE'; }
          else if (a.classSection && a.classSection.startsWith('ISE')) { a.departmentId = 'DEP-ISE'; a.departmentCode = 'ISE'; }
          else if (a.classSection && a.classSection.startsWith('ECE')) { a.departmentId = 'DEP-ECE'; a.departmentCode = 'ECE'; }
          else if (a.classSection && a.classSection.startsWith('ME')) { a.departmentId = 'DEP-ME'; a.departmentCode = 'ME'; }
          else if (a.classSection && a.classSection.startsWith('CE')) { a.departmentId = 'DEP-CE'; a.departmentCode = 'CE'; }
          else { a.departmentId = 'DEP-CSE'; a.departmentCode = 'CSE'; }
          updatedAttendance = true;
        }
      });
      if (updatedAttendance) this.saveAttendance(attendance);

    } catch (e) {
      console.warn('Migration check completed with note:', e);
    }
  },

  get(key, defaultValue = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key}:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing ${key}:`, e);
      return false;
    }
  },

  // Departments
  getDepartments() { return this.get(GMU_STORAGE_KEYS.DEPARTMENTS, []); },
  saveDepartments(departments) { return this.set(GMU_STORAGE_KEYS.DEPARTMENTS, departments); },

  // Classes
  getClasses() { return this.get(GMU_STORAGE_KEYS.CLASSES, []); },
  saveClasses(classes) { return this.set(GMU_STORAGE_KEYS.CLASSES, classes); },

  // Subjects
  getSubjects() { return this.get(GMU_STORAGE_KEYS.SUBJECTS, []); },
  saveSubjects(subjects) { return this.set(GMU_STORAGE_KEYS.SUBJECTS, subjects); },

  // Students
  getStudents() { return this.get(GMU_STORAGE_KEYS.STUDENTS, []); },
  saveStudents(students) { return this.set(GMU_STORAGE_KEYS.STUDENTS, students); },

  // Faculty
  getFaculty() { return this.get(GMU_STORAGE_KEYS.FACULTY, []); },
  saveFaculty(faculty) { return this.set(GMU_STORAGE_KEYS.FACULTY, faculty); },

  // Attendance
  getAttendance() { return this.get(GMU_STORAGE_KEYS.ATTENDANCE, []); },
  saveAttendance(attendance) { return this.set(GMU_STORAGE_KEYS.ATTENDANCE, attendance); },

  // Users
  getUsers() { return this.get(GMU_STORAGE_KEYS.USERS, []); },
  saveUsers(users) { return this.set(GMU_STORAGE_KEYS.USERS, users); },

  // Reset to full sample dataset
  resetToDemoData(notify = true) {
    const departments = [...SEED_DATA.departments];
    const classes = [...SEED_DATA.classes];
    const subjects = [...SEED_DATA.subjects];
    const faculty = [...SEED_DATA.faculty];
    const students = [...SEED_DATA.students];
    const attendance = generateSeedAttendance(students);
    const users = generateSeedUsers(faculty, students);

    this.saveDepartments(departments);
    this.saveClasses(classes);
    this.saveSubjects(subjects);
    this.saveStudents(students);
    this.saveFaculty(faculty);
    this.saveAttendance(attendance);
    this.saveUsers(users);

    if (notify) {
      showToast('GM University multi-department database reset to demo state!', 'success');
    }
  },

  // Auto create student user account
  autoCreateStudentAccount(student) {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.username.toLowerCase() === student.usn.toLowerCase());
    
    const accountData = {
      username: student.usn,
      password: 'student123',
      role: 'student',
      usn: student.usn,
      name: student.name,
      departmentId: student.departmentId,
      departmentCode: student.departmentCode,
      department: student.department,
      classSection: student.classSection,
      semester: student.semester,
      email: student.email,
      phone: student.phone
    };

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...accountData };
    } else {
      users.push(accountData);
    }

    this.saveUsers(users);
  },

  // Auto create faculty user account
  autoCreateFacultyAccount(faculty) {
    const users = this.getUsers();
    const username = faculty.email ? faculty.email.split('@')[0] : faculty.facultyId.toLowerCase();
    const existingIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());

    const accountData = {
      username: username,
      password: 'faculty123',
      role: 'faculty',
      facultyId: faculty.facultyId,
      name: faculty.name,
      departmentId: faculty.departmentId,
      departmentCode: faculty.departmentCode,
      department: faculty.department,
      authorizedDepartments: faculty.authorizedDepartments || [faculty.departmentId],
      email: faculty.email,
      phone: faculty.phone
    };

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...accountData };
    } else {
      users.push(accountData);
    }

    this.saveUsers(users);
    return username;
  }
};

// UI Toast Notification Helper
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || '•'}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Auto initialize on script load
StorageManager.init();
