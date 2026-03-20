import { ILoginDTO } from "@/types/user";
import api from "./api";

export const callLogin = async (
  request: ILoginDTO,
) => {
  return await api.post("/auth/login", request);
};
