use AcademicRecordsDB;

// Clean existing data
db.students.deleteMany({});
db.courses.deleteMany({});
db.semesters.deleteMany({});
db.enrollments.deleteMany({});

// Insert Semesters
const semesters = db.semesters.insertMany([
  { name: "Fall 2025", year: 2025, term: "Fall" },
  { name: "Spring 2026", year: 2026, term: "Spring" }
]).insertedIds;

// Insert Courses
const courses = db.courses.insertMany([
  { course_code: "CS101", course_name: "Introduction to Programming", credits: 3, department: "CS" },
  { course_code: "CS202", course_name: "Data Structures", credits: 4, department: "CS" },
  { course_code: "IS201", course_name: "Database Systems", credits: 3, department: "IS" },
  { course_code: "AI301", course_name: "Machine Learning", credits: 4, department: "AI" },
  { course_code: "CS305", course_name: "Operating Systems", credits: 4, department: "CS" }
]).insertedIds;

// Insert Students (10)
const students = db.students.insertMany([
  { name: "Ahmed Hassan", email: "ahmed.hassan@uni.edu", department: "CS", level: 2 },
  { name: "Sara Mohamed", email: "sara.mohamed@uni.edu", department: "IS", level: 3 },
  { name: "Omar Ali", email: "omar.ali@uni.edu", department: "AI", level: 4 },
  { name: "Mona Adel", email: "mona.adel@uni.edu", department: "CS", level: 1 },
  { name: "Youssef Samir", email: "youssef.samir@uni.edu", department: "IS", level: 2 },
  { name: "Nour Khaled", email: "nour.khaled@uni.edu", department: "AI", level: 3 },
  { name: "Hassan Ibrahim", email: "hassan.ibrahim@uni.edu", department: "CS", level: 4 },
  { name: "Laila Fathy", email: "laila.fathy@uni.edu", department: "IS", level: 1 },
  { name: "Kareem Mostafa", email: "kareem.mostafa@uni.edu", department: "CS", level: 3 },
  { name: "Salma Nabil", email: "salma.nabil@uni.edu", department: "AI", level: 2 }
]).insertedIds;

// Insert Enrollments (20)
db.enrollments.insertMany([

  // ----- Fall 2025 -----
  { student_id: students[0], course_id: courses[0], semester_id: semesters[0], grades: { midterm: 25, final: 60, total: 85 } },
  { student_id: students[1], course_id: courses[2], semester_id: semesters[0], grades: { midterm: 22, final: 58, total: 80 } },
  { student_id: students[2], course_id: courses[3], semester_id: semesters[0], grades: { midterm: 28, final: 62, total: 90 } },
  { student_id: students[3], course_id: courses[0], semester_id: semesters[0], grades: { midterm: 20, final: 55, total: 75 } },
  { student_id: students[4], course_id: courses[2], semester_id: semesters[0], grades: { midterm: 23, final: 57, total: 80 } },
  { student_id: students[5], course_id: courses[3], semester_id: semesters[0], grades: { midterm: 26, final: 61, total: 87 } },
  { student_id: students[6], course_id: courses[4], semester_id: semesters[0], grades: { midterm: 24, final: 60, total: 84 } },
  { student_id: students[7], course_id: courses[1], semester_id: semesters[0], grades: { midterm: 21, final: 56, total: 77 } },
  { student_id: students[8], course_id: courses[4], semester_id: semesters[0], grades: { midterm: 26, final: 61, total: 87 } },
  { student_id: students[9], course_id: courses[2], semester_id: semesters[0], grades: { midterm: 25, final: 58, total: 83 } },

  // ----- Spring 2026 -----
  { student_id: students[0], course_id: courses[1], semester_id: semesters[1], grades: { midterm: 26, final: 60, total: 86 } },
  { student_id: students[1], course_id: courses[3], semester_id: semesters[1], grades: { midterm: 24, final: 58, total: 82 } },
  { student_id: students[2], course_id: courses[0], semester_id: semesters[1], grades: { midterm: 27, final: 61, total: 88 } },
  { student_id: students[3], course_id: courses[2], semester_id: semesters[1], grades: { midterm: 22, final: 55, total: 77 } },
  { student_id: students[4], course_id: courses[4], semester_id: semesters[1], grades: { midterm: 25, final: 59, total: 84 } },
  { student_id: students[5], course_id: courses[1], semester_id: semesters[1], grades: { midterm: 26, final: 62, total: 88 } },
  { student_id: students[6], course_id: courses[0], semester_id: semesters[1], grades: { midterm: 23, final: 57, total: 80 } },
  { student_id: students[7], course_id: courses[3], semester_id: semesters[1], grades: { midterm: 24, final: 60, total: 84 } },
  { student_id: students[8], course_id: courses[1], semester_id: semesters[1], grades: { midterm: 27, final: 63, total: 90 } },
  { student_id: students[9], course_id: courses[4], semester_id: semesters[1], grades: { midterm: 25, final: 59, total: 84 } }

]);

print("All data inserted successfully (20 enrollments).");
