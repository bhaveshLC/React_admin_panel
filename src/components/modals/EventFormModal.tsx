import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Event } from '@/types/models';

const eventSchema = z.object({
  image: z.string().url().optional().or(z.literal('')),
  title: z.string().min(2, 'Title is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  description: z.string().min(10, 'Description is required'),
  cordinatorName: z.string().min(2, 'Coordinator name is required'),
  cordinatorMobile: z.string().regex(/^\d{10}$/, 'Enter valid 10-digit mobile number'),
  eventType: z.enum(['Participating', 'NonParticipating']),
  eventStatus: z.enum(['Past', 'Ongoing']),
});

export type EventFormValues = z.infer<typeof eventSchema>;

const defaultFormValues: EventFormValues = {
  image: '',
  title: '',
  eventDate: '',
  description: '',
  cordinatorName: '',
  cordinatorMobile: '',
  eventType: 'Participating',
  eventStatus: 'Ongoing',
};

interface EventFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Event;
  onSubmit: (values: EventFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function EventFormModal({ open, onOpenChange, initialData, onSubmit, isLoading }: EventFormModalProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      form.reset({ ...initialData, eventDate: initialData.eventDate.slice(0, 10) });
    } else {
      form.reset(defaultFormValues);
    }
  }, [initialData, form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>

        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label="Image URL" error={form.formState.errors.image?.message}><Input {...form.register('image')} /></Field>
          <Field label="Title" error={form.formState.errors.title?.message}><Input {...form.register('title')} /></Field>
          <Field label="Event Date" error={form.formState.errors.eventDate?.message}><Input type="date" {...form.register('eventDate')} /></Field>
          <Field label="Coordinator Name" error={form.formState.errors.cordinatorName?.message}><Input {...form.register('cordinatorName')} /></Field>
          <Field label="Coordinator Mobile" error={form.formState.errors.cordinatorMobile?.message}><Input {...form.register('cordinatorMobile')} /></Field>
          <Field label="Event Type" error={form.formState.errors.eventType?.message}>
            <Select value={form.watch('eventType')} onChange={(v) => form.setValue('eventType', v as EventFormValues['eventType'])} options={[{ value: 'Participating', label: 'Participating' }, { value: 'NonParticipating', label: 'Non Participating' }]} />
          </Field>
          <Field label="Event Status" error={form.formState.errors.eventStatus?.message}>
            <Select value={form.watch('eventStatus')} onChange={(v) => form.setValue('eventStatus', v as EventFormValues['eventStatus'])} options={[{ value: 'Past', label: 'Past' }, { value: 'Ongoing', label: 'Ongoing' }]} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description" error={form.formState.errors.description?.message}><Textarea {...form.register('description')} /></Field>
          </div>

          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </label>
  );
}