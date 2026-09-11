import React from 'react';

type StatFieldColor = 'primary' | 'success' | 'secondary' | 'warning' | 'danger';

interface StatFieldProps {
    label: string;
    children: React.ReactNode;
    color?: StatFieldColor;
    className?: string;
}

const colorClasses: Record<StatFieldColor, { border: string; label: string; value: string }> = {
    primary: {
        border: 'border-primary/60 dark:border-primary/50',
        label: 'text-primary',
        value: 'text-primary',
    },
    success: {
        border: 'border-success/60 dark:border-success/50',
        label: 'text-success',
        value: 'text-success',
    },
    secondary: {
        border: 'border-secondary/60 dark:border-secondary/50',
        label: 'text-secondary',
        value: 'text-secondary',
    },
    warning: {
        border: 'border-warning/60 dark:border-warning/50',
        label: 'text-warning',
        value: 'text-warning',
    },
    danger: {
        border: 'border-danger/60 dark:border-danger/50',
        label: 'text-danger',
        value: 'text-danger',
    },
};

const StatField = ({
    label,
    children,
    color = 'primary',
    className = '',
}: StatFieldProps) => {
    const c = colorClasses[color];
    return (
        <fieldset
            className={`min-w-0 rounded-xl border ${c.border} px-3 pb-2 pt-1 ${className}`}
        >
            <legend className={`ml-1 px-1 text-xs font-medium ${c.label}`}>
                {label}
            </legend>
            <div className={`text-sm font-medium text-center ${c.value}`}>
                {children}
            </div>
        </fieldset>
    );
};

export default StatField;
