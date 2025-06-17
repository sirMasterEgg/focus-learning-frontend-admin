import PageSize from "@/components/page-size.tsx";
import TextFilter from "@/components/text-filter.tsx";
import { Card } from "@/components/ui/card.tsx";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store.ts";
import { useState } from "react";
import {
  DONATION_QUERY_KEY,
  useGetDonationQuery,
} from "@/api/core/donations/get-donations.api.ts";
import { useSearchParams } from "react-router-dom";
import {
  DonationListTable,
  donationListTableColumns,
} from "@/types/table-donation-program.tsx";
import CreateDonationProgram from "@/components/create-donation-program.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Check,
  Info,
  LoaderCircle,
  MoreHorizontal,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { Row } from "@tanstack/react-table";
import { DataTable } from "@/components/datatable.tsx";
import { DonationActionModal } from "@/components/donation-action-modal.tsx";
import { useUpdateDonationMutation } from "@/api/core/donations/update-donations.api.ts";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge.tsx";

export default function DonationProgram() {
  const auth = useSelector((state: RootState) => state.auth);
  const [searchParams] = useSearchParams();
  const getDonationQuery = useGetDonationQuery([
    auth.token || "",
    {
      q: searchParams.get("q"),
      page: searchParams.get("page"),
      size: searchParams.get("size"),
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] =
    useState<DonationListTable | null>(null);
  const [actionType, setActionType] = useState<"view" | "edit" | "delete" | "">(
    ""
  );

  const openModal = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    action: "view" | "edit" | "delete",
    donation: DonationListTable
  ) => {
    event.preventDefault();

    setActionType(action);
    setSelectedDonation(donation);
    setModalOpen(true);
  };

  const updateStatusMutation = useUpdateDonationMutation();
  const queryClient = useQueryClient();
  const [loadingRow, setLoadingRow] = useState<string>("");

  const handleUpdateStatus = (donation: DonationListTable) => {
    setLoadingRow(donation.id);

    const form = new FormData();
    form.append("is_active", !donation.is_active ? "1" : "0");

    updateStatusMutation.mutate(
      [auth.token as string, donation.human_readable_id, form],
      {
        onSettled: () => {
          queryClient
            .invalidateQueries({ queryKey: [DONATION_QUERY_KEY] })
            .then(() => {
              setLoadingRow("");
            });
        },
      }
    );
  };

  const columns = [
    ...donationListTableColumns,
    {
      header: "Status",
      cell: ({ row }: { row: Row<DonationListTable> }) => {
        if (row.original.deleted_at) {
          return <Badge variant={"secondary"}>Deleted</Badge>;
        }

        if (loadingRow && loadingRow === row.original.id) {
          return <LoaderCircle className="animate-spin" />;
        }

        return row.original.is_active ? (
          <Badge className="border-transparent bg-success text-success-foreground shadow hover:bg-success/80">
            Active
          </Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }: { row: Row<DonationListTable> }) => {
        const donation = row.original;
        if (donation.deleted_at) {
          return null;
        }

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0" disabled={!!loadingRow}>
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!donation.is_active ? (
                  <DropdownMenuItem
                    onClick={() => handleUpdateStatus(donation)}
                  >
                    <Check />
                    Activate
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleUpdateStatus(donation)}
                  >
                    <X />
                    Deactivate
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => openModal(e, "view", donation)}
                >
                  <Info />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => openModal(e, "edit", donation)}
                >
                  <SquarePen />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500 focus:bg-red-100/50 focus:text-red-500"
                  onClick={(e) => openModal(e, "delete", donation)}
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Card>
        <div className="p-6 inline-flex flex-row justify-between items-center w-full">
          <h1 className="text-xl font-semibold">Donation Program List</h1>
          <CreateDonationProgram />
        </div>
        <div className="px-6 pb-6">
          <div className="py-4 inline-flex flex-row items-center gap-5">
            <PageSize />
            <TextFilter placeholder="Find Program Name" />
          </div>
          {getDonationQuery.isLoading ? (
            <>
              <div className="flex items-center justify-center min-h-80">
                <LoaderCircle className="animate-spin" />
              </div>
            </>
          ) : (
            getDonationQuery.data?.data && (
              <>
                <DataTable
                  columns={columns}
                  data={getDonationQuery?.data?.data}
                  meta={getDonationQuery?.data?.meta}
                />
                <DonationActionModal
                  isOpen={modalOpen}
                  onOpenChange={setModalOpen}
                  donation={selectedDonation}
                  actionType={actionType}
                />
              </>
            )
          )}
        </div>
      </Card>
    </>
  );
}
