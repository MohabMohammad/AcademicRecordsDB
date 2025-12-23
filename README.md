# Task 1 – Database Design & Schema  
## Academic Records System

---

## 1. System Overview

The **Academic Records System** is designed to manage university academic data using **MongoDB** and **NoSQL design principles**.

The system stores information about:
- Students  
- Courses  
- Academic semesters  
- Student enrollments  
- Grades achieved per course per semester  

The design follows MongoDB best practices by balancing **embedded documents** and **referenced relationships** to ensure **data integrity**, **flexibility**, and **efficient querying**.

---

## 2. Collections Overview

The database consists of the following main collections:

- `students`
- `courses`
- `semesters`
- `enrollments`

Each collection has a clear responsibility and avoids unnecessary data duplication.

---

## 3. Collection Schemas & Design Decisions

### 3.1 `students` Collection

Stores personal and academic information for each student.

**Fields:**
- `_id` (ObjectId): Unique identifier for the student  
- `name` (String): Full name of the student  
- `email` (String): Student email address (**must be unique**)  
- `department` (String): Academic department (e.g., CS, IS, AI)  
- `level` (Number): Academic level or year of study  

**Design Notes:**
- The `email` field is unique to ensure proper student identification.
- Student data is stored separately and **referenced** in enrollments to avoid duplication.

---

### 3.2 `courses` Collection

Stores information about university courses.

**Fields:**
- `_id` (ObjectId): Unique identifier for the course  
- `course_code` (String): Course code (e.g., CS101)  
- `course_name` (String): Course title  
- `credits` (Number): Credit hours for the course  
- `department` (String): Department offering the course  

**Design Notes:**
- Courses are stored independently to allow reuse across semesters.
- Referencing avoids repeating course data in enrollment records.

---

### 3.3 `semesters` Collection

Stores academic semester information.

**Fields:**
- `_id` (ObjectId): Unique identifier for the semester  
- `name` (String): Semester name (e.g., Fall 2025)  
- `year` (Number): Academic year  
- `term` (String): Term type (Fall / Spring / Summer)  

**Design Notes:**
- Semesters are stored as a separate collection to maintain consistency.
- Referencing allows easy filtering and aggregation by semester.

---

### 3.4 `enrollments` Collection

Represents the relationship between students, courses, and semesters, including grades.

**Fields:**
- `_id` (ObjectId): Unique identifier for the enrollment record  
- `student_id` (ObjectId): Reference to `students._id`  
- `course_id` (ObjectId): Reference to `courses._id`  
- `semester_id` (ObjectId): Reference to `semesters._id`  
- `grades` (Embedded Document):
  - `midterm` (Number)
  - `final` (Number)
  - `total` (Number)

**Design Notes:**
- This collection uses **referencing** to link students, courses, and semesters.
- The `grades` object is **embedded** because:
  - Grades are tightly coupled to a specific enrollment.
  - Grades are always accessed with the enrollment.
  - Embedding improves read performance and keeps data logically grouped.

---

## 4. Embedded vs Referenced Data

### Embedded Data

- **Grades** are embedded inside the `enrollments` collection.

**Reason:**
- Grades do not exist independently from an enrollment.
- They are always retrieved with enrollment data.
- Embedding avoids unnecessary joins and improves query performance.

---

### Referenced Data

- **Students**, **courses**, and **semesters** are referenced using ObjectIds.

**Reason:**
- These entities are shared across multiple enrollments.
- Referencing prevents data duplication.
- Allows independent updates without affecting enrollment records.

---

## 5. Data Integrity & Constraints

The following constraints are enforced at the database level (implemented in later tasks):

### Unique Student Email
- Each student must have a unique email address.

### No Duplicate Enrollments
- A student cannot enroll in the same course during the same semester more than once.
- Enforced using a **compound unique index** on:
  - `student_id`
  - `course_id`
  - `semester_id`

### Grades Per Enrollment
- Grades are stored per enrollment, not per student or per course.

---

## 6. Design Summary

- The schema follows MongoDB document modeling best practices.
- Embedding is used where data is tightly coupled.
- Referencing is used for shared and reusable entities.
- The design supports efficient **CRUD operations** and **aggregation pipelines** such as GPA calculation and transcript generation.
  
---


#  Aggregation Pipelines Documentation

## 1. 🎓 Student Transcript

**Number of Pipelines:** 5 stages

**What Each Pipeline Does:**

* `$lookup` → Join `students` collection to get student info.
* `$lookup` → Join `courses` collection to get course details.
* `$lookup` → Join `semesters` collection to get semester info.
* `$group` → Nest grades under each course, then courses under each semester, then semesters under each student.
* `$project` → Shape the final output: student → semesters → courses → grades.

---

## 2. 📊 Semester GPA Report

**Number of Pipelines:** 6 stages

**What Each Pipeline Does:**

* `$lookup` → Join `students` collection for student info.
* `$lookup` → Join `courses` collection for course credits.
* `$lookup` → Join `semesters` collection for semester info.
* `$group` → Calculate weighted grade points (`total × credits`) and sum credits per student per semester.
* `$project` → Compute GPA = totalPoints ÷ totalCredits.

---

## 3. 📚 Course Statistics

**Number of Pipelines:** 4 stages

**What Each Pipeline Does:**

* `$lookup` → Join `courses` collection to get course details.
* `$unwind` → Flatten the course array.
* `$group` → Count number of students enrolled and calculate average grade per course.
* `$project` → Output course code, name, department, number of students, and average grade.

---

## 4. 🏆 Top Performing Students

**Number of Pipelines:** 6 stages

**What Each Pipeline Does:**

* `$lookup` → Join `students` collection for student info.
* `$lookup` → Join `courses` collection for course credits.
* `$group` → Calculate total grade points and total credits per student.
* `$project` → Compute GPA for student.
* `$sort` → Rank students by GPA (descending).
* `$limit` → Return top N students.

