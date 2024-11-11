import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

interface Props {
  rows: number;
  columns: number;
}

export const TableRowSkeleton = (props: Props) => {
  return (
    <>
      {[...Array(props.rows)].map((_, i) => (
        <TableRow key={i}>
          {[...Array(props.columns)].map((_, i) => (
            <TableCell key={i}>
              <Skeleton className="h-8 w-full bg-gray-100" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
