import { DonationHistoryStatisticsDto } from "@/types/type.ts";
import axiosInstance from "@/api/core";
import { useQuery } from "@tanstack/react-query";

type GetDonationHistoryStatisticApiDto = {
  from: string | null;
  to: string | null;
};
type GetDonationHistoryStatisticApiDtoResponse = {
  message: string;
  data: DonationHistoryStatisticsDto;
};

const getDonationHistoryStatisticApi = async ([token, data]: [
  string,
  GetDonationHistoryStatisticApiDto
]): Promise<GetDonationHistoryStatisticApiDtoResponse> => {
  const params = new URLSearchParams(
    Object.entries(data)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  );
  const response = await axiosInstance.get(`/admin/statistics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      ...params,
    },
  });
  return response.data;
};

export const useGetDonationHistoryStatisticsQuery = ([token, data]: [
  string,
  GetDonationHistoryStatisticApiDto
]) => {
  return useQuery({
    queryKey: [DONATION_HISTORY_QUERY_KEY, { ...data }],
    queryFn: ({ queryKey }) =>
      getDonationHistoryStatisticApi([
        token,
        queryKey[1] as GetDonationHistoryStatisticApiDto,
      ]),
  });
};

export const DONATION_HISTORY_QUERY_KEY = "donation-history-staistics";
