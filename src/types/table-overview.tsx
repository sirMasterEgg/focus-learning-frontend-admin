import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge.tsx";
import { DonationHistoriesDto } from "@/types/type.ts";

export type OverviewTable = DonationHistoriesDto & {};

export const overviewTableColumns: ColumnDef<OverviewTable>[] = [
  {
    header: "No.",
    cell: ({ row }) => (row.index + 1).toString() + ".",
  },
  {
    accessorKey: "human_readable_id",
    header: "Invoice Number",
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at).toLocaleDateString(
        "en-UK",
        {
          dateStyle: "medium",
        }
      );
      const time = new Date(row.original.created_at).toLocaleTimeString(
        "en-UK",
        {
          timeStyle: "short",
        }
      );
      return `${date} ${time}`;
    },
  },
  {
    accessorKey: "name",
    header: "Donor Name",
  },
  {
    accessorKey: "program_name",
    header: "Program Name",
  },
  {
    accessorKey: "donation_amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(row.original.donation_amount);
      return amount;
    },
  },
  {
    accessorKey: "payment.method",
    header: "Method",
  },
  {
    accessorKey: "payment.status",
    header: "Status",
    cell: ({ row }) => {
      switch (row.original.payment.status.toUpperCase()) {
        case "SUCCESS":
          return (
            <>
              <Badge className="border-transparent bg-success text-success-foreground shadow hover:bg-success/80">
                {row.original.payment.status.toUpperCase()}
              </Badge>
            </>
          );
        case "PENDING":
          return (
            <>
              <Badge variant="destructive">
                {row.original.payment.status.toUpperCase()}
              </Badge>
            </>
          );
        case "FAILED":
          return (
            <>
              <Badge>{row.original.payment.status.toUpperCase()}</Badge>
            </>
          );
      }

      return (
        <>
          <Badge variant="secondary">UNKNOWN</Badge>
        </>
      );
    },
  },
];
