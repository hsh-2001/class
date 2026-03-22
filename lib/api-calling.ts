import { ICreateAssignmentDTO } from "@/types/assignment";
import { ICreateClassDTO } from "@/types/class";
import { ILoginDTO } from "@/types/user";
import api from "./api";
import { TCreateStudentDTO, TUpdateStudentDTO } from "@/types/student";
import { ICreateTeacherDTO, IUpdateTeacherDTO } from "@/types/teacher";
import { ICreateCourseDTO, IUpdateCourseDTO } from "@/types/course";
import { IEnrollStudentCourseDTO } from "@/types/enrollment";
import { IUpdateProfileDTO } from "@/types/profile";

export const callLogin = async (request: ILoginDTO) => {
  return await api.post("/auth/login", request);
};

export const callCreateStudent = async (request: TCreateStudentDTO) => {
  return await api.post("/admin/student", request);
}

export const callCreateTeacher = async (request: ICreateTeacherDTO) => {
  return await api.post("/admin/teacher", request);
}

export const callGetStudents = async () => {
  return await api.get("/admin/student");
}

export const callGetTeachers = async () => {
  return await api.get("/admin/teacher");
}

export const callUpdateStudent = async (request: TUpdateStudentDTO) => {
  return await api.put("/admin/student", request);
}

export const callUpdateTeacher = async (request: IUpdateTeacherDTO) => {
  return await api.put("/admin/teacher", request);
}

export const callCreateCourse = async (request: Omit<ICreateCourseDTO, "schoolId">) => {
  return await api.post("/admin/course", request);
}

export const callGetCourses = async () => {
  return await api.get("/admin/course");
}

export const callUpdateCourse = async (request: IUpdateCourseDTO) => {
  return await api.put("/admin/course", request);
}

export const callCreateClass = async (request: ICreateClassDTO) => {
  return await api.post("/admin/class", request);
}

export const callGetClasses = async () => {
  return await api.get("/admin/class");
}

export const callGetAssignments = async () => {
  return await api.get("/assignment");
}

export const callCreateAssignment = async (request: ICreateAssignmentDTO) => {
  return await api.post("/assignment", request);
}

export const callGetLiveClasses = async () => {
  return await api.get("/live-class");
}

export const callGetStudentProfile = async () => {
  return await api.get("/student/update-profile");
}

export const callUpdateStudentProfile = async (request: IUpdateProfileDTO) => {
  return await api.put("/student/update-profile", request);
}

export const callGetStudentCourses = async () => {
  return await api.get("/student/course");
}

export const callEnrollStudentCourse = async (request: IEnrollStudentCourseDTO) => {
  return await api.post("/student/course", request);
}
