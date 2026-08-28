import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type ButtonColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type ButtonVariant = 'solid' | 'flat' | 'shadow' | 'bordered' | 'ghost' | 'light';

const solid: Record<ButtonColor, string> = {
    default: 'bg-default-200 text-foreground hover:bg-default-300',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    success: 'bg-success text-success-foreground hover:bg-success/90',
    warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
    danger: 'bg-danger text-white hover:bg-danger/90',
};

const shadow: Record<ButtonColor, string> = {
    default: 'bg-default-200 text-foreground hover:bg-default-300 shadow-lg shadow-default-300/40',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/40',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/40',
    success: 'bg-success text-success-foreground hover:bg-success/90 shadow-lg shadow-success/40',
    warning: 'bg-warning text-warning-foreground hover:bg-warning/90 shadow-lg shadow-warning/40',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-lg shadow-danger/40',
};

const flat: Record<ButtonColor, string> = {
    default: 'bg-default-100 text-foreground hover:bg-default-200',
    primary: 'bg-primary/10 text-primary hover:bg-primary/20',
    secondary: 'bg-secondary/10 text-secondary hover:bg-secondary/20',
    success: 'bg-success/10 text-success hover:bg-success/20',
    warning: 'bg-warning/10 text-warning hover:bg-warning/20',
    danger: 'bg-danger/10 text-danger hover:bg-danger/20',
};

const bordered: Record<ButtonColor, string> = {
    default: 'border border-default-300 text-foreground hover:bg-default-100',
    primary: 'border border-primary text-primary hover:bg-primary/10',
    secondary: 'border border-secondary text-secondary hover:bg-secondary/10',
    success: 'border border-success text-success hover:bg-success/10',
    warning: 'border border-warning text-warning hover:bg-warning/10',
    danger: 'border border-danger text-danger hover:bg-danger/10',
};

const ghost: Record<ButtonColor, string> = {
    default: 'text-foreground hover:bg-default-100',
    primary: 'text-primary hover:bg-primary/10',
    secondary: 'text-secondary hover:bg-secondary/10',
    success: 'text-success hover:bg-success/10',
    warning: 'text-warning hover:bg-warning/10',
    danger: 'text-danger hover:bg-danger/10',
};

const variantColorClasses: Record<ButtonVariant, Record<ButtonColor, string>> = {
    solid,
    shadow,
    flat,
    bordered,
    ghost,
    light: ghost,
};

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    {
        variants: {
            variant: {
                solid: '',
                shadow: 'shadow-lg',
                flat: '',
                bordered: 'border',
                ghost: '',
                light: '',
            },
            size: {
                sm: 'h-9 gap-1.5 rounded-md px-3 text-sm',
                md: 'h-10 gap-2 rounded-md px-4 py-2',
                lg: 'h-12 gap-2 rounded-lg px-6 text-base',
            },
        },
        defaultVariants: {
            variant: 'solid',
            size: 'md',
        },
    },
);

const iconOnlySizes = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
};

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    color?: ButtonColor;
    href?: string;
    target?: string;
    isIconOnly?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
    asChild?: boolean;
    as?: React.ElementType;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    onPress?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'solid',
    size = 'md',
    color = 'default',
    isIconOnly,
    isLoading,
    isDisabled,
    disabled,
    asChild,
    as,
    startContent,
    endContent,
    onPress,
    onClick,
    type,
    children,
    ...props
}, ref) => {
    const Component = asChild ? Slot : (as as React.ElementType) || 'button';

    return (
        <Component
            ref={ref}
            type={type ?? (asChild || as ? undefined : 'button')}
            disabled={disabled ?? isDisabled}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                onPress?.();
                onClick?.(e);
            }}
            className={cn(
                buttonVariants({ variant, size }),
                variantColorClasses[variant ?? 'solid'][color ?? 'default'],
                isIconOnly && iconOnlySizes[size ?? 'md'],
                className,
            )}
            {...props}
        >
            {!asChild && (isLoading ? (
                <span
                    aria-hidden="true"
                    className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
            ) : (
                startContent
            ))}
            {children}
            {!asChild && !isLoading && endContent}
        </Component>
    );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
