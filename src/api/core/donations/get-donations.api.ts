import { DonationsDto, GlobalMetadataDto } from "@/types/type.ts";
import axiosInstance from "@/api/core";
import { useQuery } from "@tanstack/react-query";

type GetDonationApiDto = {
  q: string | null;
  page: string | null;
  size: string | null;
  from: string | null;
  to: string | null;
};
type GetDonationApiDtoResponse = {
  message: string;
  data: DonationsDto[];
  meta: GlobalMetadataDto;
};

const getDonationApi = async ([token, data]: [
  string,
  GetDonationApiDto
]): Promise<GetDonationApiDtoResponse> => {
  const params = new URLSearchParams(
    Object.entries(data)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  );
  const response = await axiosInstance.get(
    `/admin/donations${params.toString() ? `?${params.toString()}` : ""}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetDonationQuery = ([token, data]: [
  string,
  GetDonationApiDto
]) => {
  return useQuery({
    queryKey: [DONATION_QUERY_KEY, { ...data }],
    queryFn: ({ queryKey }) =>
      getDonationApi([token, queryKey[1] as GetDonationApiDto]),
  });
};

export const DONATION_QUERY_KEY = "donations";
