import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type SheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

export interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, defaultOpen = false, onOpenChange, children }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <SheetContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export interface SheetTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export function SheetTrigger({ asChild = false, className, children, ...props }: SheetTriggerProps) {
  const context = React.useContext(SheetContext);
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

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right' | 'top' | 'bottom';
}



export function SheetContent({ side = 'right', className, children, ...props }: SheetContentProps) {
  const context = React.useContext(SheetContext);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!context || !context.open || !mounted) return null;

  const sideClasses =
    side === 'left'
      ? 'left-0 top-0 h-full w-80'
      : side === 'right'
        ? 'right-0 top-0 h-full w-80'
        : side === 'top'
          ? 'left-0 top-0 w-full h-80'
          : 'left-0 bottom-0 w-full h-80'; // Bottom sheet height fixed to 80? MobileNav overrides it with className

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => context.setOpen(false)}
      />
      <div
        className={cn(
          'absolute bg-background shadow-lg border p-4 overflow-auto',
          sideClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-1.5', className)} {...props} />
));

SheetHeader.displayName = 'SheetHeader';

export const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
));

SheetTitle.displayName = 'SheetTitle';
