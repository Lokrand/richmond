import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type BadgeColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type BadgeVariant = 'solid' | 'flat' | 'outline' | 'dot';

const solid: Record<BadgeColor, string> = {
    default: 'border-transparent bg-default-100 text-foreground',
    primary: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    success: 'border-transparent bg-success text-success-foreground',
    warning: 'border-transparent bg-warning text-warning-foreground',
    danger: 'border-transparent bg-danger text-white',
};

const flat: Record<BadgeColor, string> = {
    default: 'border-transparent bg-default-100 text-default-700',
    primary: 'border-transparent bg-primary/10 text-primary',
    secondary: 'border-transparent bg-secondary/10 text-secondary',
    success: 'border-transparent bg-success/10 text-success',
    warning: 'border-transparent bg-warning/10 text-warning',
    danger: 'border-transparent bg-danger/10 text-danger',
};

const dotColor: Record<BadgeColor, string> = {
    default: 'bg-default-500',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
};

const badgeVariants = cva(
    'inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none',
    {
        variants: {
            color: {
                default: '',
                primary: '',
                secondary: '',
                success: '',
                warning: '',
                danger: '',
            },
            variant: {
                solid,
                flat,
                dot: 'border-transparent bg-default-100 text-foreground',
                outline: 'border-border bg-transparent text-foreground',
            },
            size: {
                sm: 'px-2 text-xs',
                md: 'px-2.5 py-0.5 text-xs',
                lg: 'px-3 py-1 text-sm',
            },
        },
        defaultVariants: {
            color: 'default',
            variant: 'flat',
            size: 'md',
        },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
    color?: BadgeColor;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
    className,
    variant = 'flat',
    color = 'default',
    size = 'md',
    children,
    ...props
}, ref) => (
    <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), variant === 'flat' && color !== 'default' && flat[color], variant === 'solid' && color !== 'default' && solid[color], className)}
        {...props}
    >
        {variant === 'dot' && (
            <span
                className={cn('size-2 rounded-full', dotColor[color as BadgeColor])}
                aria-hidden="true"
            />
        )}
        {children}
    </span>
));
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
