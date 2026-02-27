import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { DeleteConfirmDialog } from '@/components/modals/DeleteConfirmDialog';
import { InvestorFormModal, type InvestorFormValues } from '@/components/modals/InvestorFormModal';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { investorsService } from '@/services/api';
import type { Investor } from '@/types/models';
import { useCrudPage } from '@/hooks/UseCrudPage';

export function Investors() {
  const {
    items: investors,
    loading,
    submitLoading,
    page,
    totalPages,
    totalItems,
    modalOpen,
    selected,
    deleteTarget,
    setPage,
    setDeleteTarget,
    handleSubmit,
    handleDelete,
    openCreate,
    openEdit,
    closeModal,
  } = useCrudPage<Investor>({
    service: investorsService as never,
    entityName: 'Investor',
    getId: (inv) => inv._id,
  });

  const columns = useMemo<ColumnDef<Investor>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'firmName', header: 'Firm' },
      { accessorKey: 'investmentFocus', header: 'Focus' },
      { accessorKey: 'investmentStage', header: 'Stage' },
      { accessorKey: 'investmentRange', header: 'Range' },
      { accessorKey: 'location', header: 'Location' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => openEdit(row.original)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(row.original)}>
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [openEdit, setDeleteTarget],
  );

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Investors</h2>
      <DataTable
        data={investors}
        columns={columns}
        searchKey="name"
        isLoading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        emptyText="No investors found. Add your first investor."
        actionNode={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Investor
          </Button>
        }
      />

      <InvestorFormModal
        open={modalOpen}
        onOpenChange={closeModal}
        initialData={selected}
        onSubmit={(v: InvestorFormValues) => handleSubmit(v)}
        isLoading={submitLoading}
      />
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
        title="Delete investor"
        description={`Delete "${deleteTarget?.name ?? 'this investor'}"? This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </section>
  );
}