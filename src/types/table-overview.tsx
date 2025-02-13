import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";

export type OverviewTable = {
  invoice_number: string;
  date: Date;
  donor_name: string;
  program_name: string;
  amount: number;
  method: string;
  status: string;
};

export const overviewTableColumns: ColumnDef<OverviewTable>[] = [
  {
    header: "No.",
    cell: ({ row }) => (row.index + 1).toString() + ".",
  },
  {
    accessorKey: "invoice_number",
    header: "Invoice Number",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date).toLocaleDateString("en-UK", {
        dateStyle: "medium",
      });
      const time = new Date(row.original.date).toLocaleTimeString("en-UK", {
        timeStyle: "short",
      });
      return `${date} ${time}`;
    },
  },
  {
    accessorKey: "donor_name",
    header: "Donor Name",
  },
  {
    accessorKey: "program_name",
    header: "Program Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(row.original.amount);
      return amount;
    },
  },
  {
    accessorKey: "method",
    header: "Method",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      switch (row.original.status) {
        case "PAID":
          return (
            <>
              <Badge className="border-transparent bg-success text-success-foreground shadow hover:bg-success/80">
                {row.original.status}
              </Badge>
            </>
          );
        case "PENDING":
          return (
            <>
              <Badge variant="destructive">{row.original.status}</Badge>
            </>
          );
        case "CANCELED":
          return (
            <>
              <Badge>{row.original.status}</Badge>
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
  {
    header: "Action",
    cell: ({ row }) => {
      const view = row.original;

      return (
        <>
          <Button
            variant="outline"
            onClick={() => console.log(view.invoice_number)}
          >
            View
          </Button>
        </>
      );
    },
  },
];
