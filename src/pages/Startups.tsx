import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { DeleteConfirmDialog } from '@/components/modals/DeleteConfirmDialog';
import { StartupFormModal, type StartupFormValues } from '@/components/modals/StartupFormModal';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { startupsService } from '@/services/api';
import type { Startup } from '@/types/models';
import { useCrudPage } from '@/hooks/UseCrudPage';

/** Build the multipart FormData payload expected by the startups API */
function buildStartupPayload(values: StartupFormValues): FormData {
  const payload = new FormData();
  payload.append('companyName', values.companyName);
  payload.append('tagline', values.tagline);
  payload.append('description', values.description);
  payload.append('industry', values.industry);
  payload.append('fundingStage', values.fundingStage);
  payload.append('foundedYear', String(values.foundedYear));
  payload.append('teamSize', String(values.teamSize));
  payload.append('location', values.location);
  if (values.website) payload.append('website', values.website);
  if (values.logoFile) payload.append('logo', values.logoFile);
  return payload;
}

export function Startups() {
  const {
    items: startups,
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
  } = useCrudPage<Startup>({
    service: startupsService as never,
    entityName: 'Startup',
    getId: (s) => s._id,
  });

  const onSubmit = (values: StartupFormValues) =>
    handleSubmit(values, (v) => buildStartupPayload(v as StartupFormValues));

  const columns = useMemo<ColumnDef<Startup>[]>(
    () => [
      {
        accessorKey: 'companyName',
        header: 'Company',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.original.logo && (
              <img
                src={row.original.logo}
                alt={row.original.companyName}
                className="h-7 w-7 rounded object-cover border shrink-0"
              />
            )}
            <span>{row.original.companyName}</span>
          </div>
        ),
      },
      { accessorKey: 'industry', header: 'Industry' },
      { accessorKey: 'fundingStage', header: 'Stage' },
      { accessorKey: 'teamSize', header: 'Team Size' },
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
      <h2 className="text-2xl font-semibold">Startups</h2>
      <DataTable
        data={startups}
        columns={columns}
        searchKey="companyName"
        isLoading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        emptyText="No startups found. Add your first startup."
        actionNode={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Startup
          </Button>
        }
      />

      <StartupFormModal
        open={modalOpen}
        onOpenChange={closeModal}
        initialData={selected}
        onSubmit={onSubmit}
        isLoading={submitLoading}
      />
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
        title="Delete startup"
        description={`Delete "${deleteTarget?.companyName ?? 'this startup'}"? This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </section>
  );
}