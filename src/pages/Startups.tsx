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
  const [modalOpen, setModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selected, setSelected] = useState<Startup | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Startup | undefined>();

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const { data } = await startupsService.list();
      setStartups(data);
    } catch {
      toast.error('Failed to fetch startups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const onSubmit = async (values: StartupFormValues) => {
    try {
      setSubmitLoading(true);
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

      if (values.logoFile) {
        payload.append('logo', values.logoFile);
      } else if (values.logo) {
        payload.append('logo', values.logo);
      }

      if (selected?._id) {
        await startupsService.update(selected._id, payload);
        toast.success('Startup updated');
      } else {
        await startupsService.create(payload);
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

      <StartupFormModal open={modalOpen} onOpenChange={setModalOpen} initialData={selected} onSubmit={onSubmit} isLoading={submitLoading} />
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
