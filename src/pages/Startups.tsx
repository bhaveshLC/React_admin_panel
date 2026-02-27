import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { startupsService } from '@/services/api';
import type { Startup } from '@/types/models';

export function Startups() {
  const [data, setData] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await startupsService.list();
        setData(res.data.data);
      } catch {
        toast.error('Failed to fetch startups');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns = useMemo<ColumnDef<Startup>[]>(() => [
    { accessorKey: 'companyName', header: 'Company' },
    { accessorKey: 'industry', header: 'Industry' },
    { accessorKey: 'fundingStage', header: 'Stage' },
    { accessorKey: 'teamSize', header: 'Team Size' },
    { accessorKey: 'location', header: 'Location' },
  ], []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Startups</h2>
      <DataTable data={data} columns={columns} searchKey="companyName" isLoading={loading} actionNode={<Button><Plus className="h-4 w-4" />Add Startup</Button>} />
    </section>
  );
}
