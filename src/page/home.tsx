import DashboardCard from "@/components/card.tsx";
import { DollarSign, LinkIcon, LoaderCircle, Users } from "lucide-react";
import { Card } from "@/components/ui/card.tsx";
import { DataTable } from "@/components/datatable.tsx";
import {
  OverviewTable,
  overviewTableColumns,
} from "@/types/table-overview.tsx";
import PageSize from "@/components/page-size.tsx";
import TextFilter from "@/components/text-filter.tsx";
import { useGetDonationHistoryQuery } from "@/api/core/donation-histories/get-donation-histories.api.ts";
import { RootState } from "@/stores/store.ts";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useGetDonationHistoryStatisticsQuery } from "@/api/core/donation-histories/get-donation-history-statistics.api.ts";
import { Button } from "@/components/ui/button.tsx";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import DonationHistoryModal from "@/components/donation-history-modal.tsx";

export default function Home() {
  const auth = useSelector((state: RootState) => state.auth);
  const [searchParams] = useSearchParams();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedDonation, setSelectedDonation] = useState<string>("");

  const { data: histories, isLoading } = useGetDonationHistoryQuery([
    auth.token || "",
    {
      q: searchParams.get("q"),
      page: searchParams.get("page"),
      size: searchParams.get("size"),
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    },
  ]);

  const { data: stats, isLoading: isLoadingHistory } =
    useGetDonationHistoryStatisticsQuery([
      auth.token || "",
      {
        from: searchParams.get("from"),
        to: searchParams.get("to"),
      },
    ]);

  const columns = [
    ...overviewTableColumns,
    {
      header: "Action",
      cell: ({ row }: { row: Row<OverviewTable> }) => {
        const view = row.original;

        return (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedDonation(view.human_readable_id);
                setOpenDialog(true);
              }}
            >
              View
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          label="Total Recieved Donation"
          icon={DollarSign}
          amount={
            stats?.data && BigInt(stats.data.total_donations) > 0
              ? BigInt(stats?.data?.total_donations).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })
              : "No data"
          }
          description=""
          isLoading={isLoadingHistory}
        />
        <DashboardCard
          label="Total User"
          icon={Users}
          amount={
            stats?.data && BigInt(stats.data.total_users) > 0
              ? BigInt(stats?.data?.total_users).toLocaleString("id-ID", {
                  style: "decimal",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })
              : "No data"
          }
          description=""
          isLoading={isLoadingHistory}
        />
        <DashboardCard
          label="Active Program"
          icon={LinkIcon}
          amount={
            stats?.data && BigInt(stats.data.total_active_programs) > 0
              ? BigInt(stats?.data?.total_active_programs).toLocaleString(
                  "id-ID",
                  {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }
                )
              : "No data"
          }
          description=""
          isLoading={isLoadingHistory}
        />
      </div>
      <Card>
        <h1 className="p-6 text-xl font-semibold">Donation History</h1>
        <div className="px-6 pb-6">
          <div className="py-4 inline-flex flex-row items-center gap-5">
            <PageSize />
            <TextFilter placeholder="Find Invoice Number" />
          </div>
          {isLoading ? (
            <>
              <div className="flex items-center justify-center min-h-80">
                <LoaderCircle className="animate-spin" />
              </div>
            </>
          ) : (
            histories && (
              <>
                <DataTable
                  columns={columns}
                  data={histories?.data}
                  meta={histories?.meta}
                />
                <DonationHistoryModal
                  donationId={selectedDonation}
                  isOpen={openDialog}
                  onOpenChange={setOpenDialog}
                />
              </>
            )
          )}
        </div>
      </Card>
    </>
  );
}
