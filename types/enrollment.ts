export interface IStudentCourseEnrollmentItem {
    courseId: string;
    courseName: string;
    courseCode: string;
    courseDescription: string;
    courseBanner: string;
    classId: string;
    className: string;
    startDate: string;
    endDate: string | null;
    isEnrolled: boolean;
    enrolledAt: string | null;
}

export interface IEnrollStudentCourseDTO {
    classId: string;
}
