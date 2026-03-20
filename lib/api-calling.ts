import { ILoginDTO } from "@/types/user";
import { AxiosResponse } from "axios";
import api from "./api";

type LoginSuccessPayload = {
  data?: {
    token: string;
    refreshToken: string;
  };
  message?: string;
};

export const callLogin = async (
  request: ILoginDTO,
) => {
  return await api.post("/auth/login", request);
};
