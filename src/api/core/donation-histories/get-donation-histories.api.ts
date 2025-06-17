import { DonationHistoriesDto, GlobalMetadataDto } from "@/types/type.ts";
import axiosInstance from "@/api/core";
import { useQuery } from "@tanstack/react-query";

type GetDonationHistoriesApiDto = {
  q: string | null;
  page: string | null;
  size: string | null;
  from: string | null;
  to: string | null;
};
type GetDonationHistoriesApiDtoResponse = {
  message: string;
  data: DonationHistoriesDto[];
  meta: GlobalMetadataDto;
};

const getDonationHistoriesApi = async ([token, data]: [
  string,
  GetDonationHistoriesApiDto
]): Promise<GetDonationHistoriesApiDtoResponse> => {
  const params = new URLSearchParams(
    Object.entries(data)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  );
  const response = await axiosInstance.get(`/admin/histories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      ...params,
    },
  });
  return response.data;
};

export const useGetDonationHistoryQuery = ([token, data]: [
  string,
  GetDonationHistoriesApiDto
]) => {
  return useQuery({
    queryKey: [DONATION_HISTORY_QUERY_KEY, { ...data }],
    queryFn: ({ queryKey }) =>
      getDonationHistoriesApi([
        token,
        queryKey[1] as GetDonationHistoriesApiDto,
      ]),
  });
};

export const DONATION_HISTORY_QUERY_KEY = "donation-histories";
