import { ILoginDTO } from "@/types/user";
import api from "./api";
import { TCreateStudentDTO } from "@/types/student";
import { ICreateTeacherDTO } from "@/types/teacher";

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