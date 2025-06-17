import { GlobalMetadataDto, GlobalUserDto } from "@/types/type.ts";
import axiosInstance from "@/api/core";
import { useQuery } from "@tanstack/react-query";

type GetUsersApiDto = {
  q: string | null;
  page: string | null;
  size: string | null;
  from: string | null;
  to: string | null;
};
type GetUsersApiDtoResponse = {
  message: string;
  data: GlobalUserDto[];
  meta: GlobalMetadataDto;
};

const getUsersApi = async ([token, data]: [
  string,
  GetUsersApiDto
]): Promise<GetUsersApiDtoResponse> => {
  const params = new URLSearchParams(
    Object.entries(data)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  );
  const response = await axiosInstance.get(
    `/admin/users${params.toString() ? `?${params.toString()}` : ""}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useGetUsersQuery = ([token, data]: [string, GetUsersApiDto]) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, { ...data }],
    queryFn: ({ queryKey }) =>
      getUsersApi([token, queryKey[1] as GetUsersApiDto]),
  });
};

export const USERS_QUERY_KEY = "users";
