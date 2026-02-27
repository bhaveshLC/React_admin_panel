import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
export const AlertDialogAction = AlertDialogPrimitive.Action;

export function AlertDialogContent({ className, ...props }: AlertDialogPrimitive.AlertDialogContentProps) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/30" />
      <AlertDialogPrimitive.Content className={cn('fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-soft', className)} {...props} />
    </AlertDialogPrimitive.Portal>
  );
}

export const AlertDialogHeader = (props: React.HTMLAttributes<HTMLDivElement>) => <div className="space-y-2" {...props} />;
export const AlertDialogTitle = (props: AlertDialogPrimitive.AlertDialogTitleProps) => <AlertDialogPrimitive.Title className="text-lg font-semibold" {...props} />;
export const AlertDialogDescription = (props: AlertDialogPrimitive.AlertDialogDescriptionProps) => <AlertDialogPrimitive.Description className="text-sm text-muted-foreground" {...props} />;

export function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-4 flex justify-end gap-2', className)} {...props} />;
}

export function AlertDialogCancelButton(props: AlertDialogPrimitive.AlertDialogCancelProps) {
  return <AlertDialogPrimitive.Cancel className={buttonVariants({ variant: 'outline' })} {...props} />;
}

export function AlertDialogActionButton(props: AlertDialogPrimitive.AlertDialogActionProps) {
  return <AlertDialogPrimitive.Action className={buttonVariants({ variant: 'destructive' })} {...props} />;
}
