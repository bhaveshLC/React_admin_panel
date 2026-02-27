import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchKey?: keyof TData & string;
  isLoading?: boolean;
  emptyText?: string;
  actionNode?: ReactNode;
  // Server pagination — all three must be provided together
  page?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<TData>({
  data,
  columns,
  searchKey,
  isLoading,
  emptyText = 'No records found',
  actionNode,
  page,
  totalPages,
  totalItems,
  onPageChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Determine if we're in server-pagination mode
  const isServerPaginated =
    typeof page === 'number' &&
    typeof totalPages === 'number' &&
    typeof onPageChange === 'function';

  // Client-side search filter (only applied when NOT server-paginated, or as a local
  // prefix filter when server is driving pages)
  const filteredData = useMemo(() => {
    if (!searchKey || !globalFilter) return data;
    const lower = globalFilter.toLowerCase();
    return data.filter((row) =>
      String((row as Record<string, unknown>)[searchKey] ?? '').toLowerCase().includes(lower),
    );
  }, [data, globalFilter, searchKey]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // No getPaginationRowModel — pagination is handled server-side or via our own UI
    manualPagination: isServerPaginated,
    pageCount: totalPages ?? -1,
  });

  const canPrev = isServerPaginated ? (page ?? 1) > 1 : false;
  const canNext = isServerPaginated ? (page ?? 1) < (totalPages ?? 1) : false;

  const handlePrev = () => {
    if (isServerPaginated && canPrev) onPageChange!((page ?? 1) - 1);
  };

  const handleNext = () => {
    if (isServerPaginated && canNext) onPageChange!((page ?? 1) + 1);
  };

  return (
    <Card className="space-y-4 p-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        {actionNode}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td colSpan={columns.length} className="px-4 py-3">
                    <Skeleton className="h-8 w-full" />
                  </td>
                </tr>
              ))
              : table.getRowModel().rows.length > 0
                ? table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-muted/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
                : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-10 text-center text-muted-foreground"
                    >
                      {emptyText}
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {isServerPaginated && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages}
            {totalItems !== undefined && ` · ${totalItems} total`}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={!canPrev}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={handleNext} disabled={!canNext}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}