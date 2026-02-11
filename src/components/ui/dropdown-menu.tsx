import * as React from 'react';
import { cn } from '@/lib/utils';

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function DropdownMenu({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DropdownMenuContext.Provider value={{ open: currentOpen, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps
  extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export function DropdownMenuTrigger({
  asChild = false,
  className,
  children,
  ...props
}: DropdownMenuTriggerProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) return null;

  const handleClick = () => context.setOpen(!context.open);

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
    <button
      type="button"
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end' | 'center';
}

export function DropdownMenuContent({
  className,
  align = 'start',
  ...props
}: DropdownMenuContentProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context || !context.open) return null;

  const alignClasses =
    align === 'end'
      ? 'right-0'
      : align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : 'left-0';

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        alignClasses,
        className
      )}
      {...props}
    />
  );
}

export interface DropdownMenuItemProps
  extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export function DropdownMenuItem({
  asChild = false,
  className,
  children,
  ...props
}: DropdownMenuItemProps) {
  const context = React.useContext(DropdownMenuContext);
  const close = () => context?.setOpen(false);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (event: React.MouseEvent) => {
        (children.props as { onClick?: (event: React.MouseEvent) => void }).onClick?.(event);
        close();
      },
      className: cn(
        'flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors ' +
          'hover:bg-accent hover:text-accent-foreground',
        (children.props as { className?: string }).className,
        className
      ),
    });
  }

  return (
    <div
      role="menuitem"
      className={cn(
        'flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors ' +
          'hover:bg-accent hover:text-accent-foreground',
        className
      )}
      onClick={() => close()}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('my-1 h-px bg-muted', className)} {...props} />;
}
