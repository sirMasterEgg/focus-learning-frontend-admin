import { ColumnDef } from "@tanstack/react-table";
import { DonationsDto } from "@/types/type.ts";

export type DonationListTable = DonationsDto & {};

export const donationListTableColumns: ColumnDef<DonationListTable>[] = [
  {
    header: "No.",
    cell: ({ row }) => (row.index + 1).toString() + ".",
  },
  {
    accessorKey: "human_readable_id",
    header: "Program Number",
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
    accessorKey: "title",
    header: "Program Name",
  },
  {
    accessorKey: "recipient",
    header: "Recipient",
  },
  {
    accessorKey: "target",
    header: "Target Amount",
    cell: ({ row }) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(row.original.target);
    },
  },
  {
    accessorKey: "current_donation",
    header: "Recieved Donation",
    cell: ({ row }) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(row.original.current_donation);
    },
  },
  {
    header: "Goal Percentage",
    cell: ({ row }) => {
      const percentage =
        (row.original.current_donation / row.original.target) * 100;

      if (percentage >= 100) {
        return (
          <span className="text-green-500 font-bold">
            {percentage}% (Completed)
          </span>
        );
      } else if (percentage > 0) {
        return <span className="text-red-500 font-bold">{percentage}%</span>;
      }

      return <span className="font-bold">{percentage}%</span>;
    },
  },
];
