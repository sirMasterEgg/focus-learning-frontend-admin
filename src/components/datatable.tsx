import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { GlobalMetadataDto } from "@/types/type.ts";
import { useSearchParams } from "react-router-dom";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: GlobalMetadataDto;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
}: DataTableProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleNextPage = () => {
    const temp: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      temp[key] = value;
    });

    temp["page"] =
      meta.current_page < meta.last_page
        ? (meta.current_page + 1).toString()
        : meta.last_page.toString();

    setSearchParams(temp);
  };

  const handlePreviousPage = () => {
    const temp: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      temp[key] = value;
    });

    temp["page"] =
      meta.current_page > 1 ? (meta.current_page - 1).toString() : "1";

    setSearchParams(temp);
  };

  return (
    <>
      {data.length === 0 ? (
        <div className="flex items-center justify-center">
          No data to be displayed
        </div>
      ) : (
        <div className="rounded-md border overflow-y-auto max-h-80">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePreviousPage()}
          disabled={meta.current_page === 1}
        >
          <ChevronLeft />
        </Button>
        <Button asChild>
          <Badge>{meta.current_page}</Badge>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNextPage()}
          disabled={meta.current_page === meta.last_page}
        >
          <ChevronRight />
        </Button>
      </div>
    </>
  );
}
