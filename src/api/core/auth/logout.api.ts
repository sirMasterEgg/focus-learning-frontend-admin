import axiosInstance from "@/api/core";
import {useMutation} from "@tanstack/react-query";

type LogoutApiDto = {
  token: string;
};

const logoutApi = async ([data]: [
  LogoutApiDto
]): Promise<void> => {
  const response = await axiosInstance.post("/auth/logout", {}, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    }
  });
  return response.data;
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logoutApi,
  });
};