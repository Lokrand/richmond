import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: React.ReactNode;
    isInvalid?: boolean;
    errorMessage?: string;
    isRequired?: boolean;
    minRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
    className,
    label,
    isInvalid,
    errorMessage,
    isRequired,
    minRows,
    rows,
    id,
    ...props
}, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            {label && (
                <label htmlFor={textareaId} className="text-sm font-medium text-foreground/80">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                id={textareaId}
                required={isRequired}
                rows={rows ?? minRows ?? 3}
                className={cn(
                    'flex min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
                    'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
                    isInvalid && 'border-danger-400 focus-visible:ring-danger-400',
                )}
                {...props}
            />
            {isInvalid && errorMessage && (
                <p className="text-sm text-danger">{errorMessage}</p>
            )}
        </div>
    );
});
Textarea.displayName = 'Textarea';

export { Textarea };
