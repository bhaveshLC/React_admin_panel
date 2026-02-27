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
import type { Investor } from '@/types/models';

const investorSchema = z.object({
  profileImage: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  profileImageFile: z.instanceof(File).optional(),
  name: z.string().min(2, 'Name is required'),
  firmName: z.string().min(2, 'Firm name is required'),
  bio: z.string().min(10, 'Bio is required'),
  investmentFocus: z.string().min(2, 'Investment focus is required'),
  investmentStage: z.enum(['PreSeed', 'Seed', 'SeriesA', 'SeriesB', 'Growth']),
  investmentRange: z.string().min(2, 'Investment range is required'),
  location: z.string().min(2, 'Location is required'),
  linkedin: z.string().url('Enter a valid LinkedIn URL').optional().or(z.literal('')),
});

export type InvestorFormValues = z.infer<typeof investorSchema>;

interface InvestorFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Investor;
  onSubmit: (values: InvestorFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function InvestorFormModal({ open, onOpenChange, initialData, onSubmit, isLoading }: InvestorFormModalProps) {
  const form = useForm<InvestorFormValues>({
    resolver: zodResolver(investorSchema),
    defaultValues: {
      profileImage: '',
      profileImageFile: undefined,
      name: '',
      firmName: '',
      bio: '',
      investmentFocus: '',
      investmentStage: 'PreSeed',
      investmentRange: '',
      location: '',
      linkedin: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        profileImage: initialData.profileImage ?? '',
        profileImageFile: undefined,
        name: initialData.name,
        firmName: initialData.firmName,
        bio: initialData.bio,
        investmentFocus: initialData.investmentFocus,
        investmentStage: initialData.investmentStage,
        investmentRange: initialData.investmentRange,
        location: initialData.location,
        linkedin: initialData.linkedin ?? '',
      });
    } else {
      form.reset();
    }
  }, [initialData, form, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Investor' : 'Add Investor'}</DialogTitle>
        </DialogHeader>

        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label="Upload Profile Image" error={form.formState.errors.profileImageFile?.message}>
            <Input type="file" accept="image/*" onChange={(e) => form.setValue('profileImageFile', e.target.files?.[0])} />
            {form.watch('profileImage') && <p className="text-xs text-muted-foreground">Current: {form.watch('profileImage')}</p>}
          </Field>
          <Field label="Name" error={form.formState.errors.name?.message}><Input {...form.register('name')} /></Field>
          <Field label="Firm Name" error={form.formState.errors.firmName?.message}><Input {...form.register('firmName')} /></Field>
          <Field label="Investment Focus" error={form.formState.errors.investmentFocus?.message}><Input {...form.register('investmentFocus')} /></Field>
          <Field label="Investment Stage" error={form.formState.errors.investmentStage?.message}>
            <Select
              value={form.watch('investmentStage')}
              onChange={(value) => form.setValue('investmentStage', value as InvestorFormValues['investmentStage'])}
              options={[
                { value: 'PreSeed', label: 'Pre Seed' },
                { value: 'Seed', label: 'Seed' },
                { value: 'SeriesA', label: 'Series A' },
                { value: 'SeriesB', label: 'Series B' },
                { value: 'Growth', label: 'Growth' },
              ]}
            />
          </Field>
          <Field label="Investment Range" error={form.formState.errors.investmentRange?.message}><Input {...form.register('investmentRange')} /></Field>
          <Field label="Location" error={form.formState.errors.location?.message}><Input {...form.register('location')} /></Field>
          <Field label="LinkedIn URL" error={form.formState.errors.linkedin?.message}><Input {...form.register('linkedin')} /></Field>
          <div className="md:col-span-2">
            <Field label="Bio" error={form.formState.errors.bio?.message}><Textarea {...form.register('bio')} /></Field>
          </div>

          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? 'Update Investor' : 'Create Investor'}
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
