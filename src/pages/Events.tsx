import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { EventFormModal, type EventFormValues } from '@/components/modals/EventFormModal';
import { DeleteConfirmDialog } from '@/components/modals/DeleteConfirmDialog';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { eventsService } from '@/services/api';
import type { Event } from '@/types/models';
import { useCrudPage } from '@/hooks/UseCrudPage';

function buildEventPayload(values: EventFormValues): FormData {
  const payload = new FormData();
  payload.append('title', values.title);
  payload.append('eventDate', values.eventDate);
  payload.append('description', values.description);
  payload.append('cordinatorName', values.cordinatorName);
  payload.append('cordinatorMobile', values.cordinatorMobile);
  payload.append('eventType', values.eventType);
  payload.append('eventStatus', values.eventStatus);
  if (values.imageFile) payload.append('image', values.imageFile);
  return payload;
}

export function Events() {
  const {
    items: events,
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
  } = useCrudPage<Event>({
    service: eventsService as never,
    entityName: 'Event',
    getId: (e) => e._id,
  });

  const onSubmit = (values: EventFormValues) =>
    handleSubmit(values, (v) => buildEventPayload(v as EventFormValues));

  const columns = useMemo<ColumnDef<Event>[]>(
    () => [
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
      <h2 className="text-2xl font-semibold">Events</h2>
      <DataTable
        data={events}
        columns={columns}
        searchKey="title"
        isLoading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        emptyText="No events found. Create your first event."
        actionNode={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        }
      />

      <EventFormModal
        open={modalOpen}
        onOpenChange={closeModal}
        initialData={selected}
        onSubmit={onSubmit}
        isLoading={submitLoading}
      />
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
        title="Delete event"
        description={`Delete "${deleteTarget?.title ?? 'this event'}"? This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </section>
  );
}