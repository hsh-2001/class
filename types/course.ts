export interface ICourse {
    id: string;
    name: string;
    code: string;
    description: string;
    courseBanner: string;
    schoolId: string;
}

export type ICreateCourseDTO = Omit<ICourse, "id">;

export interface IUpdateCourseDTO extends Partial<Omit<ICourse, "schoolId">> {
    id: string;
}

export class CourseResponse implements ICourse {
    id: string;
    name: string;
    code: string;
    description: string;
    courseBanner: string;
    schoolId: string;

    constructor(data: ICourse) {
        this.id = data.id;
        this.name = data.name;
        this.code = data.code;
        this.courseBanner = data.courseBanner;
        this.description = data.description;
        this.schoolId = data.schoolId;
    }
}
