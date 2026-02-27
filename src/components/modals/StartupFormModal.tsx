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
import type { Startup } from '@/types/models';

const startupSchema = z.object({
  logo: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  logoFile: z.instanceof(File).optional(),
  companyName: z.string().min(2, 'Company name is required'),
  tagline: z.string().min(2, 'Tagline is required'),
  description: z.string().min(10, 'Description is required'),
  industry: z.string().min(2, 'Industry is required'),
  fundingStage: z.enum(['Idea', 'PreSeed', 'Seed', 'SeriesA', 'SeriesB', 'Bootstrapped']),
  foundedYear: z.coerce.number().int().min(1900, 'Enter valid year').max(new Date().getFullYear(), 'Year cannot be in future'),
  teamSize: z.coerce.number().int().min(1, 'Team size must be at least 1'),
  location: z.string().min(2, 'Location is required'),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

export type StartupFormValues = z.infer<typeof startupSchema>;

const STARTUP_DEFAULT_VALUES: StartupFormValues = {
  logo: '',
  companyName: '',
  tagline: '',
  description: '',
  industry: '',
  fundingStage: 'Idea',
  foundedYear: new Date().getFullYear(),
  teamSize: 1,
  location: '',
  website: '',
};

interface StartupFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Startup;
  onSubmit: (values: StartupFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function StartupFormModal({ open, onOpenChange, initialData, onSubmit, isLoading }: StartupFormModalProps) {
  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupSchema),
    defaultValues: STARTUP_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        logo: initialData.logo ?? '',
        companyName: initialData.companyName,
        tagline: initialData.tagline,
        description: initialData.description,
        industry: initialData.industry,
        fundingStage: initialData.fundingStage,
        foundedYear: initialData.foundedYear,
        teamSize: initialData.teamSize,
        location: initialData.location,
        website: initialData.website ?? '',
      });
    } else {
      form.reset(STARTUP_DEFAULT_VALUES);
    }
  }, [initialData, form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Startup' : 'Add Startup'}</DialogTitle>
        </DialogHeader>

        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label="Logo URL" error={form.formState.errors.logo?.message}><Input {...form.register('logo')} /></Field>
          <Field label="Company Name" error={form.formState.errors.companyName?.message}><Input {...form.register('companyName')} /></Field>
          <Field label="Tagline" error={form.formState.errors.tagline?.message}><Input {...form.register('tagline')} /></Field>
          <Field label="Industry" error={form.formState.errors.industry?.message}><Input {...form.register('industry')} /></Field>
          <Field label="Funding Stage" error={form.formState.errors.fundingStage?.message}>
            <Select
              value={form.watch('fundingStage')}
              onChange={(value) => form.setValue('fundingStage', value as StartupFormValues['fundingStage'])}
              options={[
                { value: 'Idea', label: 'Idea' },
                { value: 'PreSeed', label: 'Pre Seed' },
                { value: 'Seed', label: 'Seed' },
                { value: 'SeriesA', label: 'Series A' },
                { value: 'SeriesB', label: 'Series B' },
                { value: 'Bootstrapped', label: 'Bootstrapped' },
              ]}
            />
          </Field>
          <Field label="Founded Year" error={form.formState.errors.foundedYear?.message}><Input type="number" {...form.register('foundedYear')} /></Field>
          <Field label="Team Size" error={form.formState.errors.teamSize?.message}><Input type="number" {...form.register('teamSize')} /></Field>
          <Field label="Location" error={form.formState.errors.location?.message}><Input {...form.register('location')} /></Field>
          <Field label="Website" error={form.formState.errors.website?.message}><Input {...form.register('website')} /></Field>
          <div className="md:col-span-2">
            <Field label="Description" error={form.formState.errors.description?.message}><Textarea {...form.register('description')} /></Field>
          </div>

          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? 'Update Startup' : 'Create Startup'}
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
