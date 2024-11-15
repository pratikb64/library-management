import { TableRowSkeleton } from "@/components/TableRowSkeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  Table as TableType,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect } from "react";

interface Props {
  columns: ColumnDef<any>[];
  data: any[];
  pageSize: number;
  setTableInstance?: (table: TableType<any> | undefined) => void;
  tableSearch?: React.ReactNode;
  columnVisibility?: Record<string, boolean>;
  showPagination?: boolean;
  isDataFetching?: boolean;
  isDataFetchingFailed?: boolean;
  enableMultiRowSelection?: boolean;
}

export const AppTable = (props: Props) => {
  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableMultiRowSelection: props.enableMultiRowSelection || false,
    initialState: {
      pagination: {
        pageSize: props.pageSize,
      },
      columnVisibility: props.columnVisibility,
    },
  });

  useEffect(() => {
    props.setTableInstance?.(table);
  }, [props.setTableInstance, table]);

  return (
    <div>
      <div>{props.tableSearch}</div>
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
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 &&
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!props.isDataFetchingFailed &&
            !props.isDataFetching &&
            !table.getRowModel().rows?.length && (
              <TableRow>
                <TableCell
                  colSpan={props.columns.length}
                  className="h-16 text-center"
                >
                  Data not found.
                </TableCell>
              </TableRow>
            )}

          {!props.isDataFetchingFailed && props.isDataFetching && (
            <TableRowSkeleton
              rows={props.pageSize}
              columns={props.columns.length}
            />
          )}

          {props.isDataFetchingFailed && (
            <TableRow>
              <TableCell
                colSpan={props.columns.length}
                className="h-16 text-center"
              >
                Error fetching data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {props.showPagination && (
        <div className="mt-2 flex items-center justify-center space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
