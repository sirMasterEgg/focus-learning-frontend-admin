import PageSize from "@/components/page-size.tsx";
import TextFilter from "@/components/text-filter.tsx";
import { Card } from "@/components/ui/card.tsx";
import { DataTable } from "@/components/datatable.tsx";
import { LoaderCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store.ts";
import { useSearchParams } from "react-router-dom";
import { useGetUsersQuery } from "@/api/core/users/get-users.api.ts";
import { usersTableColumns } from "@/types/table-users.tsx";

export default function UsersMonitoring() {
  const auth = useSelector((state: RootState) => state.auth);
  const [searchParams] = useSearchParams();
  const getUsersQuery = useGetUsersQuery([
    auth.token || "",
    {
      q: searchParams.get("q"),
      page: searchParams.get("page"),
      size: searchParams.get("size"),
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    },
  ]);

  return (
    <>
      <Card>
        <div className="p-6 inline-flex flex-row justify-between items-center w-full">
          <h1 className="text-xl font-semibold">User List</h1>
        </div>
        <div className="px-6 pb-6">
          <div className="py-4 inline-flex flex-row items-center gap-5">
            <PageSize />
            <TextFilter placeholder="Find User" />
          </div>
          {getUsersQuery.isLoading ? (
            <>
              <div className="flex items-center justify-center min-h-96">
                <LoaderCircle className="animate-spin" />
              </div>
            </>
          ) : (
            getUsersQuery.data?.data && (
              <>
                <DataTable
                  columns={usersTableColumns}
                  data={getUsersQuery?.data?.data}
                  meta={getUsersQuery?.data?.meta}
                />
              </>
            )
          )}
        </div>
      </Card>
    </>
  );
}
