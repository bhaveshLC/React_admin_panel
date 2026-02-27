import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@/components/modals/DeleteConfirmDialog';
import { StartupFormModal, type StartupFormValues } from '@/components/modals/StartupFormModal';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { startupsService } from '@/services/api';
import type { Startup } from '@/types/models';

export function Startups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selected, setSelected] = useState<Startup | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Startup | undefined>();

  const fetchStartups = async (targetPage = page) => {
    try {
      setLoading(true);
      const { data } = await startupsService.list({ page: targetPage });
      setStartups(data.data ?? []);
      setPage(data.page ?? targetPage);
      setTotalPages(data.totalPages ?? 1);
      setTotalItems(data.total ?? 0);
    } catch {
      toast.error('Failed to fetch startups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups(page);
  }, [page]);

  const onSubmit = async (values: StartupFormValues) => {
    try {
      setSubmitLoading(true);
      if (selected?._id) {
        await startupsService.update(selected._id, values);
        toast.success('Startup updated');
      } else {
        await startupsService.create(values);
        toast.success('Startup created');
      }
      setModalOpen(false);
      setSelected(undefined);
      await fetchStartups();
    } catch {
      toast.error('Failed to save startup');
    } finally {
      setSubmitLoading(false);
    }
  };

  const onDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await startupsService.remove(deleteTarget._id);
      toast.success('Startup deleted');
      await fetchStartups();
    } catch {
      toast.error('Failed to delete startup');
    } finally {
      setDeleteTarget(undefined);
    }
  };

  const columns = useMemo<ColumnDef<Startup>[]>(
    () => [
      { accessorKey: 'companyName', header: 'Company' },
      { accessorKey: 'industry', header: 'Industry' },
      { accessorKey: 'fundingStage', header: 'Stage' },
      { accessorKey: 'teamSize', header: 'Team Size' },
      { accessorKey: 'location', header: 'Location' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelected(row.original);
                setModalOpen(true);
              }}
            >
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
    [],
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
          <Button
            onClick={() => {
              setSelected(undefined);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Startup
          </Button>
        }
      />

      <StartupFormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setSelected(undefined);
        }}
        initialData={selected}
        onSubmit={onSubmit}
        isLoading={submitLoading}
      />
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
        title="Delete startup"
        description={`Delete ${deleteTarget?.companyName ?? 'this startup'}? This cannot be undone.`}
        onConfirm={onDelete}
      />
    </section>
  );
}
