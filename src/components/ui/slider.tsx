'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

type SliderColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';

const sliderColors: Record<SliderColor, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    default: 'bg-default-500',
};

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { color?: SliderColor }
>(({ className, color = 'primary', ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            'relative flex w-full touch-none select-none items-center',
            className,
        )}
        {...props}
    >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
            <SliderPrimitive.Range
                className={cn('absolute h-full', sliderColors[color])}
            />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-4 shrink-0 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
export default Slider;
