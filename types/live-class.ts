export type LiveClassStatus = "LIVE" | "UPCOMING" | "ENDED";

export interface ILiveClassItem {
    id: string;
    className: string;
    courseName: string;
    courseCode: string;
    teacherName: string;
    startDate: string;
    endDate: string | null;
    status: LiveClassStatus;
}

export interface ILiveClassPageData {
    sessions: ILiveClassItem[];
    canManage: boolean;
}

export class LiveClassResponse implements ILiveClassItem {
    id: string;
    className: string;
    courseName: string;
    courseCode: string;
    teacherName: string;
    startDate: string;
    endDate: string | null;
    status: LiveClassStatus;

    constructor(data: ILiveClassItem) {
        this.id = data.id;
        this.className = data.className;
        this.courseName = data.courseName;
        this.courseCode = data.courseCode;
        this.teacherName = data.teacherName;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.status = data.status;
    }
}
