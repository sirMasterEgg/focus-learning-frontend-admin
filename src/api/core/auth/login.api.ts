import axiosInstance from "@/api/core";
import { useMutation } from "@tanstack/react-query";
import { GlobalUserDto } from "@/types/type.ts";

type LoginApiDto = {
  email: string;
  password: string;
};

type LoginApiDtoResponse = {
  message: string;
  data: {
    user: GlobalUserDto;
    token: string;
  };
};

const loginApi = async ([data]: [
  LoginApiDto
]): Promise<LoginApiDtoResponse> => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginApi,
  });
};
