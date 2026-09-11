'use client';

import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PhotoProvider } from 'react-photo-view';
import { TooltipProvider } from '@/components/ui/tooltip';
import Toaster from '@/components/ui/sonner';
import 'react-photo-view/dist/react-photo-view.css';

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

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => undefined);
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <PhotoProvider
                    maskOpacity={0.9}
                    bannerVisible={false}
                    photoClosable
                    pullClosable
                    loop={0}
                >
                    {children}
                </PhotoProvider>
                <Toaster />
            </TooltipProvider>

            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default Providers;
