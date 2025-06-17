import { DetailDonationHistoryDto } from "@/types/type.ts";
import axiosInstance from "@/api/core";
import { useQuery } from "@tanstack/react-query";

type GetDetailDonationHistoryApiDto = {
  id: string;
};
type GetDetailDonationHistoryApiDtoResponse = {
  message: string;
  data: DetailDonationHistoryDto;
};

const getDetailDonationHistoriesApi = async ([token, data]: [
  string,
  GetDetailDonationHistoryApiDto
]): Promise<GetDetailDonationHistoryApiDtoResponse> => {
  const response = await axiosInstance.get(`/admin/histories/${data.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useGetDetailDonationHistoryQuery = ([token, data]: [
  string,
  GetDetailDonationHistoryApiDto
]) => {
  return useQuery({
    queryKey: [DETAIL_DONATION_QUERY_KEY, { ...data }],
    enabled: !!data.id,
    queryFn: ({ queryKey }) =>
      getDetailDonationHistoriesApi([
        token,
        queryKey[1] as GetDetailDonationHistoryApiDto,
      ]),
  });
};

export const DETAIL_DONATION_QUERY_KEY = "detail-donation-histories";
