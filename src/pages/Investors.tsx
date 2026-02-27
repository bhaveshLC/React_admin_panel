import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@/components/modals/DeleteConfirmDialog';
import { InvestorFormModal, type InvestorFormValues } from '@/components/modals/InvestorFormModal';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { investorsService } from '@/services/api';
import type { Investor } from '@/types/models';

export function Investors() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selected, setSelected] = useState<Investor | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Investor | undefined>();

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const { data } = await investorsService.list();
      setInvestors(data);
    } catch {
      toast.error('Failed to fetch investors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  const onSubmit = async (values: InvestorFormValues) => {
    try {
      setSubmitLoading(true);
      if (selected?._id) {
        await investorsService.update(selected._id, values);
        toast.success('Investor updated');
      } else {
        await investorsService.create(values);
        toast.success('Investor created');
      }
      setModalOpen(false);
      setSelected(undefined);
      await fetchInvestors();
    } catch {
      toast.error('Failed to save investor');
    } finally {
      setSubmitLoading(false);
    }
  };

  const onDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await investorsService.remove(deleteTarget._id);
      toast.success('Investor deleted');
      await fetchInvestors();
    } catch {
      toast.error('Failed to delete investor');
    } finally {
      setDeleteTarget(undefined);
    }
  };

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
      <h2 className="text-2xl font-semibold">Investors</h2>
      <DataTable
        data={investors}
        columns={columns}
        searchKey="name"
        isLoading={loading}
        emptyText="No investors found. Add your first investor."
        actionNode={
          <Button
            onClick={() => {
              setSelected(undefined);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Investor
          </Button>
        }
      />

      <InvestorFormModal open={modalOpen} onOpenChange={setModalOpen} initialData={selected} onSubmit={onSubmit} isLoading={submitLoading} />
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
        title="Delete investor"
        description={`Delete ${deleteTarget?.name ?? 'this investor'}? This cannot be undone.`}
        onConfirm={onDelete}
      />
    </section>
  );
}
