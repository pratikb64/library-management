import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export const BooksTableRowSkeleton = () => {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <TableRow key={i}>
          {[...Array(7)].map((_, i) => (
            <TableCell key={i}>
              <Skeleton className="h-8 w-full bg-gray-100" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
