import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type ChipColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type ChipVariant = 'flat' | 'solid' | 'bordered' | 'light' | 'dot';

const solid: Record<ChipColor, string> = {
    default: 'bg-default-200 text-foreground',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    danger: 'bg-danger text-white',
};

const flat: Record<ChipColor, string> = {
    default: 'bg-default-100 text-default-700',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
};

const light: Record<ChipColor, string> = {
    default: 'bg-transparent text-default-700',
    primary: 'bg-primary/5 text-primary',
    secondary: 'bg-secondary/5 text-secondary',
    success: 'bg-success/5 text-success',
    warning: 'bg-warning/5 text-warning',
    danger: 'bg-danger/5 text-danger',
};

const bordered: Record<ChipColor, string> = {
    default: 'border border-default-300 text-foreground',
    primary: 'border border-primary text-primary',
    secondary: 'border border-secondary text-secondary',
    success: 'border border-success text-success',
    warning: 'border border-warning text-warning',
    danger: 'border border-danger text-danger',
};

const dotColor: Record<ChipColor, string> = {
    default: 'bg-default-500',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
};

const compoundVariants = [
    ...Object.entries(flat).map(([color, classes]) => ({
        color: color as ChipColor,
        variant: 'flat' as const,
        class: classes,
    })),
    ...Object.entries(solid).map(([color, classes]) => ({
        color: color as ChipColor,
        variant: 'solid' as const,
        class: classes,
    })),
    ...Object.entries(bordered).map(([color, classes]) => ({
        color: color as ChipColor,
        variant: 'bordered' as const,
        class: classes,
    })),
    ...Object.entries(light).map(([color, classes]) => ({
        color: color as ChipColor,
        variant: 'light' as const,
        class: classes,
    })),
];

const chipVariants = cva(
    'inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-colors text-center',
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
                flat: '',
                solid: '',
                bordered: '',
                light: '',
                dot: 'bg-default-100 text-foreground',
            },
            size: {
                sm: 'h-auto min-h-6 px-2 py-0.5 text-xs',
                md: 'h-auto min-h-7 px-3 py-1 text-sm',
                lg: 'h-auto min-h-9 px-4 py-1.5 text-sm',
            },
        },
        compoundVariants,
        defaultVariants: {
            color: 'default',
            variant: 'flat',
            size: 'md',
        },
    },
);

export interface ChipProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
    color?: ChipColor;
    startContent?: React.ReactNode;
}

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(({
    className,
    variant = 'flat',
    color = 'default',
    size = 'md',
    startContent,
    children,
    ...props
}, ref) => (
    <span
        ref={ref}
        className={cn(chipVariants({ variant, size, color }), className)}
        {...props}
    >
        {variant === 'dot' && (
            <span
                className={cn('size-2 shrink-0 rounded-full', dotColor[color as ChipColor])}
                aria-hidden="true"
            />
        )}
        {startContent}
        {children}
    </span>
));
Chip.displayName = 'Chip';

export { Chip, chipVariants };
