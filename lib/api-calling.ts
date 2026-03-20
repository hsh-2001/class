import { ILoginDTO } from "@/types/user";
import api from "./api";
import { TCreateStudentDTO } from "@/types/student";

export const callLogin = async (request: ILoginDTO) => {
  return await api.post("/auth/login", request);
};

export const callCreateStudent = async (request: TCreateStudentDTO) => {
  return await api.post("/admin/student", request);
}

export const callGetStudents = async () => {
  return await api.get("/admin/student");
}