'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeroUIProvider } from '@heroui/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const Providers = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,
                    refetchOnWindowFocus: false,
                },
            },
        }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <HeroUIProvider>
                {children}
            </HeroUIProvider>

            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default Providers;
