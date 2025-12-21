use AcademicRecordsDB;
// 1. Unique index on student email
db.students.createIndex(
  { email: 1 },
  { unique: true }
);

// 2. Compound unique index to prevent duplicate enrollments
db.enrollments.createIndex(
  { student_id: 1, course_id: 1, semester_id: 1 },
  { unique: true }
);

print("Indexes created successfully.");
