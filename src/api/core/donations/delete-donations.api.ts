import axiosInstance from "@/api/core";
import { useMutation } from "@tanstack/react-query";

const deleteDonationApi = async ([token, id]: [
  string,
  string
]): Promise<void> => {
  const response = await axiosInstance.delete(`/admin/donations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useDeleteDonationMutation = () => {
  return useMutation({
    mutationFn: deleteDonationApi,
  });
};
