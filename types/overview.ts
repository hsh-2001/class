export interface IOverview {
  total_students: number;
  total_teachers: number;
  total_classes: number;
  total_courses: number;
  total_groups: number;
  courses_with_classes: CourseWithClasses[];
  courses_with_no_classes: CourseNoClasses[];
}

export interface CourseWithClasses {
  course_id: string;
  course_name: string;
  classes: ClassItem[];
}

export interface CourseNoClasses {
  course_id: string;
  course_name: string;
}

export interface ClassItem {
  class_id: string;
  class_name: string;
}