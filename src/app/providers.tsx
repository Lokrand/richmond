'use client';

import * as React from 'react';

import { HeroUIProvider } from '@heroui/react';

const Providers = ({ children }: { children: React.ReactNode }) => (
    <HeroUIProvider>
        {children}
    </HeroUIProvider>
);

export default Providers;
