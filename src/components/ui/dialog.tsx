import * as React from 'react';
import { cn } from '@/lib/utils';

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DialogContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export interface DialogTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export function DialogTrigger({ asChild = false, className, children, ...props }: DialogTriggerProps) {
  const context = React.useContext(DialogContext);
  if (!context) return null;

  const handleClick = () => context.setOpen(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (event: React.MouseEvent) => {
        (children.props as { onClick?: (event: React.MouseEvent) => void }).onClick?.(event);
        handleClick();
      },
      className: cn((children.props as { className?: string }).className, className),
    });
  }

  return (
    <button type="button" className={className} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  const context = React.useContext(DialogContext);
  if (!context || !context.open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 overlay-backdrop"
        onClick={() => context.setOpen(false)}
      />
      <div
        className={cn(
          'absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
));

DialogHeader.displayName = 'DialogHeader';

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
));

DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));

DialogDescription.displayName = 'DialogDescription';

export const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
));

DialogFooter.displayName = 'DialogFooter';
