import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { investorsService } from '@/services/api';
import type { Investor } from '@/types/models';

export function Investors() {
  const [data, setData] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await investorsService.list();
        setData(res.data);
      } catch {
        toast.error('Failed to fetch investors');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns = useMemo<ColumnDef<Investor>[]>(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'firmName', header: 'Firm' },
    { accessorKey: 'investmentStage', header: 'Stage' },
    { accessorKey: 'investmentRange', header: 'Range' },
    { accessorKey: 'location', header: 'Location' },
  ], []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Investors</h2>
      <DataTable data={data} columns={columns} searchKey="name" isLoading={loading} actionNode={<Button><Plus className="h-4 w-4" />Add Investor</Button>} />
    </section>
  );
}
