export interface ICreateAssignmentDTO {
    classId: string;
    title: string;
    dueDate: string;
}

export interface IAssignmentClassOption {
    value: string;
    label: string;
}

export interface IAssignmentListItem {
    id: string;
    title: string;
    dueDate: string;
    createdAt: string;
    classId: string;
    className: string;
    courseName: string;
    courseCode: string;
    teacherName: string;
}

export interface IAssignmentPageData {
    assignments: IAssignmentListItem[];
    classOptions: IAssignmentClassOption[];
    canManage: boolean;
}

export class AssignmentResponse implements IAssignmentListItem {
    id: string;
    title: string;
    dueDate: string;
    createdAt: string;
    classId: string;
    className: string;
    courseName: string;
    courseCode: string;
    teacherName: string;

    constructor(data: IAssignmentListItem) {
        this.id = data.id;
        this.title = data.title;
        this.dueDate = data.dueDate;
        this.createdAt = data.createdAt;
        this.classId = data.classId;
        this.className = data.className;
        this.courseName = data.courseName;
        this.courseCode = data.courseCode;
        this.teacherName = data.teacherName;
    }
}
