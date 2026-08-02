import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    isInvalid?: boolean;
    errorMessage?: string;
    isRequired?: boolean;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    onValueChange?: (value: string) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    className,
    type,
    label,
    isInvalid,
    errorMessage,
    isRequired,
    startContent,
    endContent,
    onValueChange,
    onChange,
    id,
    ...props
}, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-foreground/80">
                    {label}
                </label>
            )}
            <div className="relative">
                {startContent && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground">
                        {startContent}
                    </span>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    required={isRequired}
                    onChange={(e) => {
                        onChange?.(e);
                        onValueChange?.(e.target.value);
                    }}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
                        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
                        'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
                        startContent && 'pl-10',
                        endContent && 'pr-10',
                        isInvalid && 'border-danger-400 focus-visible:ring-danger-400',
                    )}
                    {...props}
                />
                {endContent && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground">
                        {endContent}
                    </span>
                )}
            </div>
            {isInvalid && errorMessage && (
                <p className="text-sm text-danger">{errorMessage}</p>
            )}
        </div>
    );
});
Input.displayName = 'Input';

export { Input };
