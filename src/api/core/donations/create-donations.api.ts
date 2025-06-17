import axiosInstance from "@/api/core";
import { useMutation } from "@tanstack/react-query";
import { DonationsDto } from "@/types/type.ts";

/*
type CreateDonationApiDto = {
  title: string;
  recipient: string;
  description: string;
  thumbnail: File;
  program_image: File;
  target: number;
  is_active: boolean;
};
*/

type CreateDonationApiDtoResponse = {
  message: string;
  data: DonationsDto;
};

const createDonationApi = async ([token, data]: [
  string,
  FormData
]): Promise<CreateDonationApiDtoResponse> => {
  const response = await axiosInstance.post("/admin/donations", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useCreateDonationMutation = () => {
  return useMutation({
    mutationFn: createDonationApi,
  });
};
