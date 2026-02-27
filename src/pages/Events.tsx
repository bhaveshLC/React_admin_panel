import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { EventFormModal, type EventFormValues } from '@/components/modals/EventFormModal';
import { DeleteConfirmDialog } from '@/components/modals/DeleteConfirmDialog';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { eventsService } from '@/services/api';
import type { Event } from '@/types/models';

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selected, setSelected] = useState<Event | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Event | undefined>();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await eventsService.list();
      setEvents(data);
    } catch {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onSubmit = async (values: EventFormValues) => {
    try {
      setSubmitLoading(true);
      if (selected?._id) {
        await eventsService.update(selected._id, values);
        toast.success('Event updated');
      } else {
        await eventsService.create(values);
        toast.success('Event created');
      }
      setModalOpen(false);
      setSelected(undefined);
      await fetchEvents();
    } catch {
      toast.error('Failed to save event');
    } finally {
      setSubmitLoading(false);
    }
  };

  const onDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await eventsService.remove(deleteTarget._id);
      toast.success('Event deleted');
      await fetchEvents();
    } catch {
      toast.error('Failed to delete event');
    } finally {
      setDeleteTarget(undefined);
    }
  };

  const columns = useMemo<ColumnDef<Event>[]>(() => [
    { accessorKey: 'title', header: 'Title' },
    {
      accessorKey: 'eventDate',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.eventDate).toLocaleDateString(),
    },
    { accessorKey: 'cordinatorName', header: 'Coordinator' },
    { accessorKey: 'eventType', header: 'Type' },
    { accessorKey: 'eventStatus', header: 'Status' },
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
  ], []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Events</h2>
      <DataTable
        data={events}
        columns={columns}
        searchKey="title"
        isLoading={loading}
        emptyText="No events found. Create your first event."
        actionNode={
          <Button
            onClick={() => {
              setSelected(undefined);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        }
      />

      <EventFormModal open={modalOpen} onOpenChange={setModalOpen} initialData={selected} onSubmit={onSubmit} isLoading={submitLoading} />
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
        title="Delete event"
        description={`Delete ${deleteTarget?.title ?? 'this event'}? This cannot be undone.`}
        onConfirm={onDelete}
      />
    </section>
  );
}
