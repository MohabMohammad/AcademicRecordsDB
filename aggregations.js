
// 1. Student Transcript : Student info + courses + grades
db.enrollments.aggregate([

    {
        $lookup: {
            from: "students",
            localField: "student_id",
            foreignField: "_id",
            as: "student"
        }
    },
    { $unwind: "$student" },
    {
        $lookup: {
            from: "courses",
            localField: "course_id",
            foreignField: "_id",
            as: "course"
        }
    },
    { $unwind: "$course" },
    {
        $lookup: {
            from: "semesters",
            localField: "semester_id",
            foreignField: "_id",
            as: "semester"
        }
    },
    { $unwind: "$semester" },

    // group by student + semester + course to collect grades
    {
        $group: {
            _id: {
                student_id: "$student._id",
                semester_id: "$semester._id",
                course_id: "$course._id"
            },
            student_name: { $first: "$student.name" },
            student_email: { $first: "$student.email" },
            department: { $first: "$student.department" },
            semester_name: { $first: "$semester.name" },
            course_code: { $first: "$course.course_code" },
            course_name: { $first: "$course.course_name" },
            grades: { $push: "$grades" } // collect all grade objects into array
        }
    },

    // Group by student + semester to nest courses
    {
        $group: {
            _id: { student_id: "$_id.student_id", semester_id: "$_id.semester_id" },
            student_name: { $first: "$student_name" },
            student_email: { $first: "$student_email" },
            department: { $first: "$department" },
            semester_name: { $first: "$semester_name" },
            courses: {
                $push: {
                    course_code: "$course_code",
                    course_name: "$course_name",
                    grades: "$grades"
                }
            }
        }
    },

    // Group by student to nest semesters
    {
        $group: {
            _id: "$_id.student_id",
            student_name: { $first: "$student_name" },
            student_email: { $first: "$student_email" },
            department: { $first: "$department" },
            semesters: {
                $push: {
                    semester_name: "$semester_name",
                    courses: "$courses"
                }
            }
        }
    },

    {
        $project: {
            _id: 0,
            student_name: 1,
            student_email: 1,
            department: 1,
            semesters: 1
        }
    }
]);

// 2. Semester GPA Report : GPA per student per semester
db.enrollments.aggregate([
    {
        $lookup: {
            from: "students",
            localField: "student_id",
            foreignField: "_id",
            as: "student"
        }
    },
    { $unwind: "$student" },
    {
        $lookup: {
            from: "courses",
            localField: "course_id",
            foreignField: "_id",
            as: "course"
        }
    },
    { $unwind: "$course" },
    {
        $lookup: {
            from: "semesters",
            localField: "semester_id",
            foreignField: "_id",
            as: "semester"
        }
    },
    { $unwind: "$semester" },
    {
        $group: {
            _id: { student: "$student.name", semester: "$semester.name" },
            totalPoints: { $sum: { $multiply: ["$grades.total", "$course.credits"] } },
            totalCredits: { $sum: "$course.credits" }
        }
    },
    {
        $project: {
            student: "$_id.student",
            semester: "$_id.semester",
            GPA: { $divide: ["$totalPoints", "$totalCredits"] }
        }
    }
]);

//3. Course Statistics : Number of students + average grade per course
db.enrollments.aggregate([
    {
        $lookup: {
            from: "courses",
            localField: "course_id",
            foreignField: "_id",
            as: "course"
        }
    },
    { $unwind: "$course" },
    {
        $group: {
            _id: "$course.course_code",
            course_name: { $first: "$course.course_name" },
            department: { $first: "$course.department" },
            num_students: { $sum: 1 },
            avg_grade: { $avg: "$grades.total" }
        }
    },
    {
        $project: {
            _id: 0,
            course_name: 1,
            num_students: 1,
            avg_grade: 1
        }
    }
]);

//4. Top Performing Students : Top N students by GPA
db.enrollments.aggregate([
    {
        $lookup: {
            from: "students",
            localField: "student_id",
            foreignField: "_id",
            as: "student"
        }
    },
    { $unwind: "$student" },
    {
        $lookup: {
            from: "courses",
            localField: "course_id",
            foreignField: "_id",
            as: "course"
        }
    },
    { $unwind: "$course" },
    {
        $group: {
            _id: "$student.name",
            totalPoints: { $sum: { $multiply: ["$grades.total", "$course.credits"] } },
            totalCredits: { $sum: "$course.credits" }
        }
    },
    {
        $project: {
            student: "$_id",
            GPA: { $divide: ["$totalPoints", "$totalCredits"] }
        }
    },
    { $sort: { GPA: -1 } },
    { $limit: 5 }
]);

