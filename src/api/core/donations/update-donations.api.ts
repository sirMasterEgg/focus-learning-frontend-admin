import { DonationsDto } from "@/types/type.ts";
import axiosInstance from "@/api/core";
import { useMutation } from "@tanstack/react-query";

type UpdateDonationApiDtoResponse = {
  message: string;
  data: DonationsDto;
};

const updateDonationApi = async ([token, id, data]: [
  string,
  string,
  FormData
]): Promise<UpdateDonationApiDtoResponse> => {
  const response = await axiosInstance.post(`/admin/donations/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    params: {
      _method: "PATCH",
    },
  });
  return response.data;
};

export const useUpdateDonationMutation = () => {
  return useMutation({
    mutationFn: updateDonationApi,
  });
};
