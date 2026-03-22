export interface IClass {
    id: string;
    name: string;
    courseId: string;
    teacherId: string;
    startDate: string;
    endDate: string | null;
    schoolId: string | null;
}

export interface ICreateClassDTO {
    name: string;
    courseId: string;
    teacherId: string;
    startDate: string;
    endDate?: string | null;
}

export interface IClassListItem extends IClass {
    courseName: string;
    courseCode: string;
    teacherName: string;
}

export class ClassResponse implements IClassListItem {
    id: string;
    name: string;
    courseId: string;
    teacherId: string;
    startDate: string;
    endDate: string | null;
    schoolId: string | null;
    courseName: string;
    courseCode: string;
    teacherName: string;

    constructor(data: IClassListItem) {
        this.id = data.id;
        this.name = data.name;
        this.courseId = data.courseId;
        this.teacherId = data.teacherId;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.schoolId = data.schoolId;
        this.courseName = data.courseName;
        this.courseCode = data.courseCode;
        this.teacherName = data.teacherName;
    }
}
