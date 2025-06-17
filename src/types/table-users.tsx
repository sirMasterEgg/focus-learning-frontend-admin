import { ColumnDef } from "@tanstack/react-table";
import { GlobalUserDto } from "@/types/type.ts";

export type UsersTable = GlobalUserDto & {};

export const usersTableColumns: ColumnDef<UsersTable>[] = [
  {
    header: "No.",
    cell: ({ row }) => (row.index + 1).toString() + ".",
  },
  {
    accessorKey: "human_readable_id",
    header: "User ID",
  },
  {
    accessorKey: "name",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "created_at",
    header: "Date Created",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at).toLocaleDateString(
        "en-UK",
        {
          dateStyle: "medium",
        }
      );
      return `${date}`;
    },
  },
];
